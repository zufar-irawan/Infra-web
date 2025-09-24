<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsModule extends Model
{
    use HasFactory;

    protected $table = 'lms_modules';

    protected $fillable = ['subject_id', 'title', 'description', 'status'];

    public function subject()
    {
        return $this->belongsTo(LmsSubject::class, 'subject_id');
    }

    public function files()
    {
        return $this->morphMany(LmsFile::class, 'fileable');
    }
}
