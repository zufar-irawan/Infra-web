<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsScheduleImport extends Model
{
    use HasFactory;

    protected $table = 'lms_schedule_imports';

    protected $fillable = [
        'file_path',
        'imported_by',
        'imported_at',
        'status',
        'notes'
    ];

    public function importer()
    {
        return $this->belongsTo(LmsUser::class, 'imported_by');
    }
}
