<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('confirmation', function (Blueprint $table) {
            $table->date('appointment_date')->nullable()->after('status');
            $table->string('appointment_time', 10)->nullable()->after('appointment_date');
        });
    }

    public function down(): void
    {
        Schema::table('confirmation', function (Blueprint $table) {
            $table->dropColumn(['appointment_date', 'appointment_time']);
        });
    }
};
