<?php

/*
 * WEB
 */

Route::group([
    "prefix" => ADMIN,
    "middleware" => ["web", "auth:backend", "can:posts.manage"],
    "namespace" => "Dot\\Posts\\Controllers"
], function ($route) {
    $route->group(["prefix" => "posts"], function ($route) {
        $route->any('/', ["as" => "admin.posts.show", "uses" => "PostsController@index"]);
        $route->any('/create', ["as" => "admin.posts.create", "uses" => "PostsController@create"]);
        $route->any('/{id}/edit', ["as" => "admin.posts.edit", "uses" => "PostsController@edit"]);
        $route->any('/delete', ["as" => "admin.posts.delete", "uses" => "PostsController@delete"]);
        $route->any('/{status}/status', ["as" => "admin.posts.status", "uses" => "PostsController@status"]);
        $route->post('newSlug', 'PostsController@new_slug');
    });
});

/*
 * API
 */

Route::group([
    "prefix" => API,
    "middleware" => ["auth:api"],
    "namespace" => "Dot\\Posts\\Controllers"
], function ($route) {
    $route->get("/posts/show", "Dot\Posts\Controllers\PostsApiController@show");
    $route->post("/posts/create", "Dot\Posts\Controllers\PostsApiController@create");
    $route->post("/posts/update", "Dot\Posts\Controllers\PostsApiController@update");
    $route->post("/posts/views", "Dot\Posts\Controllers\PostsApiController@views");
    $route->post("/posts/destroy", "Dot\Posts\Controllers\PostsApiController@destroy");
});


