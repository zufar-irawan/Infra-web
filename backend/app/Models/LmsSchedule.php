<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsSchedule extends Model
{
    use HasFactory;

    protected $table = 'lms_schedules';

    protected $fillable = [
        'title',
        'description',
        'type',
        'target_type',
        'target_id',
        'room_id',
        'day',
        'start_time',
        'end_time',
        'created_by',
        'is_practice_week'
    ];

    public function room()
    {
        return $this->belongsTo(LmsRoom::class, 'room_id');
    }

    public function creator()
    {
        return $this->belongsTo(LmsUser::class, 'created_by');
    }

    public function infals()
    {
        return $this->hasMany(LmsInfal::class, 'schedule_id');
    }
}
