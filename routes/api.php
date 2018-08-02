<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::get('/user', function (Request $request) {
//    dd(factory(\App\Post::class)->make());
//    return $request->user();
//});

//\Illuminate\Support\Facades\DB::enableQueryLog();
Route::get('/block/{block}', 'BlocksController@get');
Route::get('/category/{category}', 'CategoryController@get');
Route::get('/getCategory/{category}', 'CategoryController@getCategory');
Route::get('/videos', 'CategoryController@getVideos');
Route::get('/albums', 'CategoryController@getAlbums');
Route::get('/articles', 'CategoryController@getArticles');
Route::get('/search', 'PostController@search');
Route::get('/post/view/{post}', 'PostController@view');
Route::get('/post/mostViewed', 'PostController@mostViewed');
Route::get('/post/related/{post}', 'PostController@related');
Route::get('/post/details/{post}', 'PostController@details');
Route::get('/post/breadcrumb/{post}', 'PostController@breadcrumb');
Route::get('/tag/trending', 'PostController@trendingTags');
Route::get('/post/tag/{tag}', 'PostController@getByTag');
Route::get('/nav/getFooterNavigation', 'NavController@getfooterNav');
Route::get('/nav/{navigation}', 'NavController@getNav');
Route::post('/newsletter', 'NewsletterController@create');
Route::get('/page/{slug}', 'PageController@get');
Route::post('/contact-us', 'PageController@contactUs');

Route::post('login', 'UserController@login');
//Route::post('register', 'UserController@register');
Route::group(['middleware' => 'auth:api'], function () {
//    Route::get('details', 'UserController@details');
    Route::post('order', 'UserController@order');
});