<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends \Dot\Categories\Models\Category
{

    protected $visible = [
        'id',
        'name',
        'slug',
        'breadcrumb'
    ];
    protected $appends = [
        'breadcrumb'
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getCategoryPosts($count, $offset)
    {
        $featuredPosts = $this->getFeaturedPosts($count, $offset);
        $normalPosts = $this->getNormalPosts($count - $featuredPosts->count(), $offset, $featuredPosts->pluck('id')->toArray());
        if ($offset == 0) {
            if ($featuredPosts->count() != $count) {
                $allPosts = $featuredPosts->merge($normalPosts);
            } else {
                $allPosts = $featuredPosts;
            }
        } else {
            $allPosts = $normalPosts;
        }
        return [
            'category' => $this,
            'posts' => $allPosts
        ];
    }

    public function getCategoryBlock()
    {
        $block = Block::where('slug', '=', $this->id . '-featured')->first();
        return $block;
    }

    public function getFeaturedPosts($count, $offset)
    {
        $featuredBlock = $this->getCategoryBlock();
        return $featuredBlock ? $featuredBlock->getBlockPosts($count, false) : collect([]);
    }

    public function getNormalPosts($count, $offset, $notIn = [])
    {
        return $this->posts()->whereNotIn('id', $notIn)->take($count)->skip($offset)->get()->load(['image', 'categories', 'articleAuthor', 'tags']);
    }

    public static function getMostRead($slug)
    {
        $categorySlug = explode('@', $slug)[0];
        return [
            'block' => [
                'name' => 'الأكثر قراءة'
            ],
            'posts' => Post::getMostViewed(5, ['category_slug' => $categorySlug])
        ];
    }

    public static function getByFormat($format, $count, $offset, $loadRelations = [])
    {
        return Post::where('format', '=', $format)->take($count)->skip($offset)->get()->load(array_merge(['image', 'categories', 'tags'], $loadRelations));
    }


    public function posts()
    {
        return $this->belongsToMany(Post::class, "posts_categories", "category_id", "post_id");
    }

    function categories()
    {
        return $this->hasMany(Category::class, 'parent');
    }

    function parentRelation()
    {
        return $this->hasOne(Category::class, 'id', 'parent');
    }

    public function getBreadcrumbAttribute()
    {
        return $this->parentRelation ? [$this->parentRelation] : [];
    }
}
