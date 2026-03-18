<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Court extends Model
{
    protected $fillable = [
        'name',
        'type',
        'price_per_hour',
        'description',
        'image_path',
    ];

    public function facilities()
    {
        return $this->belongsToMany(Facility::class, 'court_facility');
    }

    public function pricings()
    {
        return $this->hasMany(CourtPricing::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
