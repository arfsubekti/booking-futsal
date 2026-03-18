<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /** User: list own bookings */
    public function myBookings(Request $request): JsonResponse
    {
        $bookings = Booking::with('court')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn($b) => $this->format($b));

        return response()->json(['data' => $bookings]);
    }

    /** User: show single booking */
    public function show(int $id, Request $request): JsonResponse
    {
        $booking = Booking::with('court')
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json(['data' => $this->format($booking)]);
    }

    /** User: create booking (anti double-booking) */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'court_id'   => 'required|exists:courts,id',
            'start_time' => 'required|date|after:now',
            'end_time'   => 'required|date|after:start_time',
            'notes'      => 'nullable|string|max:500',
        ]);

        // Anti double-booking check
        $conflict = Booking::where('court_id', $validated['court_id'])
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($validated) {
                $q->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                  ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                  ->orWhere(function ($q2) use ($validated) {
                      $q2->where('start_time', '<=', $validated['start_time'])
                         ->where('end_time', '>=', $validated['end_time']);
                  });
            })->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'Slot waktu ini sudah dipesan. Pilih slot lain.',
            ], 422);
        }

        // Calculate total price
        $court = \App\Models\Court::with('pricings')->findOrFail($validated['court_id']);
        $hours = (strtotime($validated['end_time']) - strtotime($validated['start_time'])) / 3600;
        $dayOfWeek = date('w', strtotime($validated['start_time']));
        $dayType = in_array($dayOfWeek, [0, 6]) ? 'weekend' : 'weekday';
        $pricing = $court->pricings->firstWhere('day_type', $dayType);
        $pricePerHour = $pricing ? $pricing->price : $court->price_per_hour;
        $totalPrice = $pricePerHour * $hours;

        $booking = Booking::create([
            'court_id'    => $validated['court_id'],
            'user_id'     => $request->user()->id,
            'start_time'  => $validated['start_time'],
            'end_time'    => $validated['end_time'],
            'total_price' => $totalPrice,
            'notes'       => $validated['notes'] ?? null,
            'status'      => 'pending',
        ]);

        return response()->json([
            'message' => 'Booking berhasil dibuat.',
            'data'    => $this->format($booking->load('court')),
        ], 201);
    }

    /** User: cancel booking */
    public function cancel(int $id, Request $request): JsonResponse
    {
        $booking = Booking::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Booking tidak bisa dibatalkan.'], 422);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Booking berhasil dibatalkan.']);
    }

    /** Admin: list all bookings */
    public function adminIndex(Request $request): JsonResponse
    {
        $bookings = Booking::with(['court', 'user'])
            ->latest()
            ->paginate(20);

        return response()->json(['data' => $bookings]);
    }

    /** Admin: update booking status */
    public function updateStatus(int $id, Request $request): JsonResponse
    {
        $request->validate(['status' => 'required|in:pending,confirmed,cancelled,completed']);
        $booking = Booking::findOrFail($id);
        $booking->update(['status' => $request->status]);

        return response()->json(['message' => 'Status diperbarui.', 'data' => $booking]);
    }

    private function format(Booking $b): array
    {
        return [
            'id'          => $b->id,
            'court'       => $b->court ? ['id' => $b->court->id, 'name' => $b->court->name] : null,
            'start_time'  => $b->start_time,
            'end_time'    => $b->end_time,
            'total_price' => $b->total_price,
            'status'      => $b->status,
            'notes'       => $b->notes,
            'created_at'  => $b->created_at,
        ];
    }
}
