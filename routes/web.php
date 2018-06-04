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
Route::get('/posts', 'PostController@index')->name('posts_path');
Route::get('post/{title}', 'PostController@show')->name('post_path');

/*Routes Auth*/
Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
/*Fin Routes Auth*/
