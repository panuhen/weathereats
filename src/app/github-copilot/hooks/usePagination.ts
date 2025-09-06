// Hook for managing pagination
import { useState } from 'react';

export function usePagination() {
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const maxResults = 30;
  return { page, setPage, pageSize, maxResults };
}
