<?php

namespace App\Http\Controllers;

use App\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function get(Category $category, Request $request)
    {
        return $category->getCategoryPosts(
            $request->get('count', 10),
            $request->get('offset', 0)
        );
    }

    public function getCategory(Category $category)
    {
        return $category;
    }

    public function getVideos(Request $request)
    {
        return Category::getByFormat('video', $request->get('count', 10), $request->get('offset', 0), ['media']);
    }

    public function getAlbums(Request $request)
    {
        return Category::getByFormat('album',
            $request->get('count', 10),
            $request->get('offset', 0),
            ['galleries', 'galleries.files']
        );
    }

    public function getArticles(Request $request)
    {
        return Category::getByFormat('article',
            $request->get('count', 10),
            $request->get('offset', 0),
            ['articleAuthor']
        );
    }
}
