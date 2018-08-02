<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens;

    protected $visible = [
        'id',
        'name',
        'title',
        'url',
        'image_url'
    ];
    protected $appends = [
        'name',
        'title',
        'url',
        'image_url'
    ];

    public function getNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getTitleAttribute()
    {
        return 'صحفي';
    }

    public function getUrlAttribute()
    {
        return '/author/' . $this->id;
    }

    public function getImageUrlAttribute()
    {
        return '/images/writer.png';
    }
}
