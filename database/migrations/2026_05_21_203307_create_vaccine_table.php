<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vaccine', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('protectsAgainst');
            $table->string('recommended_age_months');
            $table->string('name');
            $table->string('image');
            $table->string('description');
            $table->string('vaccination_municipality');
            $table->string('dose');
        


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vaccine');
    }
};
