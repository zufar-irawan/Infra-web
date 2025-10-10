<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LmsRoleMiddleware
{
    /**
     * @param  array<string>  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = auth('lms_api')->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please login first.',
            ], 401);
        }

        // kalau route tidak kasih parameter role, handle defaultnya
        if (empty($roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Role parameter missing in middleware.',
            ], 500);
        }

        if (!in_array($user->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only roles: ' . implode(', ', $roles),
            ], 403);
        }

        return $next($request);
    }
}
