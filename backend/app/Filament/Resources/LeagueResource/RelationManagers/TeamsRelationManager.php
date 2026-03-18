<?php

namespace App\Filament\Resources\LeagueResource\RelationManagers;

use App\Models\Player;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class TeamsRelationManager extends RelationManager
{
    protected static string $relationship = 'teams';
    protected static ?string $title = 'Tim Peserta';

    public function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')
                ->label('Nama Tim')
                ->required()
                ->maxLength(255),

            Forms\Components\TextInput::make('contact_person')
                ->label('Nama Kontak'),

            Forms\Components\TextInput::make('contact_phone')
                ->label('No. HP / WA'),

            Forms\Components\Select::make('status')
                ->label('Status')
                ->options([
                    'pending'  => 'Pending',
                    'approved' => 'Disetujui',
                    'rejected' => 'Ditolak',
                ])
                ->default('approved'),

            Forms\Components\FileUpload::make('logo')
                ->label('Logo Tim')
                ->image()
                ->directory('teams/logos')
                ->columnSpanFull(),
        ])->columns(2);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\ImageColumn::make('logo')
                    ->label('Logo')
                    ->circular(),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Tim')
                    ->searchable(),

                Tables\Columns\TextColumn::make('players_count')
                    ->label('Pemain')
                    ->counts('players'),

                Tables\Columns\TextColumn::make('contact_person')
                    ->label('Kontak'),

                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'approved',
                        'danger'  => 'rejected',
                    ])
                    ->formatStateUsing(fn ($state) => match($state) {
                        'pending' => 'Pending',
                        'approved' => 'Disetujui',
                        'rejected' => 'Ditolak',
                        default => $state,
                    }),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()->label('Tambah Tim'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
}
