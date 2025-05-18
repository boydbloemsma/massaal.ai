<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Notes routes
    Route::get('notes', [App\Http\Controllers\NotesController::class, 'index'])->name('notes.index');
    Route::get('notes/create', [App\Http\Controllers\NotesController::class, 'create'])->name('notes.create');
    Route::post('notes', [App\Http\Controllers\NotesController::class, 'store'])->name('notes.store');
    Route::get('notes/{note}', [App\Http\Controllers\NotesController::class, 'show'])->name('notes.show');
    Route::post('notes/{note}/ask', [App\Http\Controllers\NotesController::class, 'askQuestion'])->name('notes.ask');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
