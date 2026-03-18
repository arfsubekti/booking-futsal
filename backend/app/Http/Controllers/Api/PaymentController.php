<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'booking_id'  => 'required|exists:bookings,id',
            'amount'      => 'required|numeric|min:1',
            'method'      => 'required|in:transfer,cash,qris',
            'proof_image' => 'nullable|image|max:4096',
        ]);

        $booking = Booking::where('id', $validated['booking_id'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Booking sudah dibayar atau dibatalkan.'], 422);
        }

        $proofPath = null;
        if ($request->hasFile('proof_image')) {
            $proofPath = $request->file('proof_image')->store('payments/proofs', 'public');
        }

        $payment = \App\Models\Payment::create([
            'booking_id'  => $booking->id,
            'amount'      => $validated['amount'],
            'method'      => $validated['method'],
            'status'      => 'pending',
            'proof_image' => $proofPath,
        ]);

        $booking->update(['status' => 'confirmed']);

        return response()->json([
            'message' => 'Pembayaran berhasil dikirim, menunggu konfirmasi admin.',
            'data'    => $payment,
        ], 201);
    }

    public function show(int $id, Request $request): JsonResponse
    {
        $payment = \App\Models\Payment::with('booking')
            ->where('id', $id)
            ->whereHas('booking', fn($q) => $q->where('user_id', $request->user()->id))
            ->firstOrFail();

        return response()->json(['data' => $payment]);
    }

    public function updateStatus(int $id, Request $request): JsonResponse
    {
        $request->validate(['status' => 'required|in:pending,verified,rejected']);
        $payment = \App\Models\Payment::findOrFail($id);
        $payment->update(['status' => $request->status]);

        if ($request->status === 'verified') {
            $payment->booking->update(['status' => 'confirmed']);
        }
        if ($request->status === 'rejected') {
            $payment->booking->update(['status' => 'pending']);
        }

        return response()->json(['message' => 'Status pembayaran diperbarui.', 'data' => $payment]);
    }
}
