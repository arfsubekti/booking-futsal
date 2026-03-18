<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TeamResource\Pages;
use App\Filament\Resources\TeamResource\RelationManagers;
use App\Models\Team;
use App\Models\League;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TeamResource extends Resource
{
    protected static ?string $model = Team::class;
    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    protected static ?string $navigationLabel = 'Tim';
    protected static ?string $navigationGroup = 'Liga';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('league_id')
                ->label('Liga')
                ->options(League::all()->pluck('name', 'id'))
                ->required()
                ->searchable(),

            Forms\Components\TextInput::make('name')
                ->label('Nama Tim')
                ->required()
                ->maxLength(255),

            Forms\Components\TextInput::make('contact_person')
                ->label('Nama Penanggung Jawab'),

            Forms\Components\TextInput::make('contact_phone')
                ->label('No. HP / WhatsApp'),

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

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('logo')
                    ->label('Logo')
                    ->circular(),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Tim')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('league.name')
                    ->label('Liga'),

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
            ->filters([
                Tables\Filters\SelectFilter::make('league_id')
                    ->label('Liga')
                    ->options(\App\Models\League::all()->pluck('name', 'id')),

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending'  => 'Pending',
                        'approved' => 'Disetujui',
                        'rejected' => 'Ditolak',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\PlayersRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListTeams::route('/'),
            'create' => Pages\CreateTeam::route('/create'),
            'edit'   => Pages\EditTeam::route('/{record}/edit'),
        ];
    }
}
