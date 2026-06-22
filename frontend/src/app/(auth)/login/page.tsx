'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .auth-input { width: 100%; padding: 12px 14px; background: #111; border: 1px solid #222; border-radius: 10px; color: #fff; font-size: 15px; font-family: inherit; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .auth-input:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.12); }
        .auth-input::placeholder { color: #444; }
        .auth-btn { width: 100%; padding: 13px; background: #f97316; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .auth-btn:hover { background: #ea6c0a; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(249,115,22,0.35); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
      `}</style>

      {/* Left panel - branding */}
      <div style={{ flex: 1, background: '#0d0d0d', borderRight: '1px solid #141414', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', display: 'none' }} className="left-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={17} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>LinkedReach</span>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 16 }}>
            Scale your LinkedIn outreach without the manual work
          </div>
          <p style={{ color: '#555', fontSize: 15, lineHeight: 1.7 }}>
            Connect multiple accounts, build sequences, and let LinkedReach handle all the sending — safely and automatically.
          </p>
        </div>
        <p style={{ fontSize: 13, color: '#333' }}>© 2026 LinkedReach</p>
      </div>

      {/* Right panel - form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Logo - shows on mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48, justifyContent: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>LinkedReach</span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 15, color: '#555', marginBottom: 36 }}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 8 }}>Email address</label>
              <input
                type="email"
                className="auth-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#888' }}>Password</label>
                <a href="#" style={{ fontSize: 13, color: '#f97316', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: 44 }}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#444', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="auth-btn" style={{ marginTop: 8 }}>
              {isLoading ? 'Signing in...' : <><span>Sign in</span> <ArrowRight size={16} /></>}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: '16px', background: '#0f0f0f', borderRadius: 10, border: '1px solid #1a1a1a' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Connect unlimited LinkedIn accounts', 'Build multi-step outreach sequences', 'Unified inbox for all replies'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#f97316', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#555' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ marginTop: 28, textAlign: 'center', fontSize: 14, color: '#444' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#f97316', fontWeight: 500, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
