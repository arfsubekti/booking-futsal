<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CourtPricingResource\Pages;
use App\Filament\Resources\CourtPricingResource\RelationManagers;
use App\Models\CourtPricing;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CourtPricingResource extends Resource
{
    protected static ?string $model = CourtPricing::class;

    protected static ?string $navigationLabel = 'Harga Lapangan';
    protected static ?string $modelLabel = 'Harga Lapangan';
    protected static ?string $pluralModelLabel = 'Harga Lapangan';
    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('court_id')
                    ->relationship('court', 'name')
                    ->required()
                    ->label('Lapangan'),
                Forms\Components\Select::make('day_type')
                    ->options([
                        'weekday' => 'Hari Kerja (Senin-Jumat)',
                        'weekend' => 'Akhir Pekan (Sabtu-Minggu)',
                        'holiday' => 'Hari Libur Nasional',
                    ])
                    ->required()
                    ->label('Jenis Hari'),
                Forms\Components\TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('Rp')
                    ->label('Harga'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('court.name')
                    ->label('Lapangan')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('day_type')
                    ->label('Jenis Hari')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'weekday' => 'gray',
                        'weekend' => 'success',
                        'holiday' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('price')
                    ->label('Harga')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
            'index' => Pages\ListCourtPricings::route('/'),
            'create' => Pages\CreateCourtPricing::route('/create'),
            'edit' => Pages\EditCourtPricing::route('/{record}/edit'),
        ];
    }
}
