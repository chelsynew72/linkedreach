import { Injectable, Logger } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { AccountStatus } from '../accounts/account.entity';

// Dynamic import to avoid issues at startup
let puppeteer: any;
let StealthPlugin: any;

@Injectable()
export class LinkedInBrowserService {
  private readonly logger = new Logger(LinkedInBrowserService.name);
  private browsers: Map<string, any> = new Map();

  constructor(private accountsService: AccountsService) {}

  private async getPuppeteer() {
    if (!puppeteer) {
      puppeteer = require('puppeteer-extra');
      StealthPlugin = require('puppeteer-extra-plugin-stealth');
      puppeteer.use(StealthPlugin());
    }
    return puppeteer;
  }

  private async humanDelay(min = 1000, max = 4000): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min) + min);
    await new Promise((r) => setTimeout(r, delay));
  }

  private async getBrowserForAccount(accountId: string) {
    if (this.browsers.has(accountId)) {
      return this.browsers.get(accountId);
    }

    const pup = await this.getPuppeteer();
    const account = await this.accountsService.findOne(accountId, null).catch(() => null);

    let browser;

    // Use Browserless if token is set (production/cloud), otherwise use local Chrome
    if (process.env.BROWSERLESS_TOKEN) {
      this.logger.log('Using Browserless.io cloud browser');
      browser = await pup.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
      });
    } else {
      this.logger.log('Using local Chrome browser');
      const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH ||
        '/usr/bin/google-chrome';

      const launchArgs: string[] = [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-zygote',
        '--disable-gpu',
        '--disable-blink-features=AutomationControlled',
      ];

      if (account?.proxyUrl) {
        launchArgs.push(`--proxy-server=${account.proxyUrl}`);
      }

      browser = await pup.launch({
        headless: 'new',
        executablePath,
        protocolTimeout: 120000,
        timeout: 120000,
        args: launchArgs,
        ignoreDefaultArgs: ['--enable-automation'],
      });
    }

    this.browsers.set(accountId, browser);
    return browser;
  }

  async loginToLinkedIn(accountId: string, email: string, password: string): Promise<boolean> {
    try {
      const browser = await this.getBrowserForAccount(accountId);
      const page = await browser.newPage();

      await page.setViewport({ width: 1280, height: 800 });
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      );

      // Remove webdriver flag that LinkedIn detects
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
        (window as any).chrome = { runtime: {} };
      });

      // Block images and fonts to speed up loading
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (['image', 'font', 'stylesheet'].includes(req.resourceType())) {
          req.abort();
        } else {
          req.continue();
        }
      });

      this.logger.log(`Navigating to LinkedIn login page...`);
      await page.goto('https://www.linkedin.com/login', {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });

      // Wait longer for page to settle
      await this.humanDelay(3000, 5000);

      // Log current URL and page title for debugging
      const currentUrl = page.url();
      const title = await page.title();
      this.logger.log(`Page loaded: ${currentUrl} | Title: ${title}`);

      // Handle cookie consent banner if present
      try {
        const cookieBtn = await page.$('button[action-type="ACCEPT"]') ||
                          await page.$('[data-tracking-control-name="public_jobs_nav-header-logo"]');
        if (cookieBtn) {
          await cookieBtn.click();
          await this.humanDelay(1000, 2000);
        }
      } catch (_) {}

      // Try multiple selectors for email field
      const emailSelectors = ['#username', 'input[name="session_key"]', 'input[type="email"]', 'input[autocomplete="username"]'];
      let emailField = null;
      for (const sel of emailSelectors) {
        try {
          await page.waitForSelector(sel, { timeout: 5000 });
          emailField = await page.$(sel);
          if (emailField) {
            this.logger.log(`Found email field with selector: ${sel}`);
            break;
          }
        } catch (_) {}
      }

      if (!emailField) {
        const pageContent = await page.content();
        this.logger.error(`Could not find email field. URL: ${page.url()}`);
        // Take screenshot for debugging
        await page.screenshot({ path: `/tmp/linkedin_debug_${accountId}.png` });
        this.logger.log(`Debug screenshot saved to /tmp/linkedin_debug_${accountId}.png`);
        await page.close();
        await this.accountsService.updateStatus(accountId, AccountStatus.ERROR, 'Could not find login form - check /tmp/linkedin_debug_*.png');
        return false;
      }

      await emailField.click();
      await emailField.type(email, { delay: Math.random() * 80 + 40 });
      await this.humanDelay(500, 1000);

      // Try multiple selectors for password field
      const passwordSelectors = ['#password', 'input[name="session_password"]', 'input[type="password"]'];
      let passwordField = null;
      for (const sel of passwordSelectors) {
        passwordField = await page.$(sel);
        if (passwordField) break;
      }

      if (!passwordField) {
        await page.close();
        await this.accountsService.updateStatus(accountId, AccountStatus.ERROR, 'Could not find password field');
        return false;
      }

      await passwordField.click();
      await passwordField.type(password, { delay: Math.random() * 80 + 40 });
      await this.humanDelay(800, 1500);

      // Try multiple submit button selectors
      const submitSelectors = [
        '[data-litms-control-urn="login-submit"]',
        'button[type="submit"]',
        '.login__form_action_container button',
        'button[aria-label="Sign in"]',
      ];
      let submitted = false;
      for (const sel of submitSelectors) {
        const btn = await page.$(sel);
        if (btn) {
          await btn.click();
          submitted = true;
          this.logger.log(`Clicked submit with selector: ${sel}`);
          break;
        }
      }

      if (!submitted) {
        await page.keyboard.press('Enter');
      }

      // Wait for navigation
      try {
        await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 });
      } catch (_) {
        // Navigation may have already completed
      }

      await this.humanDelay(2000, 3000);
      const url = page.url();
      this.logger.log(`After login URL: ${url}`);

      if (url.includes('/feed') || url.includes('/mynetwork') || url.includes('/in/')) {
        const cookies = await page.cookies();
        // Try to get profile info
        let profileData: any = { linkedinProfileUrl: url };
        try {
          const nameEl = await page.$('.global-nav__me-photo') || await page.$('[data-control-name="identity_profile_photo"]');
          profileData.profileName = email.split('@')[0];
        } catch (_) {}

        await this.accountsService.saveSession(accountId, JSON.stringify(cookies), profileData);
        await this.accountsService.updateStatus(accountId, AccountStatus.ACTIVE);
        this.logger.log(`✅ Login successful for ${email}`);
        await page.close();
        return true;
      }

      if (url.includes('checkpoint') || url.includes('verify') || url.includes('challenge')) {
        await this.accountsService.updateStatus(
          accountId,
          AccountStatus.REQUIRES_VERIFICATION,
          'LinkedIn requires 2FA or email verification. Please verify manually.',
        );
        await page.close();
        return false;
      }

      await page.screenshot({ path: `/tmp/linkedin_failed_${accountId}.png` });
      await this.accountsService.updateStatus(accountId, AccountStatus.ERROR, `Login failed - ended up at: ${url}`);
      await page.close();
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`Login failed for account ${accountId}: ${errorMessage}`);
      await this.accountsService.updateStatus(accountId, AccountStatus.ERROR, errorMessage);
      return false;
    }
  }

  async sendConnectionRequest(
    accountId: string,
    profileUrl: string,
    note?: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const account = await this.accountsService.findOne(accountId, null).catch(() => null);
      if (!account?.sessionCookies) {
        return { success: false, error: 'No session found' };
      }

      const browser = await this.getBrowserForAccount(accountId);
      const page = await browser.newPage();

      // Restore session cookies
      const cookies = JSON.parse(account.sessionCookies);
      await page.setCookie(...cookies);

      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(profileUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.humanDelay(2000, 4000);

      // Check if already connected
      const connectBtn = await page.$('button[aria-label*="Connect"]');
      if (!connectBtn) {
        await page.close();
        return { success: false, error: 'Connect button not found - may already be connected' };
      }

      await connectBtn.click();
      await this.humanDelay(1000, 2000);

      if (note) {
        const addNoteBtn = await page.$('button[aria-label="Add a note"]');
        if (addNoteBtn) {
          await addNoteBtn.click();
          await this.humanDelay(500, 1000);
          const textarea = await page.$('textarea[name="message"]');
          if (textarea) {
            await textarea.type(note, { delay: 50 });
            await this.humanDelay(500, 1000);
          }
        }
      }

      const sendBtn = await page.$('button[aria-label="Send now"]') ||
                      await page.$('button[aria-label="Send invitation"]');
      if (sendBtn) {
        await sendBtn.click();
        await this.humanDelay(1000, 2000);
      }

      await page.close();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`Connection request failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  async sendMessage(
    accountId: string,
    profileUrl: string,
    message: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const account = await this.accountsService.findOne(accountId, null).catch(() => null);
      if (!account?.sessionCookies) {
        return { success: false, error: 'No session found' };
      }

      const browser = await this.getBrowserForAccount(accountId);
      const page = await browser.newPage();
      const cookies = JSON.parse(account.sessionCookies);
      await page.setCookie(...cookies);
      await page.setViewport({ width: 1280, height: 800 });

      await page.goto(profileUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.humanDelay(2000, 3000);

      const messageBtn = await page.$('button[aria-label*="Message"]');
      if (!messageBtn) {
        await page.close();
        return { success: false, error: 'Message button not found' };
      }

      await messageBtn.click();
      await this.humanDelay(1500, 2500);

      const msgBox = await page.$('.msg-form__contenteditable');
      if (!msgBox) {
        await page.close();
        return { success: false, error: 'Message box not found' };
      }

      await msgBox.click();
      await msgBox.type(message, { delay: 60 });
      await this.humanDelay(800, 1500);

      const sendBtn = await page.$('button.msg-form__send-button');
      if (sendBtn) {
        await sendBtn.click();
        await this.humanDelay(1000, 2000);
      }

      await page.close();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`Message send failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  async viewProfile(accountId: string, profileUrl: string): Promise<boolean> {
    try {
      const account = await this.accountsService.findOne(accountId, null).catch(() => null);
      if (!account?.sessionCookies) return false;

      const browser = await this.getBrowserForAccount(accountId);
      const page = await browser.newPage();
      const cookies = JSON.parse(account.sessionCookies);
      await page.setCookie(...cookies);

      await page.goto(profileUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.humanDelay(3000, 8000); // Linger like a human
      await page.close();
      return true;
    } catch {
      return false;
    }
  }

  async closeBrowser(accountId: string) {
    const browser = this.browsers.get(accountId);
    if (browser) {
      await browser.close();
      this.browsers.delete(accountId);
    }
  }

  async closeAllBrowsers() {
    for (const [id, browser] of this.browsers) {
      await browser.close();
      this.browsers.delete(id);
    }
  }


  /**
   * Checks LinkedIn messaging inbox for new replies from leads.
   * Returns a list of conversations with new inbound messages since last check.
   */
  async checkForNewReplies(accountId: string): Promise<{ profileUrl: string; lastMessage: string; conversationId: string }[]> {
    const replies: { profileUrl: string; lastMessage: string; conversationId: string }[] = [];
    try {
      const account = await this.accountsService.findOne(accountId, null).catch(() => null);
      if (!account?.sessionCookies) return replies;

      const browser = await this.getBrowserForAccount(accountId);
      const page = await browser.newPage();
      const cookies = JSON.parse(account.sessionCookies);
      await page.setCookie(...cookies);
      await page.setViewport({ width: 1280, height: 800 });

      await page.goto('https://www.linkedin.com/messaging/', {
        waitUntil: 'domcontentloaded',
        timeout: 45000,
      });
      await this.humanDelay(2000, 3500);

      const conversations = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.msg-conversation-listitem'));
        return items.slice(0, 20).map((item) => {
          const profileLink = item.querySelector('a.msg-conversation-listitem__link');
          const nameEl = item.querySelector('.msg-conversation-listitem__participant-names');
          const previewEl = item.querySelector('.msg-conversation-card__message-snippet');
          const unread = item.classList.contains('msg-conversation-listitem--unread') ||
                          !!item.querySelector('.notification-badge');
          return {
            profileUrl: profileLink ? (profileLink as HTMLAnchorElement).href : '',
            name: nameEl ? nameEl.textContent?.trim() : '',
            preview: previewEl ? previewEl.textContent?.trim() : '',
            unread,
            conversationId: item.getAttribute('data-conversation-id') || '',
          };
        });
      });

      for (const conv of conversations) {
        if (conv.unread && conv.profileUrl) {
          replies.push({
            profileUrl: conv.profileUrl,
            lastMessage: conv.preview || '',
            conversationId: conv.conversationId || conv.profileUrl,
          });
        }
      }

      await page.close();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Reply check failed for account ${accountId}: ${errorMessage}`);
    }
    return replies;
  }

}
