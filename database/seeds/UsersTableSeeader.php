<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\User;
use App\Post;

class UsersTableSeeader extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['name' => 'Aaron Rodriguez', 'email' => 'aaron@gmail.com'],
            ['name' => 'Charles Rodriguez', 'email' => 'charlesrodriguez19@gmail.com'],
        ];

//        factory(App\User::class, 2)->create()->each(function ($user) {
//            $user->posts()->save(factory(App\Post::class)->make());
//        });

        foreach ($data as $people) {
            $user = factory(App\User::class)->create(['name' => $people['name'], 'email' => $people['email']]);

//            foreach ($users as $user) {
                factory(App\Post::class, 50)->create(['user_id' => $user->id]);
//            }

        }

    }
}
