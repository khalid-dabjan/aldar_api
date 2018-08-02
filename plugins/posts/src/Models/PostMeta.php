<?php

namespace Dot\Posts\Models;

use Dot\Platform\Model;

/**
 * Class PostMeta
 * @package Dot\Posts\Models
 */
class PostMeta extends Model
{

    /**
     * @var bool
     */
    public $timestamps = false;
    /**
     * @var string
     */
    protected $table = "posts_meta";

}
