<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('lang/{lang}', function ($lang) {
        session(['lang' => $lang]);
        App::setLocale(session('lang'));
        return \Redirect::back();
    })->where(['lang' => 'en|es']);

Route::group(['middleware' => ['lang']], function () {

	Route::get('/', 'PostController@index');
	Route::post('/post', 'PostController@store')->name('store_post_path');
	Route::get('/post/create', 'PostController@create')->name('create_post_path');
	Route::get('/posts', 'PostController@index')->name('posts_path');
	Route::get('post/{slug}', 'PostController@show')->name('post_path');
	Route::get('post/{post}/edit', 'PostController@edit')->name('edit_post_path');
	Route::put('post/{post}', 'PostController@update')->name('update_post_path');
	Route::delete('post/{post}', 'PostController@delete')->name('delete_post_path');

	Route::post('/post/{post}/comment/{padre_id?}', 'PostCommentController@store')->name('store.comment.path');

	Route::group(['middleware' => ['auth']], function (){

	});

	/*Routes Auth*/
	Auth::routes();

	Route::get('/home', 'HomeController@index')->name('home');
	/*Fin Routes Auth*/

});
