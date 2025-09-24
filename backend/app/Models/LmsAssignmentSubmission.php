<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsAssignmentSubmission extends Model
{
    use HasFactory;

    protected $table = 'lms_assignment_submissions';

    protected $fillable = ['assignment_id', 'student_id', 'grade', 'feedback', 'submitted_at'];

    public function assignment()
    {
        return $this->belongsTo(LmsAssignment::class, 'assignment_id');
    }

    public function student()
    {
        return $this->belongsTo(LmsStudent::class, 'student_id');
    }

    public function files()
    {
        return $this->morphMany(LmsFile::class, 'fileable');
    }
}
