<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsInfal extends Model
{
    use HasFactory;

    protected $table = 'lms_infals';

    protected $fillable = [
        'schedule_id',
        'teacher_original_id',
        'teacher_replacement_id',
        'reason',
        'assigned_by'
    ];

    public function schedule()
    {
        return $this->belongsTo(LmsSchedule::class, 'schedule_id');
    }

    public function originalTeacher()
    {
        return $this->belongsTo(LmsTeacher::class, 'teacher_original_id');
    }

    public function replacementTeacher()
    {
        return $this->belongsTo(LmsTeacher::class, 'teacher_replacement_id');
    }

    public function assigner()
    {
        return $this->belongsTo(LmsUser::class, 'assigned_by');
    }
}
