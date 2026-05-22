<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('children', function (Blueprint $table) {
            $table->string('surname')->nullable()->change();
            $table->string('blood_type')->nullable()->change();
            $table->date('date_of_birth')->nullable()->change();
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->change();
            $table->integer('personal_number')->nullable()->change();
        });

        Schema::table('parent', function (Blueprint $table) {
            $table->string('surname')->nullable()->change();
            $table->integer('phone_number')->nullable()->change();
            $table->string('personal_number')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('children', function (Blueprint $table) {
            $table->string('surname')->nullable(false)->change();
            $table->string('blood_type')->nullable(false)->change();
            $table->date('date_of_birth')->nullable(false)->change();
            $table->enum('gender', ['male', 'female', 'other'])->nullable(false)->change();
            $table->integer('personal_number')->nullable(false)->change();
        });

        Schema::table('parent', function (Blueprint $table) {
            $table->string('surname')->nullable(false)->change();
            $table->integer('phone_number')->nullable(false)->change();
            $table->string('personal_number')->nullable(false)->change();
        });
    }
};
