'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

const links = [
  { href: '/',        label: 'Beranda' },
  { href: '/courts',  label: 'Lapangan' },
  { href: '/#ulasan', label: 'Ulasan' },
  { href: '/leagues', label: 'Liga' },
  { href: '/gallery', label: 'Galeri' },
];

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [open, setOpen]     = useState(false);
  const [drop, setDrop]     = useState(false);
  const [shadow, setShadow] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setShadow(window.scrollY > 8);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const doLogout = () => { logout(); router.push('/'); setDrop(false); };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 1000,
      background: '#ffffff',
      borderBottom: '1px solid #E2E8F0',
      boxShadow: shadow ? '0 2px 16px rgba(15,23,42,0.07)' : 'none',
      transition: 'box-shadow 0.25s',
    }}>
      {/* Logo LEFT — nav links + auth RIGHT */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64 }}>

        {/* Logo — far left */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} />
          <span style={{ fontWeight: 800, fontSize: 16, color: '#0F172A', letterSpacing: '-0.3px' }}>Futsal Booking</span>
        </Link>

        {/* Push everything right */}
        <div style={{ flex: 1 }} />

        {/* Nav links + auth — all on the right (hidden mobile) */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 2 }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={`nav-link${pathname === l.href ? ' active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons — right */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 12 }}>
          {isLoggedIn ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDrop(!drop)}
                className="btn btn-ghost"
                style={{ padding: '8px 14px', gap: 8, fontSize: 14, display: 'flex', alignItems: 'center' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#0F172A', color: '#fff', fontWeight: 700, fontSize: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {user?.name?.[0]?.toUpperCase()}
                </span>
                <span style={{ color: '#0F172A', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>
                <span style={{ fontSize: 10, color: '#94A3B8' }}>▾</span>
              </button>
              {drop && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', width: 196, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 6, boxShadow: '0 8px 30px rgba(15,23,42,0.12)', zIndex: 100 }}>
                  <Link href="/bookings" onClick={() => setDrop(false)}
                    style={{ display: 'block', padding: '10px 14px', borderRadius: 8, fontSize: 14, color: '#334155', textDecoration: 'none', fontWeight: 500 }}>
                    Riwayat Booking
                  </Link>
                  <div style={{ height: 1, background: '#F1F5F9', margin: '4px 0' }} />
                  <button onClick={doLogout}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 8, fontSize: 14, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost" style={{ padding: '9px 16px' }}>Masuk</Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: '9px 20px' }}>Booking Sekarang</Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} className="md:hidden"
          style={{ background: 'none', border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', flexShrink: 0 }}>
          <div style={{ width: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {open
              ? <span style={{ fontSize: 18, color: '#334155', lineHeight: 1, textAlign: 'center' }}>✕</span>
              : [0, 1, 2].map(i => <div key={i} style={{ height: 2, background: '#334155', borderRadius: 9 }} />)
            }
          </div>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div style={{ background: '#fff', borderTop: '1px solid #F1F5F9', padding: '12px 20px 20px' }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '12px 14px', borderRadius: 8, fontSize: 15, fontWeight: pathname === l.href ? 700 : 500, color: pathname === l.href ? '#16A34A' : '#334155', textDecoration: 'none', marginBottom: 2 }}>
              {l.label}
            </Link>
          ))}
          <div style={{ height: 1, background: '#F1F5F9', margin: '10px 0' }} />
          {isLoggedIn ? (
            <>
              <Link href="/bookings" onClick={() => setOpen(false)}
                style={{ display: 'block', padding: '12px 14px', borderRadius: 8, fontSize: 15, fontWeight: 500, color: '#334155', textDecoration: 'none' }}>
                Riwayat Booking
              </Link>
              <button onClick={doLogout}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 8, fontSize: 15, fontWeight: 500, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Keluar
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <Link href="/login" onClick={() => setOpen(false)}
                style={{ display: 'block', padding: '12px', borderRadius: 10, fontSize: 15, fontWeight: 600, color: '#334155', textDecoration: 'none', border: '1.5px solid #E2E8F0', textAlign: 'center' }}>
                Masuk
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className="btn btn-primary"
                style={{ padding: '12px', fontSize: 15, borderRadius: 10 }}>
                Booking Sekarang
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
