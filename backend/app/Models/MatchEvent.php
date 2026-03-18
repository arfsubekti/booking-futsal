<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchEvent extends Model
{
    protected $fillable = ['league_match_id', 'player_id', 'team_id', 'type', 'minute'];

    public function match(): BelongsTo
    {
        return $this->belongsTo(LeagueMatch::class, 'league_match_id');
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
