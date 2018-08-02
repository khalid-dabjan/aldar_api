<?php

namespace Dot\Navigations\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class Nav implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        return $builder->where('lang', app()->getLocale());
    }
}
