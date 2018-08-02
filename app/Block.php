<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Block extends \Dot\Blocks\Models\Block
{
    public function getRouteKeyName()
    {
        return 'slug';
    }

    protected $visible = ['id', 'name', 'slug', 'url'];
    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        return $this->categories->first() ? '/category/' . $this->categories->first()->slug : '';
    }

    public function getBlockPosts($count, $withBlock = true)
    {
        $cacheKey = $this->slug;

//        if (Cache::has($cacheKey)) {
//            return Cache::get($cacheKey);
//        }
        $return = [
            'block' => $this->load('categories'),
            'posts' => $this->posts()->where('status', '=', 1)->with(['image', 'categories', 'articleAuthor', 'tags'])->take($count)->get()
        ];
        Cache::put($cacheKey, $return, 30);
        return $withBlock ? $return : $return['posts'];
    }

    public function posts()
    {
        return $this->belongsToMany(Post::class, "posts_blocks", "block_id", "post_id")->orderBy('order')->withPivot('order');
    }

    public static function bySlug($slug)
    {
        return self::where('slug', '=', $slug)->first();
    }
}
