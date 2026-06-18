'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SalaryRecord, Level, Currency } from '@/types';
import { formatSalary } from '@/lib/format';
import { PAGE_SIZE } from '@/lib/constants';
import LevelBadge from '@/components/ui/LevelBadge';
import Pagination from '@/components/ui/Pagination';

const ALL_LEVELS: Level[] = ['L3','L4','L5','L6','SDE-I','SDE-II','SDE-III','Staff','Principal','IC4','IC5'];
const ALL_ROLES = ['Software Engineer','Software Development Engineer','Product Manager','Data Scientist','Data Analyst','ML Engineer','Machine Learning Engineer','Staff Engineer','Principal Engineer','Lead Engineer','Senior Engineer','Senior Software Engineer'];
const ALL_LOCATIONS = ['Bengaluru','Mumbai','Hyderabad','Pune','Delhi','San Francisco','London','Remote'];

type SortKey = 'tc_desc' | 'tc_asc' | 'date_desc';

interface Props {
  records: SalaryRecord[];
}

export default function SalaryTable({ records }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [company, setCompany] = useState(searchParams.get('company') ?? '');
  const [role, setRole] = useState(searchParams.get('role') ?? '');
  const [levels, setLevels] = useState<Level[]>(() => {
    const l = searchParams.get('level');
    return l ? (l.split(',') as Level[]) : [];
  });
  const [location, setLocation] = useState(searchParams.get('location') ?? '');
  const [currency, setCurrency] = useState<Currency>((searchParams.get('currency') as Currency) ?? 'INR');
  const [sort, setSort] = useState<SortKey>((searchParams.get('sort') as SortKey) ?? 'tc_desc');
  const [page, setPage] = useState(Number(searchParams.get('page') ?? 1));
  const [companyInput, setCompanyInput] = useState(company);

  // debounce company search
  useEffect(() => {
    const t = setTimeout(() => {
      setCompany(companyInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [companyInput]);

  const updateURL = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v); else params.delete(k);
    });
    router.replace(`/salaries?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const filtered = useMemo(() => {
    let data = [...records];
    if (company) data = data.filter(r => r.company.toLowerCase().includes(company.toLowerCase()) || r.company_slug.includes(company.toLowerCase()));
    if (role) data = data.filter(r => r.role.toLowerCase().includes(role.toLowerCase()));
    if (levels.length > 0) data = data.filter(r => levels.includes(r.level_standardized));
    if (location) data = data.filter(r => r.location.toLowerCase().includes(location.toLowerCase()));
    if (sort === 'tc_desc') data.sort((a, b) => b.total_compensation - a.total_compensation);
    else if (sort === 'tc_asc') data.sort((a, b) => a.total_compensation - b.total_compensation);
    else data.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
    return data;
  }, [records, company, role, levels, location, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleLevel = (lvl: Level) => {
    const next = levels.includes(lvl) ? levels.filter(l => l !== lvl) : [...levels, lvl];
    setLevels(next);
    setPage(1);
    updateURL({ level: next.join(','), page: '1' });
  };

  const handleSort = (key: SortKey) => {
    setSort(key);
    setPage(1);
    updateURL({ sort: key, page: '1' });
  };

  const clearAll = () => {
    setCompanyInput(''); setCompany(''); setRole(''); setLevels([]); setLocation('');
    setSort('tc_desc'); setPage(1);
    router.replace('/salaries', { scroll: false });
  };

  const SortHeader = ({ label, sortKey }: { label: string; sortKey?: SortKey }) => (
    <th
      className={`px-4 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wide ${sortKey ? 'cursor-pointer hover:text-[#222222] select-none' : ''}`}
      onClick={() => sortKey && handleSort(sortKey === sort ? (sort === 'tc_desc' ? 'tc_asc' : 'tc_desc') : sortKey)}
    >
      {label}
      {sortKey && sort.startsWith('tc') && (
        <span className="ml-1 text-[#FF5A5F]">{sort === 'tc_desc' ? '↓' : '↑'}</span>
      )}
    </th>
  );

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-white border border-[#EBEBEB] rounded-xl p-4 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search company..."
            value={companyInput}
            onChange={e => setCompanyInput(e.target.value)}
            className="px-3 py-2 border border-[#EBEBEB] rounded-lg text-sm text-[#222222] placeholder-[#717171] focus:outline-none focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]"
          />
          <select
            value={role}
            onChange={e => { setRole(e.target.value); setPage(1); updateURL({ role: e.target.value, page: '1' }); }}
            className="px-3 py-2 border border-[#EBEBEB] rounded-lg text-sm text-[#222222] focus:outline-none focus:border-[#FF5A5F] bg-white"
          >
            <option value="">All Roles</option>
            {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            value={location}
            onChange={e => { setLocation(e.target.value); setPage(1); updateURL({ location: e.target.value, page: '1' }); }}
            className="px-3 py-2 border border-[#EBEBEB] rounded-lg text-sm text-[#222222] focus:outline-none focus:border-[#FF5A5F] bg-white"
          >
            <option value="">All Locations</option>
            {ALL_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <div className="flex border border-[#EBEBEB] rounded-lg overflow-hidden text-sm">
            {(['INR','USD'] as Currency[]).map(c => (
              <button
                key={c}
                onClick={() => { setCurrency(c); updateURL({ currency: c }); }}
                className={`flex-1 py-2 font-medium transition-colors ${currency === c ? 'bg-[#FF5A5F] text-white' : 'bg-white text-[#484848] hover:bg-[#F2F2F2]'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Level checkboxes */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-[#717171] font-medium self-center mr-1">Level:</span>
          {ALL_LEVELS.map(lvl => (
            <button
              key={lvl}
              onClick={() => toggleLevel(lvl)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${levels.includes(lvl) ? 'bg-[#FF5A5F] text-white border-[#FF5A5F]' : 'bg-white text-[#484848] border-[#EBEBEB] hover:border-[#FF5A5F]'}`}
            >
              {lvl}
            </button>
          ))}
          {(company || role || levels.length > 0 || location) && (
            <button onClick={clearAll} className="px-2.5 py-1 rounded-md text-xs font-medium text-[#FF5A5F] border border-[#FF5A5F] hover:bg-red-50 transition-colors ml-auto">
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#EBEBEB] rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#484848] text-base mb-2">No records found for these filters.</p>
            <button onClick={clearAll} className="text-sm text-[#FF5A5F] hover:underline">Try removing a filter</button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F7F7F7] border-b border-[#EBEBEB]">
                  <tr>
                    <SortHeader label="Company" />
                    <SortHeader label="Role" />
                    <SortHeader label="Level" />
                    <SortHeader label="Location" />
                    <SortHeader label="Exp (yrs)" />
                    <SortHeader label="Base Salary" />
                    <SortHeader label="Stock" />
                    <SortHeader label="Total Comp" sortKey="tc_desc" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBEB]">
                  {paginated.map(r => (
                    <tr key={r.id} className="hover:bg-[#F2F2F2] transition-colors">
                      <td className="px-4 py-3">
                        <a href={`/companies/${r.company_slug}`} className="font-medium text-[#222222] hover:text-[#FF5A5F] capitalize transition-colors truncate block max-w-[140px]">
                          {r.company_slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </a>
                        {!r.is_verified && <span className="text-[10px] text-[#717171]">Unverified</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#484848] max-w-[180px]">
                        <span className="truncate block">{r.role}</span>
                      </td>
                      <td className="px-4 py-3"><LevelBadge level={r.level_standardized} /></td>
                      <td className="px-4 py-3 text-sm text-[#484848]">{r.location}</td>
                      <td className="px-4 py-3 text-sm text-[#484848]">{r.experience_years}y</td>
                      <td className="px-4 py-3 text-sm text-[#484848]">
                        {formatSalary(r.base_salary, r.currency, currency)}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#484848]">
                        {r.stock === 0 ? '—' : formatSalary(r.stock, r.currency, currency)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[#0369A1] font-bold text-base">
                          {formatSalary(r.total_compensation, r.currency, currency)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={safePage}
              totalPages={totalPages}
              total={filtered.length}
              limit={PAGE_SIZE}
              onPage={p => { setPage(p); updateURL({ page: String(p) }); }}
            />
          </>
        )}
      </div>
    </div>
  );
}
