import { api } from '@/lib/api';

export const revalidate = 60;

interface Standing {
  team: { id: number; name: string; logo: string | null };
  played: number; won: number; draw: number; lost: number;
  gf: number; ga: number; gd: number; pts: number;
}

interface Match {
  id: number; round: number; match_date: string | null; status: string;
  home_team: { id: number; name: string }; away_team: { id: number; name: string };
  home_score: number | null; away_score: number | null;
}

export default async function LeagueDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [leagueRes, standingsRes, matchesRes] = await Promise.allSettled([
    api.league(id),
    api.leagueStandings(id),
    api.leagueMatches(id),
  ]);

  const league    = leagueRes.status    === 'fulfilled' ? leagueRes.value.data       : null;
  const standings = standingsRes.status === 'fulfilled' ? standingsRes.value.data as Standing[] : [];
  const matches   = matchesRes.status   === 'fulfilled' ? matchesRes.value.data as Match[]   : [];

  if (!league) return <div className="text-center py-20 text-gray-500">Liga tidak ditemukan.</div>;

  const finished = matches.filter(m => m.status === 'finished');
  const upcoming = matches.filter(m => m.status !== 'finished' && m.status !== 'cancelled');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-2xl p-8 mb-8">
        <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-2">Liga Futsal</p>
        <h1 className="text-3xl font-black mb-2">{(league as unknown as { name: string }).name}</h1>
        <p className="text-blue-200 text-sm">{(league as unknown as { description?: string }).description || 'Kompetisi futsal terbaik.'}</p>
        <div className="flex gap-6 mt-5 text-sm">
          <div><div className="font-black text-xl">{(league as unknown as { teams?: unknown[] }).teams ? Array.isArray((league as unknown as { teams: unknown[] }).teams) ? (league as unknown as { teams: unknown[] }).teams.length : 0 : 0}</div><div className="text-blue-300">Tim</div></div>
          <div className="w-px bg-white/20" />
          <div><div className="font-black text-xl capitalize">{(league as unknown as { format?: string }).format?.replace('_', ' ')}</div><div className="text-blue-300">Format</div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Klasemen */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-black text-gray-900 mb-4">Klasemen</h2>
          {standings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">Klasemen belum tersedia.</div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">#</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">Tim</th>
                    <th className="text-center px-2 py-3 font-bold text-gray-500 text-xs">M</th>
                    <th className="text-center px-2 py-3 font-bold text-gray-500 text-xs">W</th>
                    <th className="text-center px-2 py-3 font-bold text-gray-500 text-xs">D</th>
                    <th className="text-center px-2 py-3 font-bold text-gray-500 text-xs">L</th>
                    <th className="text-center px-2 py-3 font-bold text-gray-500 text-xs">GD</th>
                    <th className="text-center px-3 py-3 font-black text-blue-600 text-xs">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, i) => (
                    <tr key={row.team.id} className={`border-b border-gray-50 ${i < 3 ? 'bg-blue-50/50' : ''}`}>
                      <td className="px-4 py-3 font-bold text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{row.team.name}</td>
                      <td className="px-2 py-3 text-center text-gray-600">{row.played}</td>
                      <td className="px-2 py-3 text-center text-gray-600">{row.won}</td>
                      <td className="px-2 py-3 text-center text-gray-600">{row.draw}</td>
                      <td className="px-2 py-3 text-center text-gray-600">{row.lost}</td>
                      <td className="px-2 py-3 text-center text-gray-600">{row.gd}</td>
                      <td className="px-3 py-3 text-center font-black text-blue-600">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Jadwal & Hasil */}
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4">Jadwal</h2>
          <div className="space-y-3">
            {[...upcoming.slice(0, 5), ...finished.slice(-3)].slice(0, 8).map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="text-xs text-gray-400 mb-2">Pekan {m.round}</div>
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-sm font-semibold text-gray-800 flex-1 text-right">{m.home_team.name}</span>
                  <div className="flex-none text-center px-3">
                    {m.status === 'finished' && m.home_score !== null ? (
                      <span className="font-black text-gray-900 text-base">{m.home_score} – {m.away_score}</span>
                    ) : (
                      <span className="font-bold text-gray-400 text-sm">vs</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 flex-1">{m.away_team.name}</span>
                </div>
                {m.match_date && (
                  <div className="text-xs text-gray-400 text-center mt-2">
                    {new Date(m.match_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            ))}
            {matches.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-400">Belum ada jadwal.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
