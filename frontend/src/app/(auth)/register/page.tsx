'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';
import { Zap } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, var(--brand) 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-md relative">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--brand)' }}>
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold">LinkedReach</span>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Start automating LinkedIn outreach today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Full name', type: 'text', placeholder: 'John Smith' },
              { key: 'email', label: 'Work email', type: 'email', placeholder: 'you@company.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '8+ characters' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                <input type={type} className="input" placeholder={placeholder}
                  value={(form as any)[key]} onChange={set(key)} required />
              </div>
            ))}

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center py-2.5">
              {isLoading ? 'Creating account...' : 'Get started free'}
            </button>
          </form>

          <p className="mt-4 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>

          <p className="mt-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium" style={{ color: 'var(--brand)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
