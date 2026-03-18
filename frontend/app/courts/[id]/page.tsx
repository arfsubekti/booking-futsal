'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, Court, Slot } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function getDates(count = 14) {
  const days   = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { d: d.getDate(), m: months[d.getMonth()], dy: days[d.getDay()], v: d.toISOString().split('T')[0] };
  });
}

export default function CourtDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const { token, isLoggedIn } = useAuth();

  const [court,   setCourt]   = useState<Court | null>(null);
  const [slots,   setSlots]   = useState<Slot[]>([]);
  const [date,    setDate]    = useState(new Date().toISOString().split('T')[0]);
  const [tab,     setTab]     = useState<'jadwal' | 'info'>('jadwal');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [msg,     setMsg]     = useState('');
  const dates = getDates();

  useEffect(() => {
    api.court(Number(id)).then(r => { setCourt(r.data); setLoading(false); });
  }, [id]);

  useEffect(() => {
    setSlots([]);
    api.slots(Number(id), date).then(r => setSlots(r.data));
  }, [id, date]);

  const book = async (slot: Slot) => {
    if (!isLoggedIn) { router.push('/login'); return; }
    setBooking(true); setMsg('');
    try {
      await api.createBooking(token!, { court_id: Number(id), start_time: `${date} ${slot.start}:00`, end_time: `${date} ${slot.end}:00` });
      setMsg('ok');
      api.slots(Number(id), date).then(r => setSlots(r.data));
    } catch (e: unknown) { setMsg((e as Error).message); }
    finally { setBooking(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #E2E8F0', borderTopColor: '#16A34A', borderRadius: '50%' }} className="spin" />
    </div>
  );
  if (!court) return <div style={{ textAlign: 'center', padding: 80, color: '#94A3B8' }}>Lapangan tidak ditemukan.</div>;

  return (
    <div style={{ background: '#F8FAFC' }}>
      {/* Hero band with image + overlay */}
      <div style={{ height: 340, background: '#0F172A', position: 'relative', overflow: 'hidden' }}>
        {court.image_url && (
          <img src={court.image_url} alt={court.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 24px 36px' }}>
          <div className="container">
            <button onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 8, cursor: 'pointer', marginBottom: 20, fontFamily: 'inherit' }}>
              ← Kembali
            </button>
            <span style={{ display: 'inline-block', background: '#16A34A', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{court.type}</span>
            <h1 style={{ fontSize: 42, fontWeight: 900, color: '#ffffff', letterSpacing: '-1.5px', lineHeight: 1.08 }}>{court.name}</h1>
          </div>
        </div>
        {/* Price tag */}
        <div style={{ position: 'absolute', top: 24, right: 40, background: '#ffffff', borderRadius: 14, padding: '14px 20px', textAlign: 'right', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 3 }}>Mulai dari</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#16A34A' }}>{fmt(court.price_per_hour)}</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>per jam</div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 80px' }}>
        {/* Facility badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {court.facilities.map(f => (
            <span key={f.id} className="badge badge-gray" style={{ padding: '5px 14px', fontSize: 12 }}>{f.name}</span>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: 28 }}>
          {(['jadwal', 'info'] as const).map((t) => (
            <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t === 'jadwal' ? 'Jadwal Booking' : 'Info Lapangan'}
            </button>
          ))}
        </div>

        {tab === 'jadwal' && (
          <>
            {/* Date scroller */}
            <p style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Pilih Tanggal</p>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6, marginBottom: 28 }} className="no-scrollbar">
              {dates.map((dd) => (
                <button key={dd.v} onClick={() => setDate(dd.v)}
                  className={`date-btn${date === dd.v ? ' active' : ''}`}
                  style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 14px', minWidth: 58 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{dd.d}</span>
                  <span style={{ fontSize: 10, opacity: 0.65, marginTop: 3 }}>{dd.m}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, marginTop: 2, opacity: 0.7 }}>{dd.dy}</span>
                </button>
              ))}
            </div>

            {/* Message */}
            {msg && (
              <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: msg === 'ok' ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${msg === 'ok' ? '#BBF7D0' : '#FECACA'}`, color: msg === 'ok' ? '#15803D' : '#B91C1C', fontSize: 14, fontWeight: 600 }}>
                {msg === 'ok' ? 'Booking berhasil. Lihat Riwayat Booking untuk detail.' : msg}
              </div>
            )}

            {/* Slots */}
            <p style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Pilih Slot Waktu</p>
            {slots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>Memuat jadwal...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {slots.map((s) => (
                  <div key={s.start} className={`slot${s.is_booked ? ' slot-full' : ''}`}>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 15, marginBottom: 3 }}>{s.start} – {s.end}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#16A34A', marginBottom: 14 }}>{fmt(s.price)}</div>
                    {s.is_booked
                      ? <span className="badge badge-red">Penuh</span>
                      : <button onClick={() => book(s)} disabled={booking} className="btn btn-primary" style={{ width: '100%', padding: '9px', fontSize: 12, borderRadius: 8 }}>
                          {booking ? 'Memproses...' : 'Booking'}
                        </button>
                    }
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'info' && (
          <div className="card" style={{ padding: '28px 32px', cursor: 'default' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 10, letterSpacing: '-0.5px' }}>{court.name}</h2>
            <p style={{ color: '#64748B', lineHeight: 1.8, marginBottom: 28 }}>
              {court.description || 'Lapangan futsal berkualitas tinggi dengan fasilitas lengkap dan perawatan rutin.'}
            </p>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Fasilitas</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
              {court.facilities.map((f) => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155', fontSize: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', flexShrink: 0 }} />
                  {f.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
