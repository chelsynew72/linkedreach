'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Zap, ArrowRight, CheckCircle } from 'lucide-react';

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

      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>LinkedReach</span>
        </div>

        {/* Card */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: '36px 32px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 28 }}>Sign in to your LinkedReach account</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 8 }}>
                Email address
              </label>
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

            <button type="submit" disabled={isLoading} className="auth-btn" style={{ marginTop: 4 }}>
              {isLoading ? 'Signing in...' : <><span>Sign in</span><ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#1e1e1e' }} />
            <span style={{ fontSize: 12, color: '#444' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#1e1e1e' }} />
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Connect unlimited LinkedIn accounts',
              'Build multi-step outreach sequences',
              'Unified inbox for all replies',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={14} color="#f97316" />
                <span style={{ fontSize: 13, color: '#555' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: '#444' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#f97316', fontWeight: 500, textDecoration: 'none' }}>
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
