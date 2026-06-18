import type { Metadata } from 'next';
import { Suspense } from 'react';
import CompareClient from './CompareClient';

export const metadata: Metadata = {
  title: 'Compare Offers & Companies',
  description: 'Side-by-side compensation comparison. Compare two salary records to decide which offer pays more.',
  alternates: { canonical: '/compare' },
};

export default function ComparePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-[36px] font-bold text-[#222222] leading-[1.1]">Compare Offers</h1>
        <p className="text-[#484848] mt-2">Select two salary records for a side-by-side breakdown.</p>
      </div>
      <Suspense fallback={<div className="h-96 bg-white rounded-xl border border-[#EBEBEB] animate-pulse" />}>
        <CompareClient />
      </Suspense>
    </div>
  );
}
