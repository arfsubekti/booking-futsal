<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    protected $fillable = ['team_id', 'name', 'jersey_number', 'position', 'date_of_birth', 'photo'];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function matchEvents(): HasMany
    {
        return $this->hasMany(MatchEvent::class);
    }

    public function goals(): int
    {
        return $this->matchEvents()->whereIn('type', ['goal'])->count();
    }
}
