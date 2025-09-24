<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\LmsSchedule;

class LmsRoom extends Model
{
    use HasFactory;

    protected $table = 'lms_rooms';

    protected $fillable = [
        'name',
        'capacity',
        'type',
        'status'
    ];

    public function schedules()
    {
        return $this->hasMany(LmsSchedule::class, 'room_id');
    }

    public function exams()
    {
        return $this->hasMany(LmsExam::class, 'room_id');
    }
}
