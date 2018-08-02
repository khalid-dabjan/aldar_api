<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
//        $post = \Dot\Posts\Models\Post::first();
//        $post = \Dot\Posts\Models\Post::where('format', '=', 'video')->first();

        $categpries = \App\Category::get();
//        $newPost = clone $post;
        for ($i = 1; $i < 100; $i++) {
            $newPost = new \App\Post();
            $newPost->fill($post->toArray());
            unset($newPost->id);
            $newPost->title = $newPost->title . $i;
            $newPost->slug = $newPost->slug . $i;
            $newPost->save();
            $newPost->categories()->saveMany($categpries);
        }

    }
}
