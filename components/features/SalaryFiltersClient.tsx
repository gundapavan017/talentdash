'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Level, Currency } from '@/types';

const ALL_LEVELS: Level[] = [
  'L3', 'L4', 'L5', 'L6',
  'SDE-I', 'SDE-II', 'SDE-III',
  'Staff', 'Principal', 'IC4', 'IC5',
];
const ALL_ROLES = [
  'Software Engineer', 'Software Development Engineer', 'Product Manager',
  'Data Scientist', 'Data Analyst', 'ML Engineer', 'Machine Learning Engineer',
  'Staff Engineer', 'Principal Engineer', 'Lead Engineer',
  'Senior Engineer', 'Senior Software Engineer',
];
const ALL_LOCATIONS = [
  'Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi',
  'San Francisco', 'London', 'Remote',
];

export default function SalaryFiltersClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const [companyInput, setCompanyInput] = useState(sp.get('company') ?? '');

  // Debounce company search → URL update
  useEffect(() => {
    const t = setTimeout(() => {
      push({ company: companyInput, page: '1' });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyInput]);

  const push = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(sp.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      router.push(`/salaries?${params.toString()}`, { scroll: false });
    },
    [router, sp]
  );

  const currentLevels = (sp.get('level') ?? '').split(',').filter(Boolean) as Level[];
  const currentCurrency = (sp.get('currency') as Currency) ?? 'INR';

  const toggleLevel = (lvl: Level) => {
    const next = currentLevels.includes(lvl)
      ? currentLevels.filter(l => l !== lvl)
      : [...currentLevels, lvl];
    push({ level: next.join(','), page: '1' });
  };

  const clearAll = () => {
    setCompanyInput('');
    router.push('/salaries', { scroll: false });
  };

  const hasFilters =
    companyInput ||
    sp.get('role') ||
    sp.get('level') ||
    sp.get('location');

  return (
    <div className="bg-white border border-[#EBEBEB] rounded-xl p-4 mb-6 space-y-4">
      {/* Row 1: text search, role, location, currency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Search company..."
          value={companyInput}
          onChange={e => setCompanyInput(e.target.value)}
          className="px-3 py-2 border border-[#EBEBEB] rounded-lg text-sm text-[#222222] placeholder-[#717171] focus:outline-none focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]"
        />
        <select
          value={sp.get('role') ?? ''}
          onChange={e => push({ role: e.target.value, page: '1' })}
          className="px-3 py-2 border border-[#EBEBEB] rounded-lg text-sm text-[#222222] focus:outline-none focus:border-[#FF5A5F] bg-white"
        >
          <option value="">All Roles</option>
          {ALL_ROLES.map(r => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={sp.get('location') ?? ''}
          onChange={e => push({ location: e.target.value, page: '1' })}
          className="px-3 py-2 border border-[#EBEBEB] rounded-lg text-sm text-[#222222] focus:outline-none focus:border-[#FF5A5F] bg-white"
        >
          <option value="">All Locations</option>
          {ALL_LOCATIONS.map(l => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        {/* Currency toggle */}
        <div className="flex border border-[#EBEBEB] rounded-lg overflow-hidden text-sm">
          {(['INR', 'USD'] as Currency[]).map(c => (
            <button
              key={c}
              onClick={() => push({ currency: c })}
              className={`flex-1 py-2 font-medium transition-colors ${
                currentCurrency === c
                  ? 'bg-[#FF5A5F] text-white'
                  : 'bg-white text-[#484848] hover:bg-[#F2F2F2]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: level multi-select checkboxes */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-[#717171] font-medium mr-1">Level:</span>
        {ALL_LEVELS.map(lvl => (
          <button
            key={lvl}
            onClick={() => toggleLevel(lvl)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              currentLevels.includes(lvl)
                ? 'bg-[#FF5A5F] text-white border-[#FF5A5F]'
                : 'bg-white text-[#484848] border-[#EBEBEB] hover:border-[#FF5A5F]'
            }`}
          >
            {lvl}
          </button>
        ))}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="px-2.5 py-1 rounded-md text-xs font-medium text-[#FF5A5F] border border-[#FF5A5F] hover:bg-red-50 transition-colors ml-auto"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
