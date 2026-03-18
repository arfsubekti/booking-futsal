<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LeagueResource\Pages;
use App\Filament\Resources\LeagueResource\RelationManagers;
use App\Models\League;
use App\Models\Court;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class LeagueResource extends Resource
{
    protected static ?string $model = League::class;
    protected static ?string $navigationIcon = 'heroicon-o-trophy';
    protected static ?string $navigationLabel = 'Liga';
    protected static ?string $navigationGroup = 'Liga';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Informasi Liga')->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nama Liga')
                    ->required()
                    ->maxLength(255),

                Forms\Components\Textarea::make('description')
                    ->label('Deskripsi')
                    ->rows(3)
                    ->columnSpanFull(),

                Forms\Components\Select::make('court_id')
                    ->label('Lapangan')
                    ->options(Court::all()->pluck('name', 'id'))
                    ->required()
                    ->searchable(),

                Forms\Components\Select::make('format')
                    ->label('Format')
                    ->options([
                        'round_robin' => 'Round Robin',
                        'knockout'    => 'Knockout / Gugur',
                        'hybrid'      => 'Hybrid (Grup + Gugur)',
                    ])
                    ->default('round_robin')
                    ->required(),

                Forms\Components\Select::make('status')
                    ->label('Status')
                    ->options([
                        'draft'    => 'Draft',
                        'open'     => 'Pendaftaran Dibuka',
                        'ongoing'  => 'Sedang Berlangsung',
                        'finished' => 'Selesai',
                    ])
                    ->default('draft')
                    ->required(),

                Forms\Components\TextInput::make('max_teams')
                    ->label('Maks. Tim')
                    ->numeric()
                    ->default(8),

                Forms\Components\TextInput::make('registration_fee')
                    ->label('Biaya Pendaftaran (Rp)')
                    ->numeric()
                    ->prefix('Rp')
                    ->default(0),
            ])->columns(2),

            Forms\Components\Section::make('Jadwal')->schema([
                Forms\Components\DatePicker::make('registration_start')->label('Pendaftaran Mulai'),
                Forms\Components\DatePicker::make('registration_end')->label('Pendaftaran Berakhir'),
                Forms\Components\DatePicker::make('start_date')->label('Liga Mulai'),
                Forms\Components\DatePicker::make('end_date')->label('Liga Berakhir'),
            ])->columns(2),

            Forms\Components\Section::make('Media')->schema([
                Forms\Components\FileUpload::make('banner')
                    ->label('Banner Liga')
                    ->image()
                    ->directory('leagues/banners')
                    ->columnSpanFull(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Liga')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('court.name')
                    ->label('Lapangan'),

                Tables\Columns\BadgeColumn::make('format')
                    ->label('Format')
                    ->colors([
                        'primary' => 'round_robin',
                        'warning' => 'knockout',
                        'success' => 'hybrid',
                    ])
                    ->formatStateUsing(fn ($state) => match($state) {
                        'round_robin' => 'Round Robin',
                        'knockout' => 'Knockout',
                        'hybrid' => 'Hybrid',
                        default => $state,
                    }),

                Tables\Columns\BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'gray'    => 'draft',
                        'success' => 'open',
                        'warning' => 'ongoing',
                        'primary' => 'finished',
                    ])
                    ->formatStateUsing(fn ($state) => match($state) {
                        'draft' => 'Draft',
                        'open' => 'Pendaftaran',
                        'ongoing' => 'Berlangsung',
                        'finished' => 'Selesai',
                        default => $state,
                    }),

                Tables\Columns\TextColumn::make('teams_count')
                    ->label('Tim')
                    ->counts('teams'),

                Tables\Columns\TextColumn::make('start_date')
                    ->label('Mulai')
                    ->date('d M Y'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft'    => 'Draft',
                        'open'     => 'Pendaftaran',
                        'ongoing'  => 'Berlangsung',
                        'finished' => 'Selesai',
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
            RelationManagers\TeamsRelationManager::class,
            RelationManagers\MatchesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListLeagues::route('/'),
            'create' => Pages\CreateLeague::route('/create'),
            'edit'   => Pages\EditLeague::route('/{record}/edit'),
        ];
    }
}
