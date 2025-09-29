<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsAssignment extends Model
{
    use HasFactory;

    protected $table = 'lms_assignments';

    protected $fillable = ['class_id', 'title', 'description', 'deadline', 'created_by'];

    public function class()
    {
        return $this->belongsTo(LmsClass::class, 'class_id');
    }

    public function creator()
    {
        return $this->belongsTo(LmsUser::class, 'created_by');
    }

    public function submissions()
    {
        return $this->hasMany(LmsAssignmentSubmission::class, 'assignment_id');
    }

    public function files()
    {
        return $this->morphMany(LmsFile::class, 'fileable');
    }
}
