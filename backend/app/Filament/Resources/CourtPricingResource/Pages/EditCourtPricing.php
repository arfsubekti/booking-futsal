<?php

namespace App\Filament\Resources\CourtPricingResource\Pages;

use App\Filament\Resources\CourtPricingResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCourtPricing extends EditRecord
{
    protected static string $resource = CourtPricingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
