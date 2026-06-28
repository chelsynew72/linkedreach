'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';
import { Zap, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
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
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .auth-input {
          width: 100%;
          padding: 13px 14px;
          background: #111;
          border: 1px solid #222;
          border-radius: 10px;
          color: #fff;
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: all 0.15s;
        }
        .auth-input:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249,115,22,0.12);
        }
        .auth-input::placeholder { color: #444; }
        .auth-btn {
          width: 100%;
          padding: 14px;
          background: #f97316;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .auth-btn:hover { background: #ea6c0a; box-shadow: 0 6px 24px rgba(249,115,22,0.3); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>LinkedReach</span>
        </div>

        {/* Card */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: '36px 32px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 28 }}>
            Start automating LinkedIn outreach — free for 14 days
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 8 }}>
                Full name
              </label>
              <input type="text" className="auth-input" placeholder="John Smith"
                value={form.name} onChange={set('name')} required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 8 }}>
                Work email
              </label>
              <input type="email" className="auth-input" placeholder="you@company.com"
                value={form.email} onChange={set('email')} required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={set('password')}
                  style={{ paddingRight: 48 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center', padding: 0 }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="auth-btn" style={{ marginTop: 8 }}>
              {isLoading ? 'Creating account...' : <><span>Create account</span><ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Trust badges */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 20 }}>
            {['No credit card required', 'Cancel anytime', '14-day free trial', 'Setup in 3 minutes'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 12px', background: '#0f0f0f', borderRadius: 8, border: '1px solid #1a1a1a' }}>
                <CheckCircle size={13} color="#f97316" />
                <span style={{ fontSize: 12, color: '#555' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#444' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#f97316', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
        </p>

        <p style={{ marginTop: 12, textAlign: 'center', fontSize: 12, color: '#2a2a2a' }}>
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
