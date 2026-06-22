'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Zap, ArrowRight, CheckCircle, Users, Send,
  MessageSquare, TrendingUp, Shield, Play,
  Star, BarChart3, UserCheck, Menu, X,
} from 'lucide-react';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .nav-link { color: #888; font-size: 14px; transition: color 0.15s; cursor: pointer; }
        .nav-link:hover { color: #fff; }
        .btn-orange { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; background: #f97316; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.15s; font-family: inherit; }
        .btn-orange:hover { background: #ea6c0a; transform: translateY(-1px); box-shadow: 0 8px 30px rgba(249,115,22,0.4); }
        .btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; background: transparent; color: #fff; border: 1px solid #2a2a2a; border-radius: 10px; font-size: 15px; font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.15s; font-family: inherit; }
        .btn-ghost:hover { border-color: #f97316; background: rgba(249,115,22,0.06); }
        .feature-card { background: #111; border: 1px solid #1e1e1e; border-radius: 16px; padding: 28px; transition: all 0.2s; }
        .feature-card:hover { border-color: rgba(249,115,22,0.35); transform: translateY(-2px); }
        .testimonial-card { background: #111; border: 1px solid #1e1e1e; border-radius: 16px; padding: 28px; }
        .pricing-card { background: #111; border: 1px solid #1e1e1e; border-radius: 20px; padding: 36px 32px; }
        .pricing-popular { border-color: #f97316; background: rgba(249,115,22,0.04); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.7s 0.1s ease forwards; opacity: 0; }
        .fade-up-2 { animation: fadeUp 0.7s 0.2s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.7s 0.3s ease forwards; opacity: 0; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .pulse { animation: pulse 2s infinite; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 48px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #1a1a1a' : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={17} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700 }}>LinkedReach</span>
        </Link>

        <div style={{ display: 'flex', gap: 36 }}>
          {['Features', 'How it works', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="nav-link">{item}</a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/login" className="nav-link">Sign in</Link>
          <Link href="/register" className="btn-orange" style={{ padding: '9px 20px', fontSize: 14 }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '60%', left: '25%', width: 300, height: 200, background: 'radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', marginBottom: 32, fontSize: 12, fontWeight: 600, color: '#fb923c', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
          1,200+ sales teams trust LinkedReach
        </div>

        <h1 className="fade-up-1" style={{ fontSize: 'clamp(42px, 7vw, 82px)', fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.03em', marginBottom: 28, maxWidth: 860 }}>
          LinkedIn outreach<br />
          <span style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            at unlimited scale
          </span>
        </h1>

        <p className="fade-up-2" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#888', maxWidth: 540, lineHeight: 1.7, marginBottom: 48 }}>
          Connect multiple LinkedIn accounts, build intelligent outreach sequences, and let LinkedReach handle all the sending — safely and automatically.
        </p>

        <div className="fade-up-3" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 80 }}>
          <Link href="/register" className="btn-orange" style={{ fontSize: 16, padding: '15px 36px' }}>
            Start for free <ArrowRight size={17} />
          </Link>
          <button className="btn-ghost" style={{ fontSize: 16, padding: '15px 36px' }}>
            <Play size={16} fill="currentColor" /> Watch demo
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#1a1a1a', borderRadius: 16, overflow: 'hidden', border: '1px solid #1a1a1a', maxWidth: 680, width: '100%' }}>
          {[['10x', 'More outreach capacity'], ['47%', 'Avg acceptance rate'], ['3 min', 'Setup time'], ['50+', 'Accounts supported']].map(([val, lbl]) => (
            <div key={lbl} style={{ background: '#111', padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#f97316', letterSpacing: '-0.02em', marginBottom: 4 }}>{val}</div>
              <div style={{ fontSize: 12, color: '#555', lineHeight: 1.4 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LOGOS */}
      <section style={{ padding: '40px 48px', borderTop: '1px solid #141414', borderBottom: '1px solid #141414', background: '#0d0d0d' }}>
        <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#333', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 28 }}>Used by teams at</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 56, flexWrap: 'wrap', opacity: 0.35 }}>
          {['VELOCITY', 'NEXUS AI', 'STRATUS', 'SPARK HQ', 'GROWTHLAB'].map(n => (
            <span key={n} style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#fff' }}>{n}</span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '120px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#f97316', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>Everything you need</p>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.12, marginBottom: 20 }}>One platform. Infinite reach.</h2>
          <p style={{ fontSize: 18, color: '#888', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>Everything to turn LinkedIn into a predictable revenue channel.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {[
            { icon: Users, title: 'Multi-Account Rotation', desc: 'Connect unlimited LinkedIn accounts. Our engine distributes sends across all of them — staying safe within daily limits.', color: '#f97316' },
            { icon: Zap, title: 'Sequence Builder', desc: 'Design multi-step outreach with connection requests, messages, profile views, and conditional logic in a visual editor.', color: '#fb923c' },
            { icon: MessageSquare, title: 'Unified Inbox', desc: 'Every LinkedIn reply from every account in one place. Never miss a hot lead buried in a separate account.', color: '#f97316' },
            { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Track acceptance rates, reply rates, and campaign performance across all accounts from a single dashboard.', color: '#fb923c' },
            { icon: Shield, title: 'Safety First', desc: 'Human-like delays, daily limit enforcement, stealth browser mode, and per-account proxy support.', color: '#f97316' },
            { icon: TrendingUp, title: 'Lead Management', desc: 'Import leads via CSV, track every lead through your funnel, and mark prospects as interested or not interested.', color: '#fb923c' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="feature-card">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#777', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '120px 48px', background: '#0d0d0d' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#f97316', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>Simple setup</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>From zero to outreach in minutes</h2>
        </div>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          {[
            { n: '01', title: 'Connect accounts', desc: 'Add LinkedIn accounts. Our stealth engine logs in and saves your session securely.' },
            { n: '02', title: 'Build sequence', desc: 'Create connection requests, follow-up messages, and delays with our visual builder.' },
            { n: '03', title: 'Import leads', desc: 'Upload a CSV of LinkedIn URLs. LinkedReach assigns accounts and starts processing.' },
            { n: '04', title: 'Watch it work', desc: 'Monitor acceptance rates and replies in real time while LinkedReach works 24/7.' },
          ].map(({ n, title, desc }) => (
            <div key={n} style={{ background: '#111', border: '1px solid #1e1e1e', padding: '32px 28px', borderRadius: 16, position: 'relative' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: '0.1em', fontFamily: 'monospace', marginBottom: 16 }}>{n}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '120px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 14 }}>Loved by sales teams</h2>
          <p style={{ fontSize: 17, color: '#888' }}>Don't take our word for it.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { name: 'Marcus Chen', role: 'Head of Sales, Stratus', avatar: 'MC', text: 'We went from 200 outreach touches per week to over 2,000. LinkedReach paid for itself in the first week.' },
            { name: 'Sarah Jenkins', role: 'Founder, Velocity Agency', avatar: 'SJ', text: 'Managing LinkedIn outreach for 12 clients from one dashboard changed everything for our agency.' },
            { name: 'Priya Sharma', role: 'Talent Lead, NexusHQ', avatar: 'PS', text: 'Our candidate response rate went from 8% to 31% after we started using personalised sequences.' },
          ].map(({ name, role, avatar, text }) => (
            <div key={name} className="testimonial-card">
              <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#f97316" color="#f97316" />)}
              </div>
              <p style={{ fontSize: 15, color: '#ccc', lineHeight: 1.7, marginBottom: 24 }}>"{text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#f97316' }}>{avatar}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{name}</p>
                  <p style={{ fontSize: 12, color: '#555' }}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '120px 48px', background: '#0d0d0d' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#f97316', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 14 }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: 17, color: '#888' }}>14-day free trial on all plans. No credit card required.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { name: 'Starter', price: '$99', period: '/mo', desc: 'For individuals', accounts: '3 LinkedIn accounts', features: ['Unlimited campaigns', 'CSV lead import', 'Unified inbox', 'Basic analytics', 'Email support'], highlight: false },
              { name: 'Agency', price: '$799', period: '/mo', desc: 'For agencies', accounts: '50 LinkedIn accounts', features: ['Everything in Starter', 'Team workspace', 'Advanced analytics', 'Priority support', 'Proxy support'], highlight: true },
              { name: 'Unlimited', price: '$1,999', period: '/mo', desc: 'Enterprise scale', accounts: 'Unlimited accounts', features: ['Everything in Agency', 'White-label option', 'Dedicated support', 'SLA guarantee'], highlight: false },
            ].map(({ name, price, period, desc, accounts, features, highlight }) => (
              <div key={name} className={`pricing-card ${highlight ? 'pricing-popular' : ''}`} style={{ position: 'relative' }}>
                {highlight && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#f97316', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 100, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Most popular
                  </div>
                )}
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f97316', marginBottom: 8 }}>{name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 6 }}>
                  <span style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.03em' }}>{price}</span>
                  <span style={{ fontSize: 14, color: '#555' }}>{period}</span>
                </div>
                <p style={{ fontSize: 13, color: '#777', marginBottom: 6 }}>{desc}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f97316', marginBottom: 24 }}>{accounts}</p>
                <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 24, marginBottom: 28 }}>
                  {features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <CheckCircle size={14} color="#f97316" />
                      <span style={{ fontSize: 14, color: '#bbb' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register" className={highlight ? 'btn-orange' : 'btn-ghost'} style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                  Get started {highlight && <ArrowRight size={15} />}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', padding: '72px 48px', background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0.04) 100%)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 24 }}>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.15 }}>Ready to scale your LinkedIn outreach?</h2>
          <p style={{ fontSize: 17, color: '#888', marginBottom: 40, lineHeight: 1.65 }}>Join 1,200+ sales teams using LinkedReach to fill their pipeline on autopilot.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn-orange" style={{ fontSize: 16, padding: '14px 36px' }}>
              Get started free <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="btn-ghost" style={{ fontSize: 16, padding: '14px 36px' }}>Sign in</Link>
          </div>
          <p style={{ fontSize: 12, color: '#333', marginTop: 24 }}>No credit card required · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #141414', padding: '60px 48px 40px', background: '#080808' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={14} color="white" />
                </div>
                <span style={{ fontSize: 16, fontWeight: 700 }}>LinkedReach</span>
              </div>
              <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7, maxWidth: 260 }}>The most powerful LinkedIn automation platform for modern sales teams and growth agencies.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Status'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#333', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>{title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {links.map(l => <a key={l} href="#" className="nav-link" style={{ fontSize: 14 }}>{l}</a>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #141414', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 13, color: '#333' }}>© 2026 LinkedReach. All rights reserved.</p>
            <p style={{ fontSize: 12, color: '#222' }}>Use subject to LinkedIn's Terms of Service.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
