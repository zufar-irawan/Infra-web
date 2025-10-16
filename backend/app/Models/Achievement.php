<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Achievement extends Model
{
    protected $fillable = ['poster'];

    protected $appends = ['poster_url'];

    public function getPosterUrlAttribute(): ?string
    {
        return $this->poster ? Storage::url($this->poster) : null;
    }
}
