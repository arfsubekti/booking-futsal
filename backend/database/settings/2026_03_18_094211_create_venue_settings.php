<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('venue.name', 'Futsal Booking');
        $this->migrator->add('venue.address', null);
        $this->migrator->add('venue.google_maps_link', null);
        $this->migrator->add('venue.whatsapp_number', null);
        $this->migrator->add('venue.logo', null);
        $this->migrator->add('venue.banner', null);
    }
};
