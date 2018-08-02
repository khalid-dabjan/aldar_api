<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends \Dot\Tags\Models\Tag
{

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'posts_tags');
    }

    public function getPosts($count, $offset)
    {
        return $this->posts()->take($count)->skip($offset)->get();
    }

    public static function getTrending($count)
    {
        $posts = Post::getMostViewed(20);
        $allTags = $posts->pluck('tags')->filter(function ($value, $key) {
            return $value->count() !== 0;
        })->flatten();
        return $allTags->unique('id')->slice(0, $count);
    }
}
