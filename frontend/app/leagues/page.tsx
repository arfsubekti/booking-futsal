import { api } from '@/lib/api';
import Link from 'next/link';

export const revalidate = 60;

const sLabel: Record<string, string> = { draft: 'Draft', open: 'Pendaftaran Dibuka', ongoing: 'Berlangsung', finished: 'Selesai' };
const sBadge: Record<string, string> = { draft: 'badge-gray', open: 'badge-green', ongoing: 'badge-blue', finished: 'badge-yellow' };

export default async function LeaguesPage() {
  const leagues = await api.leagues().then(r => r.data).catch(() => []);

  return (
    <div style={{ background: '#F8FAFC' }}>
      <div style={{ background: '#0F172A', padding: '56px 24px 64px' }}>
        <div className="container">
          <span className="section-label" style={{ color: '#4ADE80' }}>Kompetisi</span>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: '#F1F5F9', letterSpacing: '-1.5px', marginBottom: 10 }}>Liga Futsal</h1>
          <p style={{ color: '#64748B', fontSize: 16 }}>Ikuti kompetisi, pantau klasemen, jadilah juara.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px 80px' }}>
        {leagues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94A3B8' }}>
            <p style={{ fontWeight: 600, fontSize: 16 }}>Belum ada liga tersedia.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 20 }}>
            {leagues.map((league) => (
              <Link key={league.id} href={`/leagues/${league.id}`}
                className="card card-hover" style={{ textDecoration: 'none', display: 'block', padding: '26px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F1F5F9', border: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 3, background: '#0F172A' }} />
                  </div>
                  <span className={`badge ${sBadge[league.status] || 'badge-gray'}`}>{sLabel[league.status] || league.status}</span>
                </div>
                <h2 style={{ fontWeight: 800, color: '#0F172A', fontSize: 18, marginBottom: 6 }}>{league.name}</h2>
                <p style={{ fontSize: 14, color: '#64748B', marginBottom: 18 }}>
                  Format: <span style={{ fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>{league.format?.replace('_', ' ')}</span>
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #F1F5F9', fontSize: 13 }}>
                  <span style={{ color: '#64748B' }}><strong style={{ color: '#0F172A' }}>{league.teams_count}</strong> Tim Terdaftar</span>
                  {league.start_date && (
                    <span style={{ color: '#64748B' }}>{new Date(league.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
