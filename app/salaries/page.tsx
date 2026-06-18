import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { SALARY_RECORDS } from '@/lib/mock-data';
import { formatSalary } from '@/lib/format';
import { PAGE_SIZE } from '@/lib/constants';
import { Level, Currency, SalaryRecord } from '@/types';
import LevelBadge from '@/components/ui/LevelBadge';
import SalaryFiltersClient from '@/components/features/SalaryFiltersClient';
import SortHeaderClient from '@/components/features/SortHeaderClient';
import PaginationClient from '@/components/features/PaginationClient';

export const metadata: Metadata = {
  title: 'Software Engineer Salaries in India — L3 to Principal',
  description:
    'Structured, level-based salary data for software engineers, product managers, and data scientists at top Indian and global tech companies.',
  openGraph: {
    title: 'Salary Data — TalentDash',
    description: "Level-based compensation data for India's top tech companies.",
    url: '/salaries',
  },
  alternates: { canonical: '/salaries' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'TalentDash India Salary Data',
  description: 'Structured, level-based salary records for tech professionals in India',
  url: 'https://talentdash.vercel.app/salaries',
  keywords: ['salary', 'compensation', 'India', 'tech', 'software engineer'],
  creator: { '@type': 'Organization', name: 'TalentDash' },
};

type SortKey = 'tc_desc' | 'tc_asc' | 'date_desc';

interface PageProps {
  searchParams: Promise<{
    company?: string;
    role?: string;
    level?: string;
    location?: string;
    currency?: string;
    sort?: string;
    page?: string;
  }>;
}

function filterAndSort(sp: Awaited<PageProps['searchParams']>): {
  records: SalaryRecord[];
  total: number;
  page: number;
  totalPages: number;
  currency: Currency;
  sort: SortKey;
} {
  const company = (sp.company ?? '').toLowerCase().trim();
  const role = (sp.role ?? '').toLowerCase().trim();
  const levels = (sp.level ?? '').split(',').filter(Boolean) as Level[];
  const location = (sp.location ?? '').toLowerCase().trim();
  const currency: Currency = (sp.currency as Currency) ?? 'INR';
  const sort: SortKey = (sp.sort as SortKey) ?? 'tc_desc';
  const page = Math.max(1, Number(sp.page ?? 1));

  let data = [...SALARY_RECORDS];

  if (company) {
    data = data.filter(
      r =>
        r.company.toLowerCase().includes(company) ||
        r.company_slug.toLowerCase().includes(company)
    );
  }
  if (role) {
    data = data.filter(r => r.role.toLowerCase().includes(role));
  }
  if (levels.length > 0) {
    data = data.filter(r => levels.includes(r.level_standardized));
  }
  if (location) {
    data = data.filter(r => r.location.toLowerCase().includes(location));
  }

  if (sort === 'tc_desc') data.sort((a, b) => b.total_compensation - a.total_compensation);
  else if (sort === 'tc_asc') data.sort((a, b) => a.total_compensation - b.total_compensation);
  else data.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const records = data.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return { records, total, page: safePage, totalPages, currency, sort };
}

// The table itself is a pure Server Component — ships zero client JS
function SalaryTableRows({
  records,
  currency,
}: {
  records: SalaryRecord[];
  currency: Currency;
}) {
  if (records.length === 0) return null;
  return (
    <tbody className="divide-y divide-[#EBEBEB]">
      {records.map(r => (
        <tr key={r.id} className="hover:bg-[#F2F2F2] transition-colors">
          {/* Company */}
          <td className="px-4 py-3">
            <Link
              href={`/companies/${r.company_slug}`}
              className="font-medium text-[#222222] hover:text-[#FF5A5F] transition-colors block max-w-[160px] truncate capitalize"
            >
              {r.company_slug
                .replace(/-/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase())}
            </Link>
            {!r.is_verified && (
              <span className="text-[10px] text-[#717171]">Unverified</span>
            )}
          </td>
          {/* Role */}
          <td className="px-4 py-3 text-sm text-[#484848]">
            <span className="block max-w-[200px] truncate" title={r.role}>
              {r.role}
            </span>
          </td>
          {/* Level */}
          <td className="px-4 py-3">
            <LevelBadge level={r.level_standardized} />
          </td>
          {/* Location */}
          <td className="px-4 py-3 text-sm text-[#484848]">{r.location}</td>
          {/* Experience */}
          <td className="px-4 py-3 text-sm text-[#484848]">{r.experience_years}y</td>
          {/* Base Salary */}
          <td className="px-4 py-3 text-sm text-[#484848]">
            {formatSalary(r.base_salary, r.currency, currency)}
          </td>
          {/* Stock */}
          <td className="px-4 py-3 text-sm text-[#484848]">
            {r.stock === 0 ? '—' : formatSalary(r.stock, r.currency, currency)}
          </td>
          {/* Total Comp — dominant number */}
          <td className="px-4 py-3">
            <span className="text-[#0369A1] font-bold text-base">
              {formatSalary(r.total_compensation, r.currency, currency)}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default async function SalariesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { records, total, page, totalPages, currency, sort } = filterAndSort(sp);

  const hasFilters = sp.company || sp.role || sp.level || sp.location;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-[36px] font-bold text-[#222222] leading-[1.1]">Salary Data</h1>
          <p className="text-[#484848] mt-2">
            {SALARY_RECORDS.length} records across{' '}
            {new Set(SALARY_RECORDS.map(r => r.company_slug)).size} companies. Filter by company,
            role, level, and location.
          </p>
        </div>

        {/* Client filters — only this ships JS */}
        <Suspense>
          <SalaryFiltersClient />
        </Suspense>

        {/* Server-rendered table — zero client JS */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl overflow-hidden">
          {total === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[#484848] text-base mb-2">
                No records found for these filters.
              </p>
              <Link
                href="/salaries"
                className="text-sm text-[#FF5A5F] hover:underline"
              >
                Try removing a filter
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F7F7F7] border-b border-[#EBEBEB]">
                    <tr>
                      {['Company', 'Role', 'Level', 'Location', 'Experience', 'Base Salary', 'Stock'].map(
                        h => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        )
                      )}
                      {/* Sort header is the only interactive header */}
                      <Suspense
                        fallback={
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wide">
                            Total Comp ↓
                          </th>
                        }
                      >
                        <SortHeaderClient currentSort={sort} />
                      </Suspense>
                    </tr>
                  </thead>

                  {/* Pure server component — no client JS */}
                  <SalaryTableRows records={records} currency={currency} />
                </table>
              </div>

              {/* Pagination client */}
              <Suspense>
                <PaginationClient
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  limit={PAGE_SIZE}
                />
              </Suspense>
            </>
          )}
        </div>

        {hasFilters && total > 0 && (
          <p className="text-xs text-[#717171] mt-3 text-right">
            Showing {Math.min(total, PAGE_SIZE)} of {total} filtered records
          </p>
        )}
      </div>
    </>
  );
}
