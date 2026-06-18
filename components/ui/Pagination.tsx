'use client';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}

export default function Pagination({ page, totalPages, total, limit, onPage }: PaginationProps) {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#EBEBEB]">
      <p className="text-sm text-[#717171]">
        Showing <span className="font-medium text-[#222222]">{from}–{to}</span> of{' '}
        <span className="font-medium text-[#222222]">{total}</span> records
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 text-sm border border-[#EBEBEB] rounded-md text-[#484848] hover:bg-[#F2F2F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 text-sm border border-[#EBEBEB] rounded-md text-[#484848] hover:bg-[#F2F2F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
