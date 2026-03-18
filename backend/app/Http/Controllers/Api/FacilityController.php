<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;

class FacilityController extends Controller
{
    public function index(): JsonResponse
    {
        $facilities = Facility::all()->map(fn($f) => [
            'id'   => $f->id,
            'name' => $f->name,
        ]);

        return response()->json(['data' => $facilities]);
    }
}
