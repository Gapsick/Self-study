<?php

use App\Http\Controllers\PostController;
use App\Models\Lists;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::view('/', 'welcome');
Route::resource('posts', PostController::class); 

