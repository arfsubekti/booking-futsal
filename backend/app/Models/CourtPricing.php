<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourtPricing extends Model
{
    protected $table = 'court_pricing';

    protected $fillable = [
        'court_id',
        'day_type',
        'price',
    ];

    public function court()
    {
        return $this->belongsTo(Court::class);
    }
}
