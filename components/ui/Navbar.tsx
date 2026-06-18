import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-[#EBEBEB] sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#FF5A5F] font-bold text-xl tracking-tight">Talent<span className="text-[#222222]">Dash</span></span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-[#484848]">
          <Link href="/salaries" className="hover:text-[#FF5A5F] transition-colors">Salaries</Link>
          <Link href="/companies/google" className="hover:text-[#FF5A5F] transition-colors">Companies</Link>
          <Link href="/compare" className="hover:text-[#FF5A5F] transition-colors">Compare</Link>
        </div>
      </nav>
    </header>
  );
}
