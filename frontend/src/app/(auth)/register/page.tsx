'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';
import { Zap, ArrowRight, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    try {
      await register(form.email, form.name, form.password);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .auth-input { width: 100%; padding: 12px 14px; background: #111; border: 1px solid #222; border-radius: 10px; color: #fff; font-size: 15px; font-family: inherit; outline: none; transition: all 0.15s; }
        .auth-input:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.12); }
        .auth-input::placeholder { color: #444; }
        .auth-btn { width: 100%; padding: 13px; background: #f97316; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .auth-btn:hover { background: #ea6c0a; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(249,115,22,0.35); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
      `}</style>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48, justifyContent: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>LinkedReach</span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Create your account</h1>
          <p style={{ fontSize: 15, color: '#555', marginBottom: 36 }}>Start automating LinkedIn outreach today — free for 14 days</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'name', label: 'Full name', type: 'text', placeholder: 'John Smith' },
              { key: 'email', label: 'Work email', type: 'email', placeholder: 'you@company.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: 'At least 8 characters' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 8 }}>{label}</label>
                <input type={type} className="auth-input" placeholder={placeholder}
                  value={(form as any)[key]} onChange={set(key)} required />
              </div>
            ))}

            <button type="submit" disabled={isLoading} className="auth-btn" style={{ marginTop: 8 }}>
              {isLoading ? 'Creating account...' : <><span>Create account</span> <ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Trust signals */}
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['No credit card required', 'Cancel anytime', '14-day free trial', 'Setup in 3 minutes'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 12px', background: '#0f0f0f', borderRadius: 8, border: '1px solid #1a1a1a' }}>
                <CheckCircle size={13} color="#f97316" />
                <span style={{ fontSize: 12, color: '#555' }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: '#444' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#f97316', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
          </p>

          <p style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: '#333' }}>
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, background: '#0d0d0d', borderLeft: '1px solid #141414', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 56px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f97316', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>What you get</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 16 }}>
            Everything you need to scale outreach
          </h2>
          <p style={{ color: '#555', fontSize: 15, lineHeight: 1.7 }}>
            LinkedReach gives your team the tools to reach thousands of prospects on LinkedIn — without the manual work.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { title: 'Multiple sender accounts', desc: 'Connect unlimited LinkedIn accounts and rotate sends automatically.' },
            { title: 'Visual sequence builder', desc: 'Build connection + follow-up sequences in minutes, not hours.' },
            { title: 'Smart reply detection', desc: 'Auto-pause sequences when a lead replies so you never look spammy.' },
            { title: 'Unified inbox', desc: 'All LinkedIn replies from all accounts in one place.' },
          ].map(({ title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <CheckCircle size={15} color="#f97316" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{title}</p>
                <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: '20px 24px', background: '#111', borderRadius: 14, border: '1px solid #1e1e1e' }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
            {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#f97316', fontSize: 14 }}>★</span>)}
          </div>
          <p style={{ fontSize: 14, color: '#aaa', lineHeight: 1.65, marginBottom: 14 }}>
            "We went from 200 outreach touches per week to over 2,000. LinkedReach paid for itself in the first week."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#f97316' }}>MC</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Marcus Chen</p>
              <p style={{ fontSize: 11, color: '#444' }}>Head of Sales, Stratus</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
