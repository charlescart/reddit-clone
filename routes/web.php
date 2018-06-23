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
Route::post('/post', 'PostController@store')->name('store_post_path');
Route::get('/post/create', 'PostController@create')->name('create_post_path');
Route::get('/posts', 'PostController@index')->name('posts_path');
Route::get('post/{slug}', 'PostController@show')->name('post_path');
Route::get('post/{post}/edit', 'PostController@edit')->name('edit_post_path');
Route::put('post/{post}', 'PostController@update')->name('update_post_path');
Route::delete('post/', 'PostController@delete')->name('delete_post_path');

/*Routes Auth*/
Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
/*Fin Routes Auth*/
