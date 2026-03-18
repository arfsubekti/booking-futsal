import { api } from '@/lib/api';
import Link from 'next/link';

export const revalidate = 60;

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default async function CourtsPage() {
  const courts = await api.courts().then(r => r.data).catch(() => []);

  return (
    <div style={{ background: '#F8FAFC' }}>
      {/* UNIFIED DARK HEADER */}
      <div style={{ background: '#0F172A', padding: '56px 24px 64px' }}>
        <div className="container">
          <span className="section-label" style={{ color: '#4ADE80' }}>Lapangan</span>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: '#F1F5F9', letterSpacing: '-1.5px', marginBottom: 10 }}>Pilih Lapanganmu</h1>
          <p style={{ color: '#64748B', fontSize: 16 }}>Tersedia {courts.length} lapangan — jadwal real-time, booking instan.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {courts.map((court) => (
            <Link key={court.id} href={`/courts/${court.id}`}
              className="card card-hover" style={{ textDecoration: 'none', display: 'block', overflow: 'hidden' }}>
              <div style={{ aspectRatio: '16/9', background: '#F1F5F9', overflow: 'hidden', position: 'relative' }}>
                {court.image_url
                  ? <img src={court.image_url} alt={court.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', background: '#E2E8F0' }} />
                }
                <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(15,23,42,0.72)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99 }}>
                  {court.type}
                </span>
              </div>
              <div style={{ padding: '20px 22px' }}>
                <h2 style={{ fontWeight: 800, color: '#0F172A', fontSize: 17, marginBottom: 8 }}>{court.name}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
                  {court.facilities.slice(0, 4).map(f => (
                    <span key={f.id} className="badge badge-gray">{f.name}</span>
                  ))}
                  {court.facilities.length > 4 && <span className="badge badge-gray">+{court.facilities.length - 4}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>Harga mulai</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#16A34A' }}>
                      {fmt(court.price_per_hour)}<span style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8' }}>/jam</span>
                    </div>
                  </div>
                  <div className="btn btn-primary" style={{ padding: '9px 20px', fontSize: 13 }}>Booking</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {courts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94A3B8' }}>
            <p style={{ fontWeight: 600, fontSize: 16 }}>Belum ada lapangan tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
