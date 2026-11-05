<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->json('codex')->nullable();
        });
    }

    public function down(): void
    {
        throw new RuntimeException('Removing stored Codex credentials requires explicit schema review.');
    }
};
