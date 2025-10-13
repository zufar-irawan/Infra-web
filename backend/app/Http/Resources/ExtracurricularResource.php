<?php 
// app/Http/Resources/ExtracurricularResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExtracurricularResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name_id' => $this->name_id,
            'name_en' => $this->name_en,
            'img' => $this->img,
            'ig' => $this->ig,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at,
        ];
    }
}
