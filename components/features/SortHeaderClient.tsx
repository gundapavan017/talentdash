'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type SortKey = 'tc_desc' | 'tc_asc' | 'date_desc';

export default function SortHeaderClient({ currentSort }: { currentSort: SortKey }) {
  const router = useRouter();
  const sp = useSearchParams();

  const handleSort = () => {
    const params = new URLSearchParams(sp.toString());
    const nextSort: SortKey = currentSort === 'tc_desc' ? 'tc_asc' : 'tc_desc';
    params.set('sort', nextSort);
    params.set('page', '1');
    router.push(`/salaries?${params.toString()}`, { scroll: false });
  };

  return (
    <th
      onClick={handleSort}
      className="px-4 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wide cursor-pointer hover:text-[#222222] select-none"
    >
      Total Comp{' '}
      <span className="text-[#FF5A5F]">
        {currentSort === 'tc_asc' ? '↑' : '↓'}
      </span>
    </th>
  );
}
