export type Level =
  | 'L3' | 'L4' | 'L5' | 'L6'
  | 'SDE-I' | 'SDE-II' | 'SDE-III'
  | 'Staff' | 'Principal' | 'IC4' | 'IC5';

export type Currency = 'INR' | 'USD' | 'GBP' | 'EUR';

export type Source = 'CONTRIBUTOR' | 'SCRAPED' | 'AI_INFERRED';

export interface SalaryRecord {
  id: string;
  company: string;
  company_slug: string;
  role: string;
  level_standardized: Level;
  location: string;
  currency: Currency;
  experience_years: number;
  base_salary: number;
  bonus: number;
  stock: number;
  total_compensation: number;
  source: Source;
  confidence_score: number;
  submitted_at: string;
  is_verified: boolean;
}

export interface CompanyMeta {
  slug: string;
  name: string;
  industry: string;
  founded_year: number | null;
  headcount_range: string;
  headquarters: string;
}

export interface SalaryFilters {
  company: string;
  role: string;
  levels: Level[];
  location: string;
  currency: Currency;
  sort: 'tc_desc' | 'tc_asc' | 'date_desc';
  page: number;
}
