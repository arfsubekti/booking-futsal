import { api } from '@/lib/api';

export const revalidate = 60;

export default async function GalleryPage() {
  const galleries = await api.galleries().then(r => r.data).catch(() => []);

  return (
    <div style={{ background: '#F8FAFC' }}>
      <div style={{ background: '#0F172A', padding: '56px 24px 64px' }}>
        <div className="container">
          <span className="section-label" style={{ color: '#4ADE80' }}>Foto</span>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: '#F1F5F9', letterSpacing: '-1.5px', marginBottom: 10 }}>Galeri Arena</h1>
          <p style={{ color: '#64748B', fontSize: 16 }}>Lihat fasilitas dan suasana lapangan kami.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px 80px' }}>
        {galleries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94A3B8' }}>
            <p style={{ fontWeight: 600, fontSize: 16 }}>Belum ada foto galeri.</p>
          </div>
        ) : (
          <div style={{ columns: '2 300px', gap: 16 }}>
            {galleries.map((g) => (
              <div key={g.id} className="card" style={{ marginBottom: 16, breakInside: 'avoid', overflow: 'hidden', padding: 0 }}>
                <img src={g.image_url} alt={g.title} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
                {g.title && (
                  <div style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#374151' }}>{g.title}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
