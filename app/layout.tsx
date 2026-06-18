import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: { default: "TalentDash — India's Career Intelligence Platform", template: '%s | TalentDash' },
  description: "Structured, comparable, decision-ready salary data for India's tech professionals. Level-based compensation data like levels.fyi for India.",
  metadataBase: new URL('https://talentdash.vercel.app'),
  openGraph: {
    siteName: 'TalentDash',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
