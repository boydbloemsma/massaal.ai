<?php

use App\Http\Controllers\NotesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [NotesController::class, 'index'])
        ->name('dashboard');

    Route::post('notes', [App\Http\Controllers\NotesController::class, 'store'])->name('notes.store');
    Route::get('notes/{note}', [App\Http\Controllers\NotesController::class, 'show'])->name('notes.show');
    Route::post('notes/{note}/ask', [App\Http\Controllers\NotesController::class, 'askQuestion'])->name('notes.ask');
    Route::delete('notes/{note}', [App\Http\Controllers\NotesController::class, 'destroy'])->name('notes.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
