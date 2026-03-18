<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Court;
use App\Models\Booking;
use App\Models\OpeningHour;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourtsController extends Controller
{
    public function index(): JsonResponse
    {
        $courts = Court::with(['facilities', 'pricings'])->get()->map(function ($court) {
            return [
                'id'             => $court->id,
                'name'           => $court->name,
                'type'           => $court->type,
                'description'    => $court->description,
                'price_per_hour' => $court->price_per_hour,
                'image_url'      => $court->image_path ? asset('storage/' . str_replace('public/', '', $court->image_path)) : null,
                'facilities'     => $court->facilities->map(fn($f) => ['id' => $f->id, 'name' => $f->name]),
                'pricings'       => $court->pricings->map(fn($p) => [
                    'day_type' => $p->day_type,
                    'price'    => $p->price,
                ]),
            ];
        });

        return response()->json(['data' => $courts]);
    }

    public function show(int $id): JsonResponse
    {
        $court = Court::with(['facilities', 'pricings'])->findOrFail($id);

        return response()->json([
            'data' => [
                'id'             => $court->id,
                'name'           => $court->name,
                'type'           => $court->type,
                'description'    => $court->description,
                'price_per_hour' => $court->price_per_hour,
                'image_url'      => $court->image_path ? asset('storage/' . str_replace('public/', '', $court->image_path)) : null,
                'facilities'     => $court->facilities->map(fn($f) => ['id' => $f->id, 'name' => $f->name]),
                'pricings'       => $court->pricings->map(fn($p) => [
                    'day_type' => $p->day_type,
                    'price'    => $p->price,
                ]),
            ],
        ]);
    }

    public function slots(int $id, Request $request): JsonResponse
    {
        $court = Court::with('pricings')->findOrFail($id);
        $date  = $request->query('date', now()->format('Y-m-d'));

        $dayOfWeek   = (int) date('w', strtotime($date));
        $openingHour = OpeningHour::where('day_of_week', $dayOfWeek)->first();

        if (!$openingHour) {
            return response()->json(['data' => []]);
        }

        $open  = (int) explode(':', $openingHour->open_time)[0];
        $close = (int) explode(':', $openingHour->close_time)[0];

        $bookings = Booking::where('court_id', $id)
            ->whereDate('start_time', $date)
            ->get();

        $dayType = in_array($dayOfWeek, [0, 6]) ? 'weekend' : 'weekday';
        $pricing = $court->pricings->firstWhere('day_type', $dayType);
        $price   = $pricing ? $pricing->price : $court->price_per_hour;

        $slots = [];
        for ($h = $open; $h < $close; $h++) {
            $isBooked = $bookings->contains(function ($b) use ($h) {
                return (int) date('H', strtotime($b->start_time)) === $h;
            });

            $slots[] = [
                'start'     => str_pad($h, 2, '0', STR_PAD_LEFT) . ':00',
                'end'       => str_pad($h + 1, 2, '0', STR_PAD_LEFT) . ':00',
                'is_booked' => $isBooked,
                'price'     => $price,
            ];
        }

        return response()->json(['data' => $slots]);
    }
}
