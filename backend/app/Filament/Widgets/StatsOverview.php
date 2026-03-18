<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use App\Models\Court;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Total Pesanan', Booking::count())
                ->description('Seluruh pesanan masuk')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('success'),
            Stat::make('Total Lapangan', Court::where('is_active', true)->count())
                ->description('Lapangan aktif')
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('info'),
            Stat::make('Total Pengguna', User::count())
                ->description('Pengguna terdaftar'),
            Stat::make('Pendapatan', 'Rp ' . number_format(Booking::whereIn('status', ['paid', 'completed'])->sum('total_price'), 0, ',', '.'))
                ->description('Pendapatan dari pesanan')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('warning'),
        ];
    }
}
