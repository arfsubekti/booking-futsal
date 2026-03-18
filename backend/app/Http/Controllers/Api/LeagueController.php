<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\League;
use App\Models\MatchEvent;
use Illuminate\Http\JsonResponse;

class LeagueController extends Controller
{
    public function index(): JsonResponse
    {
        $leagues = League::with('court')->get()->map(fn($l) => [
            'id'         => $l->id,
            'name'       => $l->name,
            'format'     => $l->format,
            'status'     => $l->status,
            'start_date' => $l->start_date?->format('Y-m-d'),
            'end_date'   => $l->end_date?->format('Y-m-d'),
            'court'      => $l->court ? ['id' => $l->court->id, 'name' => $l->court->name] : null,
            'teams_count'=> $l->teams()->count(),
        ]);

        return response()->json(['data' => $leagues]);
    }

    public function show(int $id): JsonResponse
    {
        $league = League::with(['court', 'teams.players'])->findOrFail($id);

        return response()->json([
            'data' => [
                'id'                 => $league->id,
                'name'               => $league->name,
                'description'        => $league->description,
                'format'             => $league->format,
                'status'             => $league->status,
                'registration_fee'   => $league->registration_fee,
                'registration_start' => $league->registration_start?->format('Y-m-d'),
                'registration_end'   => $league->registration_end?->format('Y-m-d'),
                'start_date'         => $league->start_date?->format('Y-m-d'),
                'end_date'           => $league->end_date?->format('Y-m-d'),
                'court'              => $league->court ? ['id' => $league->court->id, 'name' => $league->court->name] : null,
                'teams'              => $league->teams->map(fn($t) => [
                    'id'      => $t->id,
                    'name'    => $t->name,
                    'logo'    => $t->logo ? asset('storage/' . $t->logo) : null,
                    'players' => $t->players->map(fn($p) => [
                        'id'            => $p->id,
                        'name'          => $p->name,
                        'jersey_number' => $p->jersey_number,
                        'position'      => $p->position,
                    ]),
                ]),
            ],
        ]);
    }

    public function standings(int $id): JsonResponse
    {
        $league    = League::findOrFail($id);
        $standings = $league->getStandings();

        $result = array_map(fn($row) => [
            'team'   => ['id' => $row['team']->id, 'name' => $row['team']->name, 'logo' => $row['team']->logo ? asset('storage/' . $row['team']->logo) : null],
            'played' => $row['played'],
            'won'    => $row['won'],
            'draw'   => $row['draw'],
            'lost'   => $row['lost'],
            'gf'     => $row['gf'],
            'ga'     => $row['ga'],
            'gd'     => $row['gd'],
            'pts'    => $row['pts'],
        ], $standings);

        return response()->json(['data' => $result]);
    }

    public function topScorers(int $id): JsonResponse
    {
        $scorers = MatchEvent::with(['player.team', 'match.league'])
            ->whereHas('match', fn($q) => $q->where('league_id', $id))
            ->whereIn('type', ['goal'])
            ->selectRaw('player_id, count(*) as goals')
            ->groupBy('player_id')
            ->orderByDesc('goals')
            ->take(10)
            ->get()
            ->map(fn($e) => [
                'player' => $e->player ? [
                    'id'            => $e->player->id,
                    'name'          => $e->player->name,
                    'jersey_number' => $e->player->jersey_number,
                    'team'          => $e->player->team ? ['id' => $e->player->team->id, 'name' => $e->player->team->name] : null,
                ] : null,
                'goals' => $e->goals,
            ]);

        return response()->json(['data' => $scorers]);
    }

    public function matches(int $id): JsonResponse
    {
        $matches = \App\Models\LeagueMatch::with(['homeTeam', 'awayTeam'])
            ->where('league_id', $id)
            ->orderBy('match_date')
            ->get()
            ->map(fn($m) => [
                'id'         => $m->id,
                'round'      => $m->round,
                'match_date' => $m->match_date?->format('Y-m-d H:i'),
                'status'     => $m->status,
                'home_team'  => ['id' => $m->homeTeam->id, 'name' => $m->homeTeam->name],
                'away_team'  => ['id' => $m->awayTeam->id, 'name' => $m->awayTeam->name],
                'home_score' => $m->home_score,
                'away_score' => $m->away_score,
            ]);

        return response()->json(['data' => $matches]);
    }

    public function upcomingMatches(): JsonResponse
    {
        $matches = \App\Models\LeagueMatch::with(['homeTeam', 'awayTeam', 'league'])
            ->whereIn('status', ['scheduled', 'ongoing'])
            ->orderBy('match_date', 'asc')
            ->take(6)
            ->get()
            ->map(fn($m) => [
                'id'         => $m->id,
                'round'      => $m->round,
                'match_date' => $m->match_date?->format('Y-m-d H:i'),
                'status'     => $m->status,
                'league'     => $m->league ? ['id' => $m->league->id, 'name' => $m->league->name] : null,
                'home_team'  => $m->homeTeam ? ['id' => $m->homeTeam->id, 'name' => $m->homeTeam->name, 'logo' => $m->homeTeam->logo ? asset('storage/' . $m->homeTeam->logo) : null] : null,
                'away_team'  => $m->awayTeam ? ['id' => $m->awayTeam->id, 'name' => $m->awayTeam->name, 'logo' => $m->awayTeam->logo ? asset('storage/' . $m->awayTeam->logo) : null] : null,
                'home_score' => $m->home_score,
                'away_score' => $m->away_score,
            ]);

        return response()->json(['data' => $matches]);
    }
}
