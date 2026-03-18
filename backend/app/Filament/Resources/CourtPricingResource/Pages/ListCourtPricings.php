<?php

namespace App\Filament\Resources\CourtPricingResource\Pages;

use App\Filament\Resources\CourtPricingResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCourtPricings extends ListRecords
{
    protected static string $resource = CourtPricingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
