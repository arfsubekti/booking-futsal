<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leagues', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('court_id')->constrained('courts')->onDelete('cascade');
            $table->enum('format', ['round_robin', 'knockout', 'hybrid'])->default('round_robin');
            $table->enum('status', ['draft', 'open', 'ongoing', 'finished'])->default('draft');
            $table->date('registration_start')->nullable();
            $table->date('registration_end')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->integer('max_teams')->default(8);
            $table->decimal('registration_fee', 12, 2)->default(0);
            $table->string('banner')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leagues');
    }
};
