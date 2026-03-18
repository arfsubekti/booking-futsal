'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, Booking } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

const statusColor: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
};

const statusLabel: Record<string, string> = {
  pending:   'Menunggu Konfirmasi',
  confirmed: 'Dikonfirmasi',
  cancelled: 'Dibatalkan',
  completed: 'Selesai',
};

export default function BookingsPage() {
  const { isLoggedIn, token } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return; }
    api.myBookings(token!).then(r => { setBookings(r.data); setLoading(false); });
  }, [isLoggedIn, token, router]);

  const cancel = async (id: number) => {
    if (!confirm('Batalkan booking ini?')) return;
    try {
      await api.cancelBooking(token!, id);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-gray-900 mb-8">Riwayat Booking</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📋</div>
          <p className="font-semibold text-gray-500">Belum ada booking.</p>
          <a href="/courts" className="mt-4 inline-block px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-colors">
            Booking Sekarang
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-gray-900">{b.court?.name || 'Lapangan'}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(b.start_time).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    {new Date(b.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    {' – '}
                    {new Date(b.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusColor[b.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {statusLabel[b.status] || b.status}
                  </span>
                  <div className="text-blue-600 font-black mt-2">{formatRupiah(b.total_price)}</div>
                </div>
              </div>
              {b.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                  <button onClick={() => cancel(b.id)}
                    className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200">
                    Batalkan
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
