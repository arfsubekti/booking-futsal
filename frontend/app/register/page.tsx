'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const fields = [
  { key: 'name',                  label: 'Nama Lengkap',        type: 'text',     placeholder: 'Nama Anda',       req: true },
  { key: 'email',                 label: 'Email',               type: 'email',    placeholder: 'email@contoh.com',req: true },
  { key: 'phone',                 label: 'No. HP (opsional)',   type: 'tel',      placeholder: '08xxxxxxxxxx',    req: false },
  { key: 'password',              label: 'Password',            type: 'password', placeholder: 'Min. 8 karakter', req: true },
  { key: 'password_confirmation', label: 'Konfirmasi Password', type: 'password', placeholder: 'Ulangi password', req: true },
];

export default function RegisterPage() {
  const { login } = useAuth();
  const router    = useRouter();
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) { setError('Password tidak cocok.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await api.register(form);
      login(res.data.user as never, res.data.token);
      router.push('/');
    } catch (err: unknown) { setError((err as Error).message || 'Registrasi gagal.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.8px', marginBottom: 8 }}>Buat Akun Gratis</h1>
          <p style={{ color: '#64748B', fontSize: 14 }}>
            Sudah punya akun?{' '}
            <Link href="/login" style={{ color: '#16A34A', fontWeight: 700, textDecoration: 'none' }}>Masuk sekarang</Link>
          </p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          {error && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, color: '#B91C1C', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
              {error}
            </div>
          )}
          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {fields.map(({ key, label, type, placeholder, req }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 7 }}>{label}</label>
                <input type={type} required={req} value={form[key as keyof typeof form]}
                  placeholder={placeholder}
                  onChange={e => setForm(v => ({ ...v, [key]: e.target.value }))}
                  className="input" style={{ padding: '12px 16px' }} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn btn-primary"
              style={{ padding: '13px', fontSize: 15, marginTop: 8, opacity: loading ? 0.75 : 1 }}>
              {loading ? 'Memproses...' : 'Buat Akun'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: 12, marginTop: 20, lineHeight: 1.6 }}>
          Dengan mendaftar, Anda menyetujui syarat dan ketentuan yang berlaku.
        </p>
      </div>
    </div>
  );
}
