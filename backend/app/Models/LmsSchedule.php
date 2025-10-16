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
        'day',
        'start_time',
        'end_time',
        'room_id',
        'created_by',
    ];

    public function room()
    {
        return $this->belongsTo(LmsRoom::class, 'room_id');
    }

    public function creator()
    {
        return $this->belongsTo(LmsUser::class, 'created_by');
    }
}
