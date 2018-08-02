<?php

namespace Dot\Navigations\Models;

use Dot\Navigations\Scopes\Nav as NavScope;
use Dot\Platform\Model;

/*
 * Class Nav
 * @package Dot\Navigations\Models
 */
class Nav extends Model
{

    /*
     * @var string
     */
    protected $table = 'navigations';

    /*
     * @var string
     */
    protected $parentKey = "parent";

    /*
     * Creating rules
     * @var array
     */
    protected $creatingRules = [
        "name" => "required"
    ];

    /*
     * Updating rules
     * @var array
     */
    protected $updatingRules = [
        "name" => "required"
    ];

    /*
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope(new NavScope);
    }

    /*
     * Set validation attributes
     * @return array|\Illuminate\Contracts\Translation\Translator|null|string
     */
    public function setValidationAttributes()
    {
        return trans("navigations::navigations.attributes");
    }

    /*
     * Save Menu items
     * @param array $children
     */
    public function saveChildren($children = [])
    {

        $order = 0;

        foreach ($children as $item) {

            if (isset($item->id)) {

                $nav = new self();
                $nav->name = $item->name;
                $nav->link = $item->link;
                $nav->type = $item->type;
                $nav->image_id = isset($item->image_id) ? $item->image_id : 0;
                $nav->type_id = $item->type_id;
                $nav->parent = $this->id;
                $nav->order = $order;
                $nav->menu = $this->menu;
                $nav->lang = app()->getLocale();

                $nav->save();

                $children = isset($item->children) ? $item->children : [];
                $nav->saveChildren($children);

                $order++;
            }
        }
    }

    /**
     * Items replation
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function items()
    {
        return $this->hasMany(self::class, 'menu');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function children(){
        return $this->hasMany(self::class, 'parent');
    }

}
