<?php

namespace App\Http\Controllers\Concerns;

trait HasPagination
{
    protected function paginationData($paginator, ?array $items = null): array
    {
        return [
            'data'         => $items ?? $paginator->items(),
            'current_page' => $paginator->currentPage(),
            'last_page'    => $paginator->lastPage(),
            'total'        => $paginator->total(),
        ];
    }
}
