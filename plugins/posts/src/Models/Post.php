<?php

namespace Dot\Posts\Models;

use Cache;
use Dot\Blocks\Models\Block;
use Dot\Categories\Models\Category;
use Dot\Galleries\Models\Gallery;
use Dot\Media\Models\Media;
use Dot\Platform\Model;
use Dot\Posts\Scopes\Post as PostScope;
use Dot\Seo\Models\SEO;
use Dot\Tags\Models\Tag;
use Dot\Users\Models\User;


/**
 * Class Post
 * @package Dot\Posts\Models
 */
class Post extends Model
{

    /**
     * @var bool
     */
    public $timestamps = true;
    /**
     * @var string
     */
    protected $table = 'posts';
    /**
     * @var string
     */
    protected $primaryKey = 'id';
    /**
     * @var array
     */
    protected $searchable = ['title', 'excerpt', 'content'];

    /**
     * @var int
     */
    protected $perPage = 20;

    /**
     * @var array
     */
    protected $sluggable = [
        'slug' => 'title',
    ];

    /**
     * @var array
     */
    protected $creatingRules = [
        'title' => 'required',
        "image_id" => "required"

    ];

    /**
     * @var array
     */
    protected $updatingRules = [
        'title' => 'required'
    ];

    protected function setValidationAttributes()
    {
        return trans("posts::posts.attributes");

    }


    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected
    static function boot()
    {
        parent::boot();

        static::addGlobalScope(new PostScope);
    }

    /**
     * Status scope
     * @param $query
     * @param $status
     */
    public
    function scopeStatus($query, $status)
    {
        switch ($status) {
            case "published":
                $query->where("status", 1);
                break;

            case "unpublished":
                $query->where("status", 0);
                break;
        }
    }

    /**
     * Format scope
     * @param $query
     * @param $format
     */
    public
    function scopeFormat($query, $format)
    {
        $query->where("format", $format);
    }

    /**
     * Meta relation
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public
    function meta()
    {
        return $this->hasMany(PostMeta::class);
    }

    /**
     * Seo relation
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public
    function seo()
    {
        return $this->hasOne(SEO::class);
    }

    /**
     * Image relation
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public
    function image()
    {
        return $this->hasOne(Media::class, "id", "image_id");
    }

    /**
     * Media relation
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public
    function media()
    {
        return $this->hasOne(Media::class, "id", "media_id")->where("type", "video");
    }

    /**
     * User relation
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public
    function user()
    {
        return $this->hasOne(User::class, "id", "user_id");
    }

    /**
     * Blocks relation
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public
    function blocks()
    {
        return $this->belongsToMany(Block::class, "posts_blocks", "post_id", "block_id");
    }

    /**
     * Categories relation
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public
    function categories()
    {
        return $this->belongsToMany(Category::class, "posts_categories", "post_id", "category_id");
    }

    /**
     * Galleries relation
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public
    function galleries()
    {
        return $this->belongsToMany(Gallery::class, "posts_galleries", "post_id", "gallery_id");
    }

    /**
     * Sync tags
     * @param $tags
     */
    public
    function syncTags($tags)
    {
        $tag_ids = array();

        if ($tags = @explode(",", $tags)) {
            $tags = array_filter($tags);
            $tag_ids = Tag::saveNames($tags);
        }

        $this->tags()->sync($tag_ids);
    }

    /**
     * Tags relation
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public
    function tags()
    {
        return $this->belongsToMany(Tag::class, "posts_tags", "post_id", "tag_id");
    }

    /**
     * Sync blocks
     * @param $blks
     */
    function syncBlocks($blks)
    {

        $new_blocks = collect($blks);
        $old_blocks = $this->blocks->pluck("id");

        $added_blocks = $new_blocks->diff($old_blocks)->toArray();

        foreach (Block::whereIn("id", $added_blocks)->get() as $block) {
            $block->addPost($this);
        }

        $removed_blocks = $old_blocks->diff($new_blocks)->toArray();

        foreach (Block::whereIn("id", $removed_blocks)->get() as $block) {
            $block->removePost($this);
        }

    }
}
