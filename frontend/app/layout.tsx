import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Futsal Booking — Booking Lapangan Futsal Online',
  description: 'Platform booking lapangan futsal terpercaya. Cek jadwal, pilih slot, booking langsung.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body style={{ background: '#F8FAFC', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AuthProvider>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <footer style={{ background: '#0F172A', color: '#94A3B8', padding: '56px 24px 36px' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} />
                    <span style={{ color: '#F1F5F9', fontWeight: 800, fontSize: 15 }}>Futsal Booking</span>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: '#64748B' }}>Platform booking lapangan futsal terpercaya. Jadwal real-time, pembayaran mudah.</p>
                </div>
                <div>
                  <p style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 13, marginBottom: 16 }}>Navigasi</p>
                  {[['Lapangan', '/courts'], ['Liga', '/leagues'], ['Galeri', '/gallery']].map(([l, h]) => (
                    <a key={h} href={h} style={{ display: 'block', color: '#64748B', fontSize: 14, textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}>{l}</a>
                  ))}
                </div>
                <div>
                  <p style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 13, marginBottom: 16 }}>Akun</p>
                  {[['Masuk', '/login'], ['Daftar', '/register'], ['Riwayat Booking', '/bookings']].map(([l, h]) => (
                    <a key={h} href={h} style={{ display: 'block', color: '#64748B', fontSize: 14, textDecoration: 'none', marginBottom: 10 }}>{l}</a>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '1px solid #1E293B', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <p style={{ fontSize: 13, color: '#475569' }}>© {new Date().getFullYear()} Futsal Booking. All rights reserved.</p>
                <p style={{ fontSize: 13, color: '#475569' }}>Booking mudah, main langsung.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
