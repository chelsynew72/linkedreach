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

    const launchArgs: string[] = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ];

    if (account?.proxyUrl) {
      launchArgs.push(`--proxy-server=${account.proxyUrl}`);
    }

    const browser = await pup.launch({
      headless: 'new',
      args: launchArgs,
    });

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

      await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });
      await this.humanDelay(1000, 2000);

      await page.type('#username', email, { delay: Math.random() * 100 + 50 });
      await this.humanDelay(500, 1000);
      await page.type('#password', password, { delay: Math.random() * 100 + 50 });
      await this.humanDelay(800, 1500);

      await page.click('[data-litms-control-urn="login-submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

      const url = page.url();
      if (url.includes('/feed') || url.includes('/in/')) {
        // Save session cookies
        const cookies = await page.cookies();
        await this.accountsService.saveSession(accountId, JSON.stringify(cookies), {
          linkedinProfileUrl: url,
        });
        await this.accountsService.updateStatus(accountId, AccountStatus.ACTIVE);
        await page.close();
        return true;
      }

      if (url.includes('checkpoint') || url.includes('verify')) {
        await this.accountsService.updateStatus(
          accountId,
          AccountStatus.REQUIRES_VERIFICATION,
          'LinkedIn requires verification',
        );
        await page.close();
        return false;
      }

      await this.accountsService.updateStatus(accountId, AccountStatus.ERROR, 'Login failed');
      await page.close();
      return false;
    } catch (err) {
      this.logger.error(`Login failed for account ${accountId}: ${err.message}`);
      await this.accountsService.updateStatus(accountId, AccountStatus.ERROR, err.message);
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
      this.logger.error(`Connection request failed: ${err.message}`);
      return { success: false, error: err.message };
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
      this.logger.error(`Message send failed: ${err.message}`);
      return { success: false, error: err.message };
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
}
