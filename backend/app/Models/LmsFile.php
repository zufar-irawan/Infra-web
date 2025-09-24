<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LmsFile extends Model
{
    protected $table = 'lms_files';

    protected $fillable = ['fileable_id', 'fileable_type', 'type', 'path', 'name', 'mime', 'size'];

    public function fileable()
    {
        return $this->morphTo();
    }
}
