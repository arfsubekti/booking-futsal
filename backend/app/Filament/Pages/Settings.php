<?php

namespace App\Filament\Pages;

use App\Settings\VenueSettings;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Pages\SettingsPage;

class Settings extends SettingsPage
{
    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Pengaturan';
    
    protected ?string $heading = 'Pengaturan Venue';

    protected static string $settings = VenueSettings::class;

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nama Lapangan Futsal')
                    ->required(),
                Forms\Components\Textarea::make('address')
                    ->label('Alamat Lengkap'),
                Forms\Components\TextInput::make('google_maps_link')
                    ->label('Link Google Maps')
                    ->url(),
                Forms\Components\TextInput::make('whatsapp_number')
                    ->label('Nomor WhatsApp')
                    ->tel()
                    ->helperText('Gunakan format 628... (contoh: 628123456789)'),
                Forms\Components\FileUpload::make('logo')
                    ->label('Logo')
                    ->image()
                    ->directory('settings'),
                Forms\Components\FileUpload::make('banner')
                    ->label('Banner Promosi')
                    ->image()
                    ->directory('settings'),
            ]);
    }
}
