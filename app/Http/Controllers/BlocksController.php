<?php

namespace App\Http\Controllers;

use App\Block;
use App\Category;
use App\OrderedBlock;
use App\Post;
use Illuminate\Http\Request;

class BlocksController extends Controller
{
    public function get($blockSlug, Request $request)
    {
        if (!$this->isActualBlock($blockSlug)) {
            return Category::getMostRead($blockSlug);
        }
        $block = new OrderedBlock($blockSlug);
//        $block = Block::where('slug', $blockSlug)->first();
        $count = $request->get('count', 6);
        return $block ? $block->getBlockPosts($count) : [
            'block' => [],
            'posts' => []
        ];
    }

    public function isActualBlock($name)
    {
        return substr($name, -3) != '@MR';
    }
}




//        if (!$block) {
//            $count = $request->get('count', 6);
//
//            $block = new Block();
//            $block->name = $blockS;
//            $block->slug = $blockS;
//            $block->type = 'post';
//            $block->lang = 'ar';
//            $block->limit = $count;
//            $block->save();
//
//            $categories = Category::get();
//            $block->categories()->save($categories[rand(0, $categories->count() - 1)]);
//
//            $allPosts = Post::take(50)->get();
//            $posts = $allPosts->slice(rand(0, $allPosts->count() - $count - 1), $count);
//            foreach ($posts as $post) {
//                $block->posts()->save($post, ['order' => 0, 'lang' => 'ar']);
//
//            }
////            $block->posts()->saveMany($posts->slice(rand(0, $posts->count() - $count - 1), $count - 1), ['order' => 0]);
//
//        }