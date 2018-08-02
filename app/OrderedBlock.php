<?php

namespace App;


use Illuminate\Support\Facades\Storage;

class OrderedBlock
{
    public $block;

    public function __construct($slug)
    {
        $this->block = Block::bySlug($slug);
    }

    public function getBlockPosts($count)
    {
        $block = $this->block->getBlockPosts($count);
        $posts = $block['posts'];

        $order = $this->getOrder();
        if ($order) {
            $orderCol = collect(explode(',', $order));
            $orderedPosts = $posts->sortBy(function ($post) use ($orderCol) {
                return $orderCol->search($post->id);
            });
            $block['posts'] = $orderedPosts->values();
        }
        return $block;
    }

    public function getFileName()
    {
        return $this->block->slug . '.txt';
    }

    public function order($ids)
    {
        $this->block->posts()->sync(explode(',', $ids));
        Storage::disk('block')->put($this->getFileName(), $ids);
    }

    public function getOrder()
    {
        return Storage::disk('block')->exists($this->getFileName()) ? Storage::disk('block')->get($this->getFileName()) : false;
    }
}
