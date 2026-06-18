import Link from 'next/link';
import { SALARY_RECORDS, COMPANY_META } from '@/lib/mock-data';
import { formatSalary } from '@/lib/format';

export const revalidate = 3600;

export default function HomePage() {
  const topRecords = [...SALARY_RECORDS]
    .sort((a, b) => b.total_compensation - a.total_compensation)
    .slice(0, 6);

  const companies = Object.values(COMPANY_META).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-[36px] font-bold text-[#222222] leading-[1.1] mb-4">
          Know Your Worth.<br />
          <span className="text-[#FF5A5F]">India's Career Intelligence Platform.</span>
        </h1>
        <p className="text-[#484848] text-lg max-w-2xl mx-auto mb-8">
          Structured, level-based compensation data for India's tech and business professionals.
          Make decisions with facts, not guesses.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/salaries"
            className="px-6 py-3 bg-[#FF5A5F] text-white rounded-lg font-medium hover:bg-[#e04e53] transition-colors"
          >
            Explore Salaries
          </Link>
          <Link
            href="/compare"
            className="px-6 py-3 border border-[#EBEBEB] bg-white text-[#222222] rounded-lg font-medium hover:bg-[#F2F2F2] transition-colors"
          >
            Compare Offers
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4 mb-12">
        {[
          { label: 'Salary Records', value: SALARY_RECORDS.length + '+' },
          { label: 'Companies', value: Object.keys(COMPANY_META).length + '+' },
          { label: 'Cities Covered', value: '10+' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#EBEBEB] rounded-xl p-6 text-center">
            <div className="text-[32px] font-bold text-[#FF5A5F]">{s.value}</div>
            <div className="text-sm text-[#717171] font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Top Compensations */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[28px] font-bold text-[#222222]">Top Compensation Records</h2>
          <Link href="/salaries" className="text-sm text-[#FF5A5F] hover:underline font-medium">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topRecords.map(r => (
            <div key={r.id} className="bg-white border border-[#EBEBEB] rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-[#222222] capitalize">
                    {r.company_slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </p>
                  <p className="text-sm text-[#717171]">{r.role}</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">{r.level_standardized}</span>
              </div>
              <p className="text-[32px] font-bold text-[#0369A1]">
                {formatSalary(r.total_compensation, r.currency, 'INR')}
              </p>
              <p className="text-xs text-[#717171] mt-1">{r.location} · {r.experience_years}y exp</p>
            </div>
          ))}
        </div>
      </section>

      {/* Companies */}
      <section>
        <h2 className="text-[28px] font-bold text-[#222222] mb-4">Browse Companies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {companies.map(c => (
            <Link
              key={c.slug}
              href={`/companies/${c.slug}`}
              className="bg-white border border-[#EBEBEB] rounded-xl p-4 hover:border-[#FF5A5F] hover:shadow-sm transition-all"
            >
              <p className="font-semibold text-[#222222]">{c.name}</p>
              <p className="text-xs text-[#717171] mt-0.5">{c.industry}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
