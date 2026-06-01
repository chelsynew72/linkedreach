'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  Zap, ArrowRight, CheckCircle, Users, Send,
  MessageSquare, TrendingUp, Shield, Play,
  ChevronRight, Star, BarChart3, Globe,
  UserCheck, Inbox, Settings2, Menu, X,
} from 'lucide-react';

const STATS = [
  { value: '10x', label: 'More outreach capacity' },
  { value: '47%', label: 'Average acceptance rate' },
  { value: '3min', label: 'Setup time' },
  { value: '50+', label: 'LinkedIn accounts supported' },
];

const FEATURES = [
  {
    icon: Users,
    title: 'Multi-Account Rotation',
    desc: 'Connect unlimited LinkedIn accounts. Our engine distributes sends across all of them automatically — staying safe within daily limits.',
    color: '#7c6af5',
  },
  {
    icon: Zap,
    title: 'Sequence Builder',
    desc: 'Design multi-step outreach with connection requests, follow-up messages, profile views, and conditional logic — all in a visual editor.',
    color: '#34d399',
  },
  {
    icon: MessageSquare,
    title: 'Unified Inbox',
    desc: 'Every LinkedIn reply from every account lands in one place. Never miss a hot lead buried in a separate account again.',
    color: '#60a5fa',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Track acceptance rates, reply rates, and campaign performance across all accounts and campaigns from a single dashboard.',
    color: '#fbbf24',
  },
  {
    icon: Shield,
    title: 'Safety First',
    desc: 'Human-like delays, daily limit enforcement, stealth browser mode, and per-account proxy support keep your accounts safe.',
    color: '#f472b6',
  },
  {
    icon: TrendingUp,
    title: 'Lead Management',
    desc: 'Import leads via CSV, track every lead through your funnel, log every action, and mark prospects as interested or not interested.',
    color: '#fb923c',
  },
];

const STEPS = [
  { n: '01', title: 'Connect your LinkedIn accounts', desc: 'Add one or more LinkedIn accounts. Our stealth engine logs in and saves your session securely.' },
  { n: '02', title: 'Build your outreach sequence', desc: 'Use the visual sequence builder to create connection requests, messages, and follow-ups with personalisation variables.' },
  { n: '03', title: 'Import your leads', desc: 'Upload a CSV of LinkedIn profile URLs. LinkedReach deduplicates, assigns accounts, and begins processing automatically.' },
  { n: '04', title: 'Watch the pipeline fill', desc: 'Monitor acceptance rates, replies, and campaign performance in real time while LinkedReach works in the background.' },
];

const PRICING = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    desc: 'Perfect for individual SDRs',
    accounts: '3 LinkedIn accounts',
    features: ['Unlimited campaigns', 'CSV lead import', 'Unified inbox', 'Basic analytics', 'Email support'],
    cta: 'Start free trial',
    highlight: false,
  },
  {
    name: 'Agency',
    price: '$799',
    period: '/month',
    desc: 'For agencies and teams',
    accounts: '50 LinkedIn accounts',
    features: ['Everything in Starter', 'Team workspace', 'Advanced analytics', 'Priority support', 'Custom daily limits', 'Proxy support'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Unlimited',
    price: '$1,999',
    period: '/month',
    desc: 'Enterprise-scale outreach',
    accounts: 'Unlimited accounts',
    features: ['Everything in Agency', 'White-label option', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
    cta: 'Contact sales',
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Marcus Chen',
    role: 'Head of Sales, Stratus',
    avatar: 'MC',
    text: 'We went from 200 outreach touches per week to over 2,000. LinkedReach paid for itself in the first week.',
    stars: 5,
  },
  {
    name: 'Sarah Jenkins',
    role: 'Founder, Velocity Agency',
    avatar: 'SJ',
    text: 'Managing LinkedIn outreach for 12 clients from one dashboard changed everything for our agency.',
    stars: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Talent Lead, NexusHQ',
    avatar: 'PS',
    text: 'Our candidate response rate went from 8% to 31% after we started using personalised sequences.',
    stars: 5,
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % STEPS.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: '#0b0a13', color: '#f0eeff', fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0b0a13; }
        ::-webkit-scrollbar-thumb { background: #272638; border-radius: 3px; }
        .grad-text { background: linear-gradient(135deg, #a78bfa 0%, #7c6af5 50%, #60a5fa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .glow-card { transition: transform 0.2s ease, border-color 0.2s ease; }
        .glow-card:hover { transform: translateY(-3px); border-color: rgba(124,106,245,0.4) !important; }
        .nav-link { color: #9490b8; font-size: 14px; text-decoration: none; transition: color 0.15s; }
        .nav-link:hover { color: #f0eeff; }
        .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: #7c6af5; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.15s; font-family: inherit; }
        .btn-primary:hover { background: #6b58e8; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,106,245,0.35); }
        .btn-outline { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: transparent; color: #f0eeff; border: 1px solid #272638; border-radius: 10px; font-size: 15px; font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.15s; font-family: inherit; }
        .btn-outline:hover { border-color: #7c6af5; background: rgba(124,106,245,0.08); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
        .fade-up-2 { animation: fadeUp 0.6s ease 0.2s forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.6s ease 0.3s forwards; opacity: 0; }
        .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #34d399; animation: pulse 2s infinite; display: inline-block; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 40px',
        background: scrolled ? 'rgba(11,10,19,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #1a1928' : '1px solid transparent',
        transition: 'all 0.3s ease',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#7c6af5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#f0eeff' }}>LinkedReach</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          {['Features', 'How it works', 'Pricing', 'Blog'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="nav-link">{item}</a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/login" className="nav-link" style={{ display: 'none' }}>Sign in</Link>
          <Link href="/login" style={{ color: '#9490b8', fontSize: 14, textDecoration: 'none', marginRight: 8 }}>Sign in</Link>
          <Link href="/register" className="btn-primary" style={{ padding: '9px 18px', fontSize: 14 }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center', position: 'relative' }}>
        {/* background glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(124,106,245,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '20%', width: 300, height: 200, background: 'radial-gradient(ellipse, rgba(96,165,250,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(124,106,245,0.1)', border: '1px solid rgba(124,106,245,0.25)', marginBottom: 32, fontSize: 12, fontWeight: 600, color: '#a78bfa', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <span className="live-dot" /> Trusted by 1,200+ sales teams worldwide
        </div>

        <h1 className="fade-up-1" style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 820 }}>
          LinkedIn outreach<br />
          <span className="grad-text">at unlimited scale</span>
        </h1>

        <p className="fade-up-2" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#9490b8', maxWidth: 560, lineHeight: 1.65, marginBottom: 48 }}>
          Connect multiple LinkedIn accounts, build intelligent multi-step sequences, and let LinkedReach handle all the sending — safely, automatically, 24/7.
        </p>

        <div className="fade-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 72 }}>
          <Link href="/register" className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
            Start for free <ArrowRight size={16} />
          </Link>
          <button className="btn-outline" style={{ fontSize: 16, padding: '14px 32px' }}>
            <Play size={16} fill="currentColor" /> Watch demo
          </button>
        </div>

        {/* hero stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#1a1928', borderRadius: 16, overflow: 'hidden', border: '1px solid #1a1928', maxWidth: 720, width: '100%' }}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ background: '#13121e', padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#7c6af5', letterSpacing: '-0.02em', marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 12, color: '#5e5a7a', lineHeight: 1.4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF LOGOS */}
      <section style={{ padding: '40px 40px', borderTop: '1px solid #13121e', borderBottom: '1px solid #13121e', background: '#0d0c18' }}>
        <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#3d3a52', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 32 }}>
          Used by teams at
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 56, flexWrap: 'wrap', opacity: 0.45 }}>
          {['VELOCITY', 'NEXUS AI', 'STRATUS', 'SPARK HQ', 'GROWTHLAB'].map(name => (
            <span key={name} style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: '#f0eeff' }}>{name}</span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '120px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#7c6af5', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>Everything you need</p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 20 }}>
            One platform.<br />Infinite reach.
          </h2>
          <p style={{ fontSize: 18, color: '#9490b8', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Everything your team needs to turn LinkedIn into a predictable revenue channel.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="glow-card" style={{
              background: '#13121e',
              border: '1px solid #1e1d35',
              borderRadius: 16,
              padding: '28px 28px',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#f0eeff', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#9490b8', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '120px 40px', background: '#0d0c18' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#7c6af5', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>Simple setup</p>
            <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 20 }}>
              From zero to<br />outreach in minutes
            </h2>
            <p style={{ fontSize: 16, color: '#9490b8', lineHeight: 1.7, marginBottom: 48 }}>
              No complex setup. No developer required. Link your accounts, build a sequence, upload your leads, and go.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {STEPS.map((step, i) => (
                <div key={step.n}
                  onClick={() => setActiveStep(i)}
                  style={{
                    padding: '20px 24px',
                    borderRadius: 14,
                    background: activeStep === i ? 'rgba(124,106,245,0.08)' : 'transparent',
                    border: `1px solid ${activeStep === i ? 'rgba(124,106,245,0.3)' : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    gap: 20,
                    alignItems: 'flex-start',
                  }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: activeStep === i ? '#7c6af5' : '#3d3a52',
                    fontFamily: "'DM Mono', monospace", letterSpacing: '0.05em', flexShrink: 0, paddingTop: 2,
                  }}>{step.n}</span>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: activeStep === i ? '#f0eeff' : '#9490b8', marginBottom: 4, transition: 'color 0.2s' }}>{step.title}</h3>
                    {activeStep === i && (
                      <p style={{ fontSize: 13, color: '#9490b8', lineHeight: 1.65 }}>{step.desc}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Animated UI preview */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(ellipse at center, rgba(124,106,245,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ background: '#13121e', border: '1px solid #1e1d35', borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
              {/* mock window chrome */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #1a1928', display: 'flex', alignItems: 'center', gap: 8, background: '#0f0e17' }}>
                {['#f87171', '#fbbf24', '#34d399'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.6 }} />)}
                <span style={{ marginLeft: 8, fontSize: 11, color: '#3d3a52', fontFamily: 'monospace', letterSpacing: '0.05em' }}>linkedreach.app/campaigns/new</span>
              </div>
              {/* mock sequence */}
              <div style={{ padding: 24 }}>
                <div style={{ fontSize: 12, color: '#5e5a7a', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Outreach Sequence</div>
                {[
                  { icon: UserCheck, label: 'Send Connection Request', color: '#7c6af5', step: 1, note: 'With personalised note' },
                  { icon: Send, label: 'Wait 2 Days', color: '#5e5a7a', step: 2, note: 'Delay step' },
                  { icon: MessageSquare, label: 'Send Follow-up Message', color: '#34d399', step: 3, note: 'If connected' },
                  { icon: MessageSquare, label: 'Wait 3 Days + Follow-up', color: '#60a5fa', step: 4, note: 'If no reply' },
                ].map(({ icon: Icon, label, color, step, note }, i) => (
                  <div key={step} style={{ display: 'flex', gap: 16, marginBottom: i < 3 ? 8 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={15} color={color} />
                      </div>
                      {i < 3 && <div style={{ width: 1, height: 16, background: '#1e1d35', margin: '4px 0' }} />}
                    </div>
                    <div style={{ flex: 1, paddingTop: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#f0eeff' }}>{label}</span>
                      <span style={{ fontSize: 11, color: '#5e5a7a', marginLeft: 10 }}>{note}</span>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 24, padding: '14px 16px', background: '#0f0e17', borderRadius: 12, border: '1px solid #1e1d35' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: '#5e5a7a' }}>Campaign performance</span>
                    <span style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>● LIVE</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {[['247', 'Sent'], ['118', 'Connected'], ['43', 'Replied']].map(([val, lbl]) => (
                      <div key={lbl} style={{ textAlign: 'center', padding: '10px 8px', background: '#13121e', borderRadius: 8 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#f0eeff', letterSpacing: '-0.02em' }}>{val}</div>
                        <div style={{ fontSize: 10, color: '#5e5a7a', marginTop: 2 }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '120px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Loved by sales teams
          </h2>
          <p style={{ fontSize: 17, color: '#9490b8' }}>Don't take our word for it.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {TESTIMONIALS.map(({ name, role, avatar, text, stars }) => (
            <div key={name} className="glow-card" style={{ background: '#13121e', border: '1px solid #1e1d35', borderRadius: 16, padding: '28px' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                {[...Array(stars)].map((_, i) => <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <p style={{ fontSize: 15, color: '#c4c0e0', lineHeight: 1.7, marginBottom: 24 }}>"{text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(124,106,245,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#7c6af5' }}>{avatar}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#f0eeff' }}>{name}</p>
                  <p style={{ fontSize: 12, color: '#5e5a7a' }}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '120px 40px', background: '#0d0c18' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#7c6af5', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: 17, color: '#9490b8' }}>14-day free trial on all plans. No credit card required.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {PRICING.map(({ name, price, period, desc, accounts, features, cta, highlight }) => (
              <div key={name} style={{
                background: highlight ? 'rgba(124,106,245,0.06)' : '#13121e',
                border: `1px solid ${highlight ? 'rgba(124,106,245,0.4)' : '#1e1d35'}`,
                borderRadius: 20,
                padding: '36px 32px',
                position: 'relative',
              }}>
                {highlight && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#7c6af5', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 100, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Most popular
                  </div>
                )}
                <p style={{ fontSize: 13, fontWeight: 600, color: '#7c6af5', marginBottom: 8 }}>{name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 42, fontWeight: 700, color: '#f0eeff', letterSpacing: '-0.03em' }}>{price}</span>
                  <span style={{ fontSize: 14, color: '#5e5a7a' }}>{period}</span>
                </div>
                <p style={{ fontSize: 13, color: '#9490b8', marginBottom: 8 }}>{desc}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#7c6af5', marginBottom: 24 }}>{accounts}</p>
                <div style={{ borderTop: '1px solid #1e1d35', paddingTop: 24, marginBottom: 28 }}>
                  {features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <CheckCircle size={15} color="#34d399" />
                      <span style={{ fontSize: 14, color: '#c4c0e0' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register" className={highlight ? 'btn-primary' : 'btn-outline'} style={{ width: '100%', justifyContent: 'center', textAlign: 'center', display: 'flex' }}>
                  {cta} {highlight && <ArrowRight size={15} />}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', padding: '72px 48px', background: 'linear-gradient(135deg, rgba(124,106,245,0.12) 0%, rgba(96,165,250,0.06) 100%)', border: '1px solid rgba(124,106,245,0.25)', borderRadius: 24 }}>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.15 }}>
            Ready to scale your<br />LinkedIn outreach?
          </h2>
          <p style={{ fontSize: 17, color: '#9490b8', marginBottom: 40, lineHeight: 1.6 }}>
            Join 1,200+ sales teams using LinkedReach to fill their pipeline on autopilot.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
              Get started free <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="btn-outline" style={{ fontSize: 16, padding: '14px 36px' }}>
              Sign in
            </Link>
          </div>
          <p style={{ fontSize: 12, color: '#3d3a52', marginTop: 24 }}>No credit card required · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #13121e', padding: '60px 40px 40px', background: '#09080f' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 60 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: '#7c6af5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={14} color="white" />
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#f0eeff' }}>LinkedReach</span>
              </div>
              <p style={{ fontSize: 14, color: '#5e5a7a', lineHeight: 1.7, maxWidth: 280 }}>
                The most powerful LinkedIn automation platform for modern sales teams and growth agencies.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Status'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#3d3a52', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>{title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {links.map(l => (
                    <a key={l} href="#" className="nav-link" style={{ fontSize: 14 }}>{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #13121e', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 13, color: '#3d3a52' }}>© 2026 LinkedReach. All rights reserved.</p>
            <p style={{ fontSize: 12, color: '#2d2b40' }}>Use of this tool is subject to LinkedIn's Terms of Service.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}