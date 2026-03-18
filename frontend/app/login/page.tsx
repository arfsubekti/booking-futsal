'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await api.login(form.email, form.password);
      login(res.data.user as never, res.data.token);
      router.push('/');
    } catch (err: unknown) { setError((err as Error).message || 'Email atau password salah.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 64px)', display: 'flex' }}>
      {/* Left — dark brand panel */}
      <div style={{ flex: '0 0 44%', background: '#0F172A', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 56px', position: 'relative', overflow: 'hidden' }} className="hidden md:flex">
        <div style={{ position: 'absolute', right: -60, bottom: -60, width: 300, height: 300, borderRadius: '50%', border: '60px solid rgba(22,163,74,0.06)' }} />
        <div style={{ position: 'absolute', left: -40, top: -40, width: 200, height: 200, borderRadius: '50%', border: '40px solid rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} />
            <span style={{ color: '#F1F5F9', fontWeight: 800, fontSize: 15 }}>Futsal Booking</span>
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: '#ffffff', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
            Selamat<br />Datang Kembali
          </h2>
          <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.75, maxWidth: 280 }}>
            Masuk untuk melihat jadwal dan booking lapangan favoritmu.
          </p>
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[['Jadwal real-time'], ['Konfirmasi instan'], ['Riwayat booking lengkap']].map(([t]) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#94A3B8' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.8px', marginBottom: 8 }}>Masuk</h1>
            <p style={{ color: '#64748B', fontSize: 14 }}>
              Belum punya akun?{' '}
              <Link href="/register" style={{ color: '#16A34A', fontWeight: 700, textDecoration: 'none' }}>Buat Akun Gratis</Link>
            </p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, color: '#B91C1C', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 8 }}>Email</label>
              <input type="email" required value={form.email} placeholder="email@contoh.com"
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input" style={{ padding: '12px 16px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 8 }}>Password</label>
              <input type="password" required value={form.password} placeholder="Password"
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input" style={{ padding: '12px 16px' }} />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary"
              style={{ padding: '13px', fontSize: 15, marginTop: 8, opacity: loading ? 0.75 : 1 }}>
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
