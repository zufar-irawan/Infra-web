<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsExamQuestionOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'option_text',
        'is_correct',
    ];

    // === RELATIONS ===
    public function question()
    {
        return $this->belongsTo(LmsExamQuestion::class, 'question_id');
    }
}
