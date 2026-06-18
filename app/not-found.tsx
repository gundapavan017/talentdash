import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <h1 className="text-[36px] font-bold text-[#222222] mb-4">404 — Page Not Found</h1>
      <p className="text-[#484848] mb-8">This company or page doesn&apos;t exist in our database yet.</p>
      <Link href="/salaries" className="px-6 py-3 bg-[#FF5A5F] text-white rounded-lg font-medium hover:bg-[#e04e53] transition-colors">
        Browse Salaries
      </Link>
    </div>
  );
}
