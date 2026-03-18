const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ── Types ────────────────────────────────────────────────

export interface Court {
  id: number;
  name: string;
  type: string;
  description: string | null;
  price_per_hour: number;
  image_url: string | null;
  facilities: { id: number; name: string }[];
  pricings: { day_type: string; price: number }[];
}

export interface Slot {
  start: string;
  end: string;
  is_booked: boolean;
  price: number;
}

export interface Booking {
  id: number;
  court: { id: number; name: string } | null;
  start_time: string;
  end_time: string;
  total_price: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface League {
  id: number;
  name: string;
  format: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  court: { id: number; name: string } | null;
  teams_count: number;
}

export interface UpcomingMatch {
  id: number;
  round: number | null;
  match_date: string | null;
  status: string;
  league: { id: number; name: string } | null;
  home_team: { id: number; name: string; logo: string | null } | null;
  away_team: { id: number; name: string; logo: string | null } | null;
  home_score: number | null;
  away_score: number | null;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  user: { name: string };
  created_at: string;
}

export interface Settings {
  name: string;
  address: string | null;
  whatsapp_number: string | null;
  google_maps_link: string | null;
  banner_url: string | null;
}

// ── API Calls ────────────────────────────────────────────

export const api = {
  // Public
  settings: () => request<{ data: Settings }>('/settings'),
  courts: () => request<{ data: Court[] }>('/courts'),
  court: (id: number) => request<{ data: Court }>(`/courts/${id}`),
  slots: (id: number, date: string) =>
    request<{ data: Slot[] }>(`/courts/${id}/slots?date=${date}`),
  galleries: () => request<{ data: { id: number; title: string; image_url: string }[] }>('/galleries'),
  facilities: () => request<{ data: { id: number; name: string }[] }>('/facilities'),
  reviews: () => request<{ data: Review[] }>('/reviews'),
  leagues: () => request<{ data: League[] }>('/leagues'),
  league: (id: number) => request<{ data: League }>(`/leagues/${id}`),
  leagueStandings: (id: number) => request<{ data: unknown[] }>(`/leagues/${id}/standings`),
  leagueMatches: (id: number) => request<{ data: unknown[] }>(`/leagues/${id}/matches`),
  upcomingMatches: () => request<{ data: UpcomingMatch[] }>('/matches/upcoming'),

  // Auth
  login: (email: string, password: string) =>
    request<{ data: { user: unknown; token: string } }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (data: { name: string; email: string; phone?: string; password: string; password_confirmation: string }) =>
    request<{ data: { user: unknown; token: string } }>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Authenticated
  me: (token: string) =>
    request<{ data: unknown }>('/me', { headers: { Authorization: `Bearer ${token}` } }),
  logout: (token: string) =>
    request<{ message: string }>('/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }),
  myBookings: (token: string) =>
    request<{ data: Booking[] }>('/my-bookings', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  createBooking: (token: string, data: unknown) =>
    request<{ data: Booking }>('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
  cancelBooking: (token: string, id: number) =>
    request<{ message: string }>(`/bookings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
  createReview: (token: string, data: { rating: number; comment: string }) =>
    request<{ data: unknown }>('/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
};
