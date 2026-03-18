<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = app(\App\Settings\VenueSettings::class);

        return response()->json([
            'data' => [
                'name'             => $settings->name,
                'address'          => $settings->address,
                'whatsapp_number'  => $settings->whatsapp_number,
                'google_maps_link' => $settings->google_maps_link,
                'banner_url'       => $settings->banner ? asset('storage/' . str_replace('public/', '', $settings->banner)) : null,
            ],
        ]);
    }
}
