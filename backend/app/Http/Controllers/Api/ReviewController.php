<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(): JsonResponse
    {
        $reviews = Review::with('user')
            ->latest()
            ->take(20)
            ->get()
            ->map(fn($r) => [
                'id'         => $r->id,
                'rating'     => $r->rating,
                'comment'    => $r->comment,
                'user'       => ['name' => optional($r->user)->name ?? 'Pengguna'],
                'created_at' => $r->created_at->format('d M Y'),
            ]);

        return response()->json(['data' => $reviews]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        // One review per user check
        $existing = Review::where('user_id', $request->user()->id)->first();
        if ($existing) {
            return response()->json(['message' => 'Anda sudah memberikan ulasan.'], 422);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'rating'  => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return response()->json([
            'message' => 'Ulasan berhasil dikirim.',
            'data'    => $review,
        ], 201);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $review = Review::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        $review->delete();
        return response()->json(['message' => 'Ulasan dihapus.']);
    }
}
