<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class League extends Model
{
    protected $fillable = [
        'name', 'description', 'court_id', 'format', 'status',
        'registration_start', 'registration_end', 'start_date', 'end_date',
        'max_teams', 'registration_fee', 'banner',
    ];

    protected $casts = [
        'registration_start' => 'date',
        'registration_end'   => 'date',
        'start_date'         => 'date',
        'end_date'           => 'date',
        'registration_fee'   => 'decimal:2',
    ];

    public function court(): BelongsTo
    {
        return $this->belongsTo(Court::class);
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function matches(): HasMany
    {
        return $this->hasMany(LeagueMatch::class);
    }

    public function getStandings(): array
    {
        $teams = $this->teams()->approved()->get();
        $standings = [];

        foreach ($teams as $team) {
            $home = $this->matches()->where('home_team_id', $team->id)->where('status', 'finished')->get();
            $away = $this->matches()->where('away_team_id', $team->id)->where('status', 'finished')->get();

            $played = $home->count() + $away->count();
            $won = $home->where('home_score', '>', 'away_score')->count()
                 + $away->where('away_score', '>', 'home_score')->count();
            $draw = $home->where('home_score', 'away_score')->count()
                  + $away->where('away_score', 'home_score')->count();
            $lost = $played - $won - $draw;
            $gf = $home->sum('home_score') + $away->sum('away_score');
            $ga = $home->sum('away_score') + $away->sum('home_score');
            $pts = ($won * 3) + $draw;

            $standings[] = [
                'team'   => $team,
                'played' => $played,
                'won'    => $won,
                'draw'   => $draw,
                'lost'   => $lost,
                'gf'     => $gf,
                'ga'     => $ga,
                'gd'     => $gf - $ga,
                'pts'    => $pts,
            ];
        }

        usort($standings, fn($a, $b) =>
            $b['pts'] <=> $a['pts'] ?: $b['gd'] <=> $a['gd'] ?: $b['gf'] <=> $a['gf']
        );

        return $standings;
    }
}
