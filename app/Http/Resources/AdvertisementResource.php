<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AdvertisementResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'           => $this->id,
            'slug'         => $this->slug,
            'title'        => $this->title,
            'description'  => $this->description,
            'price'        => $this->price,
            'availability' => $this->availability,
            'payload'      => $this->payload,
            'image'        => $this->image,
            'phone'        => $this->when($this->relationLoaded('images'), $this->phone),
            'location'     => $this->location,
            'views'        => $this->views,
            'is_pinned'          => (bool) $this->is_pinned,
            'is_pinned_category' => (bool) $this->is_pinned_category,
            'expires_at'   => $this->expires_at?->format('d.m.Y'),
            'is_expired'   => $this->isExpired(),
            'user_id'      => $this->user_id,
            'category_id'  => $this->category_id,
            'created_at'   => $this->created_at?->format('d.m.Y'),
            'updated_at'   => $this->updated_at?->format('d.m.Y'),
            'category'     => $this->whenLoaded('category', fn () => $this->category ? [
                'id'   => $this->category->id,
                'name' => $this->category->name,
            ] : null),
            'user'         => $this->whenLoaded('user', fn () => $this->user ? [
                'id'     => $this->user->id,
                'name'   => $this->user->name,
                'slug'   => $this->user->slug,
                'avatar' => $this->user->avatar,
            ] : null),
            'images'       => $this->whenLoaded('images', fn () =>
                $this->images->map(fn ($img) => [
                    'id'    => $img->id,
                    'path'  => $img->path,
                    'order' => $img->order,
                ])->values()->all()
            ),
        ];
    }
}
