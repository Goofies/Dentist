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

Route::get('/', 'ViewController@index')->name('welcome');
Route::group(['prefix' => 'view', 'as' => 'view.'], function() {
	Route::post('calendarInfo', 'ViewController@calendarInfo')->name('calendarInfo');
});
Route::group(['prefix' => 'patients', 'as' => 'patients.'], function() {
	Route::post('store', 'PatientsController@store')->name('store');
	Route::get('index', 'PatientsController@index')->name('index');
	Route::get('timeline/{id}', 'PatientsController@timeline')->name('timeline');
	Route::put('update', 'PatientsController@update')->name('update');
	Route::delete('{id}/destroy', 'PatientsController@destroy')->name('destroy');
});
Route::group(['prefix' => 'appointments', 'as' => 'appointments.'], function() {
	Route::post('store', 'AppointmentsController@store')->name('store');
	Route::get('{date}', 'AppointmentsController@get')->name('get');
	Route::delete('{id}/destroy', 'AppointmentsController@destroy')->name('destroy');
});
Route::group(['prefix' => 'notes', 'as' => 'notes.'], function() {
	Route::post('store', 'NotesController@store')->name('store');
	Route::get('{id}', 'NotesController@index')->name('index');
	Route::put('update', 'NotesController@update')->name('update');
	Route::delete('{id}/destroy', 'NotesController@destroy')->name('destroy');
});
Route::group(['prefix' => 'payments', 'as' => 'payments.'], function() {
	Route::post('store', 'PaymentController@store')->name('store');
	Route::delete('{id}/destroy', 'PaymentController@destroy')->name('destroy');
});
Auth::routes();
