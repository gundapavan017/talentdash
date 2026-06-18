'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export default function PaginationClient({ page, totalPages, total, limit }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const go = (p: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set('page', String(p));
    router.push(`/salaries?${params.toString()}`, { scroll: false });
  };

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#EBEBEB]">
      <p className="text-sm text-[#717171]">
        Showing{' '}
        <span className="font-medium text-[#222222]">
          {from}–{to}
        </span>{' '}
        of{' '}
        <span className="font-medium text-[#222222]">{total}</span> records
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 text-sm border border-[#EBEBEB] rounded-md text-[#484848] hover:bg-[#F2F2F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 text-sm border border-[#EBEBEB] rounded-md text-[#484848] hover:bg-[#F2F2F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
