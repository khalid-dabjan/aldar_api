<?php

namespace App;

use Dot\Navigations\Models\Nav;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Navigation extends Nav
{
    public function getRouteKeyName()
    {
        return 'name';
    }

    protected $visible = [
        'id',
        'name',
        'uri',
        'type',
        'children',
    ];

    protected $appends = [
        'uri'
    ];

    public function getNavigation()
    {
        $cacheKey = $this->name;
        \Cache::forget($cacheKey);
        if (\Cache::has($cacheKey)) {
            $items = \Cache::get($cacheKey);
        } else {
            $items = $this->items;
            \Cache::put($cacheKey, $items->toJson(), 5);

        }
        return $items;
    }

    public static function getFooterNavigation()
    {
        $res = self::whereIn('name', ['footer_1', 'footer_2'])->get();
//        dd($res);
        return [
            'footer_1' => $res->where('name', 'footer_1')->first() ? $res->where('name', 'footer_1')->first()->items : null,
            'footer_2' => $res->where('name', 'footer_2')->first() ? $res->where('name', 'footer_2')->first()->items : null,
        ];
    }

    public function items()
    {
        return $this->hasMany(Navigation::class, 'menu')->where('parent', '=', '0');
    }

    public function children()
    {
        return $this->hasMany(Navigation::class, 'parent');
    }

    public function typeObject()
    {
        if ($this->type == 'category') {
            return $this->hasOne(Category::class, 'id', 'type_id');
        }
        return $this->hasOne(Page::class, 'id', 'type_id');
    }

    public function getUriAttribute()
    {
        if ($this->children->count()) {
            return '#';
        }
        if ($this->link) {
            return $this->link;
        }
        if ($this->type === 'category') {
            return $this->typeObject ? '/category/' . $this->typeObject->slug : '';
        } elseif ($this->type === 'page') {
            return $this->typeObject ? '/page/' . $this->typeObject->getPageSlug() : '';
        }
    }
}
