<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Page extends \Dot\Pages\Models\Page
{
    public static function getPage($slug)
    {
        $arSlug = $slug . '-ar';
        $enSlug = $slug . '-en';
        $pages = self::where('slug', '=', $enSlug)->orWhere('slug', '=', $arSlug)->where('status', '=', 1)->get();
        if ($pages->count() === 0) {
            abort(404);
        }
        $arPage = $pages->where('slug', '=', $arSlug)->first();
        $enPage = $pages->where('slug', '=', $enSlug)->first();
        return [
            'title' => $arPage ? $arPage->title : '',
            'arabic_text' => $arPage ? $arPage->content : '',
            'english_text' => $enPage ? $enPage->content : '',
        ];
    }

    public function getPageSlug()
    {
        $slug = $this->slug;
        $len = strlen($slug);
        return preg_match('/-ar$/', $slug) || preg_match('/-en$/', $slug) ?
            substr($slug, 0, $len - 3) : $slug;
    }

    protected static function boot()
    {

    }
}
