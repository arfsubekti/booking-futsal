<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\JsonResponse;

class GalleryController extends Controller
{
    public function index(): JsonResponse
    {
        $galleries = Gallery::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn($g) => [
                'id'        => $g->id,
                'title'     => $g->title,
                'image_url' => asset('storage/' . str_replace('public/', '', $g->image_path)),
            ]);

        return response()->json(['data' => $galleries]);
    }
}
