'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SALARY_RECORDS, COMPANY_META } from '@/lib/mock-data';
import { formatSalary } from '@/lib/format';
import { SalaryRecord } from '@/types';
import LevelBadge from '@/components/ui/LevelBadge';

function DeltaCell({ value, currency }: { value: number; currency: string }) {
  if (value === 0) return <span className="text-[#717171]">—</span>;
  const label = formatSalary(Math.abs(value), currency, 'INR');
  return value > 0 ? (
    <span className="font-semibold text-[#008A05]">+{label}</span>
  ) : (
    <span className="font-semibold text-[#D93025]">-{label}</span>
  );
}

function recordLabel(r: SalaryRecord) {
  const name = COMPANY_META[r.company_slug]?.name ?? r.company_slug;
  return `${name} · ${r.role} · ${r.level_standardized} · ${r.location}`;
}

export default function CompareClient() {
  const router = useRouter();
  const sp = useSearchParams();

  // s1/s2 = salary record IDs (primary)
  // c1 = company slug pre-fill (from company page "Compare" button)
  const c1Slug = sp.get('c1');
  const initialS1 = sp.get('s1') ?? '';
  const initialS2 = sp.get('s2') ?? '';

  // If c1 slug provided, pre-select first record from that company
  const [s1, setS1] = useState(() => {
    if (initialS1) return initialS1;
    if (c1Slug) {
      const first = SALARY_RECORDS.find(r => r.company_slug === c1Slug);
      return first?.id ?? '';
    }
    return '';
  });
  const [s2, setS2] = useState(initialS2);

  // Sync URL when s1/s2 change
  useEffect(() => {
    const params = new URLSearchParams();
    if (s1) params.set('s1', s1);
    if (s2) params.set('s2', s2);
    router.replace(`/compare?${params.toString()}`, { scroll: false });
  }, [s1, s2, router]);

  const record1 = SALARY_RECORDS.find(r => r.id === s1);
  const record2 = SALARY_RECORDS.find(r => r.id === s2);

  const delta =
    record1 && record2
      ? {
          base: record1.base_salary - record2.base_salary,
          bonus: record1.bonus - record2.bonus,
          stock: record1.stock - record2.stock,
          tc: record1.total_compensation - record2.total_compensation,
          exp: record1.experience_years - record2.experience_years,
        }
      : null;

  const winner = delta ? (delta.tc > 0 ? 1 : delta.tc < 0 ? 2 : 0) : 0;

  type DeltaKey = 'base' | 'bonus' | 'stock' | 'tc' | 'exp';

  const rows: Array<{
    label: string;
    renderA: (r: SalaryRecord) => React.ReactNode;
    renderB: (r: SalaryRecord) => React.ReactNode;
    deltaKey: DeltaKey | null;
  }> = [
    {
      label: 'Company',
      renderA: r => (
        <span className="font-medium capitalize">
          {COMPANY_META[r.company_slug]?.name ?? r.company_slug}
        </span>
      ),
      renderB: r => (
        <span className="font-medium capitalize">
          {COMPANY_META[r.company_slug]?.name ?? r.company_slug}
        </span>
      ),
      deltaKey: null,
    },
    {
      label: 'Role',
      renderA: r => r.role,
      renderB: r => r.role,
      deltaKey: null,
    },
    {
      label: 'Level',
      renderA: r => <LevelBadge level={r.level_standardized} />,
      renderB: r => <LevelBadge level={r.level_standardized} />,
      deltaKey: null,
    },
    {
      label: 'Location',
      renderA: r => r.location,
      renderB: r => r.location,
      deltaKey: null,
    },
    {
      label: 'Experience',
      renderA: r => `${r.experience_years} years`,
      renderB: r => `${r.experience_years} years`,
      deltaKey: 'exp',
    },
    {
      label: 'Base Salary',
      renderA: r => (
        <span className="font-medium">{formatSalary(r.base_salary, r.currency, 'INR')}</span>
      ),
      renderB: r => (
        <span className="font-medium">{formatSalary(r.base_salary, r.currency, 'INR')}</span>
      ),
      deltaKey: 'base',
    },
    {
      label: 'Bonus',
      renderA: r => (r.bonus === 0 ? '—' : formatSalary(r.bonus, r.currency, 'INR')),
      renderB: r => (r.bonus === 0 ? '—' : formatSalary(r.bonus, r.currency, 'INR')),
      deltaKey: 'bonus',
    },
    {
      label: 'Stock / ESOP',
      renderA: r => (r.stock === 0 ? '—' : formatSalary(r.stock, r.currency, 'INR')),
      renderB: r => (r.stock === 0 ? '—' : formatSalary(r.stock, r.currency, 'INR')),
      deltaKey: 'stock',
    },
    {
      label: 'Total Comp',
      renderA: r => (
        <span className="text-[#0369A1] font-bold text-base">
          {formatSalary(r.total_compensation, r.currency, 'INR')}
        </span>
      ),
      renderB: r => (
        <span className="text-[#0369A1] font-bold text-base">
          {formatSalary(r.total_compensation, r.currency, 'INR')}
        </span>
      ),
      deltaKey: 'tc',
    },
  ];

  return (
    <div>
      {/* Record selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {(
          [
            { val: s1, set: setS1, label: 'Offer A' },
            { val: s2, set: setS2, label: 'Offer B' },
          ] as const
        ).map(({ val, set, label }) => (
          <div key={label}>
            <label className="block text-sm font-medium text-[#484848] mb-1.5">{label}</label>
            <select
              value={val}
              onChange={e => set(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#EBEBEB] rounded-lg text-sm text-[#222222] focus:outline-none focus:border-[#FF5A5F] bg-white"
            >
              <option value="">Select a record...</option>
              {SALARY_RECORDS.map(r => (
                <option key={r.id} value={r.id}>
                  {recordLabel(r)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      {record1 && record2 ? (
        <div className="bg-white border border-[#EBEBEB] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F7F7] border-b border-[#EBEBEB]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#717171] uppercase w-32">
                    Field
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#717171] uppercase">
                    Offer A
                    {winner === 1 && (
                      <span className="ml-2 px-2 py-0.5 bg-[#0369A1] text-white rounded text-[10px] font-medium">
                        Higher TC
                      </span>
                    )}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#717171] uppercase">
                    Offer B
                    {winner === 2 && (
                      <span className="ml-2 px-2 py-0.5 bg-[#0369A1] text-white rounded text-[10px] font-medium">
                        Higher TC
                      </span>
                    )}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#717171] uppercase">
                    Delta (A − B)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {rows.map(row => (
                  <tr key={row.label} className="hover:bg-[#F2F2F2]">
                    <td className="px-4 py-3 text-sm font-medium text-[#484848]">{row.label}</td>
                    <td className="px-4 py-3 text-sm text-[#222222]">{row.renderA(record1)}</td>
                    <td className="px-4 py-3 text-sm text-[#222222]">{row.renderB(record2)}</td>
                    <td className="px-4 py-3 text-sm">
                      {row.deltaKey && delta ? (
                        <DeltaCell
                          value={delta[row.deltaKey] as number}
                          currency={record1.currency}
                        />
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#EBEBEB] rounded-xl py-20 text-center">
          <p className="text-[#484848]">Select two records above to see the comparison.</p>
          <p className="text-sm text-[#717171] mt-1">
            The delta column shows A − B. Green = Offer A pays more. Red = Offer B pays more.
          </p>
        </div>
      )}
    </div>
  );
}
