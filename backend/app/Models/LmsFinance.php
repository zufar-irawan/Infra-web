<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsFinance extends Model
{
    use HasFactory;

    protected $table = 'lms_finance';

    protected $fillable = [
        'type',
        'category',
        'amount',
        'date',
        'description',
        'created_by'
    ];

    public function creator()
    {
        return $this->belongsTo(LmsUser::class, 'created_by');
    }
}
