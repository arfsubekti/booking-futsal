<?php

namespace App\Filament\Resources\TeamResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class PlayersRelationManager extends RelationManager
{
    protected static string $relationship = 'players';
    protected static ?string $title = 'Daftar Pemain';

    public function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')
                ->label('Nama Pemain')
                ->required()
                ->maxLength(255),

            Forms\Components\TextInput::make('jersey_number')
                ->label('Nomor Punggung')
                ->maxLength(3),

            Forms\Components\Select::make('position')
                ->label('Posisi')
                ->options([
                    'goalkeeper' => 'Kiper',
                    'defender'   => 'Defender / Flank',
                    'midfielder' => 'Pivot',
                    'forward'    => 'Penyerang',
                ])
                ->default('midfielder'),

            Forms\Components\DatePicker::make('date_of_birth')
                ->label('Tanggal Lahir'),

            Forms\Components\FileUpload::make('photo')
                ->label('Foto Pemain')
                ->image()
                ->directory('players/photos')
                ->columnSpanFull(),
        ])->columns(2);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\ImageColumn::make('photo')
                    ->label('Foto')
                    ->circular(),

                Tables\Columns\TextColumn::make('jersey_number')
                    ->label('#')
                    ->sortable(),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nama')
                    ->searchable(),

                Tables\Columns\TextColumn::make('position')
                    ->label('Posisi')
                    ->formatStateUsing(fn ($state) => match($state) {
                        'goalkeeper' => 'Kiper',
                        'defender'   => 'Defender',
                        'midfielder' => 'Pivot',
                        'forward'    => 'Penyerang',
                        default      => $state,
                    }),

                Tables\Columns\TextColumn::make('date_of_birth')
                    ->label('Tgl. Lahir')
                    ->date('d M Y'),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()->label('Tambah Pemain'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
}
