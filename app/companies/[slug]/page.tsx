import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SALARY_RECORDS, COMPANY_META, getUniqueCompanySlugs, getRecordsByCompany } from '@/lib/mock-data';
import { formatSalary, computeMedian } from '@/lib/format';
import LevelBadge from '@/components/ui/LevelBadge';
import { Level } from '@/types';

export function generateStaticParams() {
  return getUniqueCompanySlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = COMPANY_META[slug];
  if (!meta) return {};
  return {
    title: `Software Engineer Salaries at ${meta.name} India — L3 to Principal`,
    description: `Salary data, level distribution, and compensation insights for ${meta.name} in India. Explore L3 to Principal level pay at ${meta.name}.`,
    openGraph: {
      title: `${meta.name} Salaries — TalentDash`,
      description: `Level-based compensation data for ${meta.name} engineers in India.`,
      url: `/companies/${slug}`,
    },
    alternates: { canonical: `/companies/${slug}` },
  };
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = COMPANY_META[slug];
  if (!meta) notFound();

  const records = getRecordsByCompany(slug).sort((a, b) => b.total_compensation - a.total_compensation);
  const tcValues = records.map(r => r.total_compensation);
  const medianTC = computeMedian(tcValues);
  const minTC = Math.min(...tcValues);
  const maxTC = Math.max(...tcValues);

  // Level distribution
  const levelCounts: Record<string, number> = {};
  records.forEach(r => {
    levelCounts[r.level_standardized] = (levelCounts[r.level_standardized] ?? 0) + 1;
  });
  const totalRecords = records.length;
  const levels = Object.entries(levelCounts).sort((a, b) => b[1] - a[1]);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: meta.name,
      url: `https://talentdash.vercel.app/companies/${slug}`,
      foundingDate: meta.founded_year,
      numberOfEmployees: { '@type': 'QuantitativeValue', value: meta.headcount_range },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: `${meta.name} Salary Data — TalentDash`,
      description: `Level-based compensation records for ${meta.name} engineers in India`,
      url: `https://talentdash.vercel.app/companies/${slug}`,
      creator: { '@type': 'Organization', name: 'TalentDash' },
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-[36px] font-bold text-[#222222]">{meta.name}</h1>
                <span className="px-2.5 py-1 bg-[#F7F7F7] border border-[#EBEBEB] rounded-md text-sm text-[#484848] font-medium">{meta.industry}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[#717171]">
                {meta.founded_year && <span>Founded {meta.founded_year}</span>}
                <span>{meta.headcount_range} employees</span>
                <span>HQ: {meta.headquarters}</span>
              </div>
            </div>
            <Link
              href={`/compare?c1=${slug}`}
              className="px-4 py-2 bg-[#FF5A5F] text-white rounded-lg text-sm font-medium hover:bg-[#e04e53] transition-colors whitespace-nowrap"
            >
              Compare Companies
            </Link>
          </div>
        </div>

        {/* Comp overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 text-center">
            <p className="text-xs text-[#717171] font-medium uppercase tracking-wide mb-1">Median Total Comp</p>
            <p className="text-[40px] font-bold text-[#0369A1]">{formatSalary(medianTC, 'INR', 'INR')}</p>
          </div>
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 text-center">
            <p className="text-xs text-[#717171] font-medium uppercase tracking-wide mb-1">TC Range</p>
            <p className="text-lg font-bold text-[#222222] mt-2">
              {formatSalary(minTC, 'INR', 'INR')} – {formatSalary(maxTC, 'INR', 'INR')}
            </p>
          </div>
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 text-center">
            <p className="text-xs text-[#717171] font-medium uppercase tracking-wide mb-1">Data Points</p>
            <p className="text-[40px] font-bold text-[#222222]">{totalRecords}</p>
          </div>
        </div>

        {/* Level distribution */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 mb-6">
          <h2 className="text-[22px] font-semibold text-[#222222] mb-4">Level Distribution</h2>
          <div className="space-y-2">
            {levels.map(([level, count]) => {
              const pct = Math.round((count / totalRecords) * 100);
              return (
                <div key={level} className="flex items-center gap-3">
                  <div className="w-20 flex-shrink-0">
                    <LevelBadge level={level as Level} />
                  </div>
                  <div className="flex-1 bg-[#F7F7F7] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-[#FF5A5F] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm text-[#717171] w-16 text-right">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Salary list */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EBEBEB]">
            <h2 className="text-[22px] font-semibold text-[#222222]">Salary Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F7F7]">
                <tr>
                  {['Role', 'Level', 'Location', 'Exp', 'Base', 'Stock', 'Total Comp'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#717171] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-[#F2F2F2] transition-colors">
                    <td className="px-4 py-3 text-sm text-[#484848]">
                      <span className="truncate block max-w-[200px]">{r.role}</span>
                      {!r.is_verified && <span className="text-[10px] text-[#717171]">Unverified</span>}
                    </td>
                    <td className="px-4 py-3"><LevelBadge level={r.level_standardized} /></td>
                    <td className="px-4 py-3 text-sm text-[#484848]">{r.location}</td>
                    <td className="px-4 py-3 text-sm text-[#484848]">{r.experience_years}y</td>
                    <td className="px-4 py-3 text-sm text-[#484848]">{formatSalary(r.base_salary, r.currency, 'INR')}</td>
                    <td className="px-4 py-3 text-sm text-[#484848]">{r.stock === 0 ? '—' : formatSalary(r.stock, r.currency, 'INR')}</td>
                    <td className="px-4 py-3">
                      <span className="text-[#0369A1] font-bold text-base">{formatSalary(r.total_compensation, r.currency, 'INR')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
