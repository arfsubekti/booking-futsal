<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OpeningHourResource\Pages;
use App\Filament\Resources\OpeningHourResource\RelationManagers;
use App\Models\OpeningHour;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OpeningHourResource extends Resource
{
    protected static ?string $model = OpeningHour::class;

    protected static ?string $navigationLabel = 'Jam Operasional';
    protected static ?string $modelLabel = 'Jam Operasional';
    protected static ?string $pluralModelLabel = 'Jam Operasional';
    protected static ?string $navigationIcon = 'heroicon-o-clock';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('day_of_week')
                    ->options([
                        0 => 'Minggu',
                        1 => 'Senin',
                        2 => 'Selasa',
                        3 => 'Rabu',
                        4 => 'Kamis',
                        5 => 'Jumat',
                        6 => 'Sabtu',
                    ])
                    ->required()
                    ->label('Hari'),
                Forms\Components\TimePicker::make('open_time')
                    ->required()
                    ->label('Jam Buka'),
                Forms\Components\TimePicker::make('close_time')
                    ->required()
                    ->label('Jam Tutup'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('day_of_week')
                    ->label('Hari')
                    ->badge()
                    ->formatStateUsing(fn (int $state): string => match ($state) {
                        0 => 'Minggu',
                        1 => 'Senin',
                        2 => 'Selasa',
                        3 => 'Rabu',
                        4 => 'Kamis',
                        5 => 'Jumat',
                        6 => 'Sabtu',
                        default => 'Unknown',
                    })
                    ->color('primary')
                    ->sortable(),
                Tables\Columns\TextColumn::make('open_time')
                    ->time()
                    ->label('Jam Buka'),
                Tables\Columns\TextColumn::make('close_time')
                    ->time()
                    ->label('Jam Tutup'),
            ])
            ->filters([
                //
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
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOpeningHours::route('/'),
            'create' => Pages\CreateOpeningHour::route('/create'),
            'edit' => Pages\EditOpeningHour::route('/{record}/edit'),
        ];
    }
}
