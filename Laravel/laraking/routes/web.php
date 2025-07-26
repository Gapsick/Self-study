<?php

use App\Models\Lists;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/', function (Request $request) {
    dd($request->all());
});

Route::put('/{id}', function (Request $request, $id) {
    return 'put route = ' . $id;
});

Route::get('/list', function () {
    return view('list', [
        'heading' => '최신 자료들',
        'lists' => Lists::all()
    ]);
});

Route::get('/list/{id}', function ($id) {
    return view('view', [
        'row' => Lists::find($id)
    ]);
})->where('idx', '[0-9]+');

