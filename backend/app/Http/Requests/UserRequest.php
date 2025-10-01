<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        if($this->isMethod('POST')) {
            $data = [
                'name' => 'required',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:8|confirmed',
                'role' => 'required',
            ];
        } else {
            $data = [
                'name' => 'required',
                'role' => 'required',
                'email' => 'required|email|unique:users,email,'.request()->id,
                'password' => request()->password ? 'confirmed|min:8' : 'sometimes',
            ];
        }

        return $data;
    }
}
