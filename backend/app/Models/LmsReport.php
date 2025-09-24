<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsReport extends Model
{
    use HasFactory;

    protected $table = 'lms_reports';

    protected $fillable = [
        'type',
        'content',
        'created_by'
    ];

    protected $casts = [
        'content' => 'array',
    ];

    public function creator()
    {
        return $this->belongsTo(LmsUser::class, 'created_by');
    }
}
