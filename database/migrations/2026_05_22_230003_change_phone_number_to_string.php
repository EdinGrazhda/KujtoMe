<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('parent', function (Blueprint $table) {
            $table->string('phone_number', 30)->nullable()->change();
        });

        Schema::table('doctor', function (Blueprint $table) {
            $table->string('phone_number', 30)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('parent', function (Blueprint $table) {
            $table->integer('phone_number')->nullable()->change();
        });

        Schema::table('doctor', function (Blueprint $table) {
            $table->integer('phone_number')->nullable()->change();
        });
    }
};
