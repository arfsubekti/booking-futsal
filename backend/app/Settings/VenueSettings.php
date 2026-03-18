<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class VenueSettings extends Settings
{
    public string $name;
    public ?string $address;
    public ?string $google_maps_link;
    public ?string $whatsapp_number;
    public ?string $logo;
    public ?string $banner;

    public static function group(): string
    {
        return 'venue';
    }
}