<?php

namespace Database\Seeders;

use App\Models\Lists;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();
        Lists::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User1',
        //     'email' => 'test1@example.com',
        // ]);
        // Lists::create([
        //     'subject' => 'Good Morning',
        //     'email' => 'good@gmail.com',
        //     'context' => 'Good Content Life is too short',
        // ]);
        // Lists::create([
        //     'subject' => 'Good Afternoon',
        //     'email' => 'after@gmail.com',
        //     'context' => 'Bad Content Art is too long',
        // ]);        
    }
}
