<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = ['title', 'cover_image', 'content'];

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
