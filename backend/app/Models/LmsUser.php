<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Permission\Traits\HasRoles;

class LmsUser extends Authenticatable
{
    use HasApiTokens, Notifiable, HasRoles;

    protected $table = 'lms_users';

    protected $fillable = [
        'name', 'email', 'password', 'role', 'phone', 'status',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    protected $guard_name = 'lms_api';

    public function student()
    {
        return $this->hasOne(LmsStudent::class, 'user_id');
    }

    /* ===== Query Scopes ===== */

    public function scopeRole(Builder $q, ?string $role): Builder
    {
        return $role ? $q->where('role', $role) : $q;
    }

    public function scopeStatus(Builder $q, ?string $status): Builder
    {
        return $status ? $q->where('status', $status) : $q;
    }

    public function scopeSearch(Builder $q, ?string $keyword): Builder
    {
        if (!$keyword) return $q;
        return $q->where(function ($query) use ($keyword) {
            $query->where('name', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%")
                  ->orWhere('phone', 'like', "%{$keyword}%");
        });
    }
}
