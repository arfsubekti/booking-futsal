import { api } from '@/lib/api';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';

export const revalidate = 60;

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default async function HomePage() {
  const [cR, rR, sR, lR, mR] = await Promise.allSettled([
    api.courts(), api.reviews(), api.settings(), api.leagues(), api.upcomingMatches()
  ]);
  const courts   = cR.status === 'fulfilled' ? cR.value.data : [];
  const reviews  = rR.status === 'fulfilled' ? rR.value.data : [];
  const settings = sR.status === 'fulfilled' ? sR.value.data : null;
  const leagues  = lR.status === 'fulfilled' ? lR.value.data : [];
  const upcoming = mR.status === 'fulfilled' ? mR.value.data : [];
  
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '5.0';

  return (
    <div style={{ background: '#ffffff' }}>

      {/* ── HERO & OVERLAY WIDGET ──────────────────────────── */}
      <div style={{ position: 'relative' }}>
        <HeroSlider
          siteName={settings?.name || 'Futsal Booking'}
          courtsCount={courts.length}
          avgRating={avg}
          leaguesCount={leagues.length}
        />

        {/* ── FLOATING NEXT MATCH WIDGET (Top Right) ───────────── */}
        {upcoming.length > 0 && (() => {
          const teamColors = ['#2563EB','#DC2626','#D97706','#7C3AED','#059669','#DB2777','#0891B2','#65A30D'];
          const teamColor = (name: string) => teamColors[(name?.charCodeAt(0) || 0) % teamColors.length];
          
          const getLogoUrl = (url?: string | null) => {
            if (!url) return null;
            if (url.startsWith('http')) return url;
            const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
            return `${base.replace(/\/api$/, '')}/storage/${url}`;
          };

          const Badge = ({ name, logoUrl, size = 48 }: { name: string; logoUrl?: string | null; size?: number }) => {
            const url = getLogoUrl(logoUrl);
            if (url) {
              return (
                <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              );
            }
            return (
              <div style={{ width: size, height: size, borderRadius: '50%', background: teamColor(name), border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: size * 0.35, color: '#fff', flexShrink: 0, letterSpacing: '-0.5px' }}>
                {(name || '?')[0].toUpperCase()}
              </div>
            );
          };

          const fmtDay = (d: string | null) => d
            ? new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(d.replace(' ', 'T')))
            : null;

          return (
            <div style={{ position: 'absolute', top: 40, right: 40, zIndex: 10, width: 240, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcoming.slice(0, 2).map((m, idx) => {
                const isFirst = idx === 0;
                
                if (isFirst) {
                  return (
                    <div key={m.id} style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}>
                      <div style={{ background: '#000', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.2px' }}>Next Match</h3>
                        <Link href="/leagues" style={{ width: 24, height: 24, borderRadius: '50%', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, textDecoration: 'none' }}>
                          →
                        </Link>
                      </div>
                      
                      <div style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', padding: '16px 16px', borderTop: '1px solid rgba(255,255,255,0.4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                            <Badge name={m.home_team?.name || 'A'} logoUrl={m.home_team?.logo} size={40} />
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: 1.2 }}>{m.home_team?.name}</span>
                          </div>
                          <div style={{ padding: '0 6px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {m.home_score !== null ? (
                              <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>{m.home_score} - {m.away_score}</span>
                            ) : (
                              <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>VS</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                            <Badge name={m.away_team?.name || 'B'} logoUrl={m.away_team?.logo} size={40} />
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: 1.2 }}>{m.away_team?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={m.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, padding: '0 4px' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.5)', display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span>{fmtDay(m.match_date)}</span>
                        {m.league?.name && <span style={{ opacity: 0.7 }}>• {m.league.name}</span>}
                      </div>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
                        →
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 20, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                          <Badge name={m.home_team?.name || 'A'} logoUrl={m.home_team?.logo} size={42} />
                        </div>
                        <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {m.home_score !== null ? (
                            <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>{m.home_score} : {m.away_score}</span>
                          ) : (
                            <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>VS</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                          <Badge name={m.away_team?.name || 'B'} logoUrl={m.away_team?.logo} size={42} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* ── INTRO TEXT like Runova ───────────────────────── */}
      <section style={{ background: '#ffffff', padding: '72px 24px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: '#0F172A', lineHeight: 1.2, letterSpacing: '-1px' }}>
              Di {settings?.name || 'Futsal Arena'}, kami menghadirkan pengalaman booking yang{' '}
              <span style={{ color: '#16A34A' }}>modern dan transparan.</span>
            </h2>
          </div>
          <div>
            <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.85 }}>
              Tidak perlu telepon, tidak perlu datang langsung. Cek jadwal real-time, pilih slot, booking instan — semua dari genggaman tangan. Tersedia {courts.length} lapangan premium dengan berbagai pilihan fasilitas.
            </p>
            <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
              {[
                { v: `${courts.length}+`, l: 'Lapangan' },
                { v: `${reviews.length}+`, l: 'Ulasan' },
                { v: `${leagues.length}`, l: 'Liga' },
              ].map((s, i) => (
                <div key={i} style={{ borderTop: '2px solid #16A34A', paddingTop: 12 }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COURTS grid ─────────────────────────────────── */}
      <section style={{ background: '#F8FAFC', padding: '72px 24px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>Fasilitas</p>
              <h2 style={{ fontSize: 34, fontWeight: 900, color: '#0F172A', letterSpacing: '-1px' }}>Lapangan Tersedia</h2>
            </div>
            <Link href="/courts" style={{ fontSize: 14, fontWeight: 700, color: '#16A34A', textDecoration: 'none' }}>Lihat Semua →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {courts.map((court) => (
              <Link key={court.id} href={`/courts/${court.id}`} className="card card-hover"
                style={{ textDecoration: 'none', display: 'block', overflow: 'hidden' }}>
                <div style={{ aspectRatio: '16/9', background: '#F1F5F9', overflow: 'hidden', position: 'relative' }}>
                  {court.image_url
                    ? <img src={court.image_url} alt={court.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #E2E8F0, #CBD5E1)' }} />
                  }
                  <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99 }}>
                    {court.type}
                  </span>
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <h3 style={{ fontWeight: 800, color: '#0F172A', fontSize: 16, marginBottom: 6 }}>{court.name}</h3>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                    {court.facilities.slice(0, 3).map(f => (
                      <span key={f.id} className="badge badge-gray" style={{ fontSize: 11 }}>{f.name}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Mulai dari</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#16A34A' }}>{fmt(court.price_per_hour)}<span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 400 }}>/jam</span></div>
                    </div>
                    <div style={{ background: '#0F172A', color: '#fff', fontSize: 12, fontWeight: 700, padding: '9px 16px', borderRadius: 8 }}>
                      Booking
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS — big quote like Runova ──────────────── */}
      <section style={{ background: '#ffffff', padding: '72px 24px' }} id="ulasan">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 64, alignItems: 'flex-start' }}>
            <div style={{ position: 'sticky', top: 80 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 }}>Ulasan</p>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px', lineHeight: 1.1 }}>Apa Kata Pelanggan Kami</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reviews.length > 0 ? (
                reviews.slice(0, 4).map((r) => (
                  <div key={r.id} className="card" style={{ background: '#F8FAFC', padding: '24px 28px', cursor: 'default' }}>
                    <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                      {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 13, color: s <= r.rating ? '#F59E0B' : '#E2E8F0' }}>★</span>)}
                    </div>
                    <p style={{ fontSize: 15, color: '#0F172A', lineHeight: 1.75, marginBottom: 18, fontWeight: 500 }}>"{r.comment}"</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0F172A', color: '#fff', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {r.user.name?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{r.user.name}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ background: '#F8FAFC', padding: '32px', borderRadius: 16, textAlign: 'center', border: '1px dashed #E2E8F0' }}>
                  <p style={{ fontSize: 15, color: '#64748B', margin: 0 }}>Belum ada ulasan saat ini. Jadilah yang pertama memberikan ulasan!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES — editorial grid like Runova ────────── */}
      <section style={{ background: '#F8FAFC', padding: '72px 24px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {/* Left — big headline */}
            <div style={{ padding: '0 48px 0 0', borderRight: '1px solid #E2E8F0', display: 'flex', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 }}>Kenapa Pilih Kami</p>
                <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                  Booking yang Simpel<br />& Terpercaya
                </h2>
              </div>
            </div>
            {/* Right — feature list */}
            <div style={{ padding: '0 0 0 48px' }}>
              {[
                { t: 'Jadwal Real-time',    d: 'Slot waktu diperbarui otomatis. Tidak ada risiko double booking.' },
                { t: 'Fleksibel',           d: 'Pilih tanggal dan jam sesuai keinginan, setiap hari.' },
                { t: 'Pembayaran Mudah',    d: 'Transfer, QRIS, atau tunai. Konfirmasi cepat.' },
                { t: 'Liga & Kompetisi',    d: 'Ikuti liga dan pantau klasemen secara langsung.' },
              ].map((f, i) => (
                <div key={i} style={{ padding: '20px 0', borderBottom: i < 3 ? '1px solid #E2E8F0' : 'none', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#ffffff', border: '1px solid #E2E8F0', flexShrink: 0, marginTop: 2 }}>
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 15, marginBottom: 4 }}>{f.t}</div>
                    <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.65 }}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA DARK BAND ────────────────────────────────── */}
      <section style={{ background: '#0F172A', padding: '80px 24px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Mulai Sekarang</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
              Siap Main Hari Ini?
            </h2>
            <p style={{ color: '#64748B', fontSize: 15, marginTop: 12 }}>
              Buat akun gratis dan booking dalam hitungan menit.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/register" style={{ background: '#16A34A', color: '#fff', fontWeight: 700, fontSize: 15, padding: '14px 32px', borderRadius: 10, textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 14px rgba(22,163,74,0.4)' }}>
              Buat Akun Gratis
            </Link>
            {settings?.whatsapp_number && (
              <a href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`} target="_blank"
                style={{ background: 'transparent', color: '#64748B', fontWeight: 600, fontSize: 15, padding: '14px 28px', borderRadius: 10, textDecoration: 'none', display: 'inline-block', border: '1.5px solid #1E293B' }}>
                Hubungi Kami
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
