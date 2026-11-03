import { useEffect, useState } from "react";

export const PAGE_SIZES = [10, 25, 50, 100];

export function pageWindow(current, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  let left = Math.max(2, current - 2);
  let right = Math.min(totalPages - 1, current + 2);
  if (current <= 3) {
    left = 2;
    right = 5;
  }
  if (current >= totalPages - 2) {
    left = totalPages - 4;
    right = totalPages - 1;
  }

  const pages = [1];
  if (left > 2) pages.push("start-gap");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push("end-gap");
  pages.push(totalPages);
  return pages;
}

export default function usePagination(items) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => setPage(1), [items, pageSize]);

  const current = Math.min(Math.max(1, page), totalPages);
  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(total, current * pageSize);

  return {
    page: current,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    start,
    end,
    total,
    pageItems: items.slice(Math.max(start - 1, 0), end),
    window: pageWindow(current, totalPages),
  };
}
