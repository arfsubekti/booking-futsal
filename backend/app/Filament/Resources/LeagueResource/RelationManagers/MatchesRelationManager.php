<?php

namespace App\Filament\Resources\LeagueResource\RelationManagers;

use App\Models\Team;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class MatchesRelationManager extends RelationManager
{
    protected static string $relationship = 'matches';
    protected static ?string $title = 'Jadwal Pertandingan';

    public function form(Form $form): Form
    {
        $leagueId = $this->getOwnerRecord()->id;

        return $form->schema([
            Forms\Components\Select::make('home_team_id')
                ->label('Tim Kandang')
                ->options(Team::where('league_id', $leagueId)->approved()->pluck('name', 'id'))
                ->required()
                ->searchable(),

            Forms\Components\Select::make('away_team_id')
                ->label('Tim Tamu')
                ->options(Team::where('league_id', $leagueId)->approved()->pluck('name', 'id'))
                ->required()
                ->searchable(),

            Forms\Components\DateTimePicker::make('match_date')
                ->label('Tanggal & Jam Pertandingan')
                ->required(),

            Forms\Components\TextInput::make('round')
                ->label('Babak / Pekan ke-')
                ->numeric()
                ->default(1),

            Forms\Components\Select::make('status')
                ->label('Status')
                ->options([
                    'scheduled' => 'Dijadwalkan',
                    'ongoing'   => 'Sedang Berlangsung',
                    'finished'  => 'Selesai',
                    'cancelled' => 'Dibatalkan',
                ])
                ->default('scheduled'),

            Forms\Components\TextInput::make('home_score')
                ->label('Skor Tim Kandang')
                ->numeric()
                ->minValue(0),

            Forms\Components\TextInput::make('away_score')
                ->label('Skor Tim Tamu')
                ->numeric()
                ->minValue(0),

            Forms\Components\Textarea::make('notes')
                ->label('Catatan')
                ->rows(2)
                ->columnSpanFull(),
        ])->columns(2);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->columns([
                Tables\Columns\TextColumn::make('round')
                    ->label('Pekan')
                    ->sortable(),

                Tables\Columns\TextColumn::make('homeTeam.name')
                    ->label('Tim Kandang'),

                Tables\Columns\TextColumn::make('score')
                    ->label('Skor')
                    ->state(fn ($record) =>
                        $record->home_score !== null
                        ? ($record->home_score . ' - ' . $record->away_score)
                        : 'vs'
                    )
                    ->alignCenter()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('awayTeam.name')
                    ->label('Tim Tamu'),

                Tables\Columns\TextColumn::make('match_date')
                    ->label('Tanggal')
                    ->dateTime('d M Y, H:i'),

                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'gray'    => 'scheduled',
                        'warning' => 'ongoing',
                        'success' => 'finished',
                        'danger'  => 'cancelled',
                    ])
                    ->formatStateUsing(fn ($state) => match($state) {
                        'scheduled' => 'Dijadwalkan',
                        'ongoing' => 'Berlangsung',
                        'finished' => 'Selesai',
                        'cancelled' => 'Batal',
                        default => $state,
                    }),
            ])
            ->defaultSort('match_date')
            ->headerActions([
                Tables\Actions\CreateAction::make()->label('Tambah Pertandingan'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
}
