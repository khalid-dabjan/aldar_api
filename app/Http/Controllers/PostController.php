<?php

namespace App\Http\Controllers;

use App\Post;
use App\Tag;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function search(Request $request)
    {
        return [
            'block' => ['name' => 'نتائج البحث'],
            'posts' => Post::search($request->get('q'), $request->get('count', 10), $request->get('offset', 0))
        ];
    }

    public function view(Post $post)
    {
        $post->view();
    }

    public function mostViewed(Request $request)
    {
        return Post::getMostViewed($request->get('count', 5));
    }

    public function details(Post $post)
    {
        return $post->load(['image', 'categories', 'articleAuthor', 'tags']);
    }

    public function related(Post $post)
    {
        return $post->getRelated();
    }

    public function breadcrumb(Post $post)
    {
        return $post->getBreadcrumb();
    }

    public function getByTag(Tag $tag, Request $request)
    {
        return [
            'block' => $tag,
            'posts' => $tag->getPosts($request->get('count', 10), $request->get('offset', 0))
        ];

    }

    public function trendingTags(Request $request)
    {
        return Tag::getTrending($request->get('count', 4));
    }
}
