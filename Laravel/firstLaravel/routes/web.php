<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// 회원가입
Route::get('/register', [App\Http\Controllers\RegisterController::class, 'create'])
    ->middleware('guest')
    ->name('register');
Route::post('/register', [App\Http\Controllers\RegisterController::class, 'store'])
    ->middleware('guest');

// 로그인
Route::get('/login', [App\Http\Controllers\LoginControllers::class, 'index'])
    ->middleware('guest')
    ->name('login');
Route::post('/login', [App\Http\Controllers\LoginControllers::class, 'authenticate'])
    ->middleware('guest');

// 로그아웃
Route::get('/logout', [App\Http\Controllers\LoginControllers::class, 'logout'])
    ->middleware('guest')
    ->name('logout');


Route::get('/home', function() {
    return view('home');
});