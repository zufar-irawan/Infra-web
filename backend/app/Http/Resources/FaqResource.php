<?php 

// app/Http/Resources/FaqResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FaqResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'q_id'      => $this->q_id,
            'a_id'      => $this->a_id,
            'q_en'      => $this->q_en,
            'a_en'      => $this->a_en,
            'is_active' => $this->is_active,
            'sort_order'=> $this->sort_order,
            'created_at'=> $this->created_at,
            'updated_at'=> $this->updated_at,
        ];
    }
}
