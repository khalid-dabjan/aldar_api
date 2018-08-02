<?php

/*
 * WEB
 */

Route::group([
    'prefix' => ADMIN,
    'middleware' => ['web', 'auth:backend', 'can:navigations.manage'],
    "namespace" => "Dot\\Navigations\\Controllers"
], function ($route) {
    $route->group(['prefix' => 'navigations'], function ($route) {
        $route->get('/{id?}', ['uses' => 'NavigationsController@index', 'as' => 'admin.navigations.show']);
        $route->any('/search', ['uses' => 'NavigationsController@search', 'as' => 'admin.navigations.search']);
        $route->any('/save_menu', ['uses' => 'NavigationsController@save_menu', 'as' => 'admin.navigations.save_menu']);
        $route->any('/delete_menu', ['uses' => 'NavigationsController@delete_menu', 'as' => 'admin.navigations.delete_menu']);
        $route->any('/save_items', ['uses' => 'NavigationsController@save_items', 'as' => 'admin.navigations.save_items']);
        $route->any('/add_link', ['uses' => 'NavigationsController@add_link', 'as' => 'admin.navigations.add_link']);
    });
});
