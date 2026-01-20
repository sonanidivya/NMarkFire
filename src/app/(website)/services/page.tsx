
import { Navbar } from '@/components/layout/Navbar';
import { ServicesContent } from './ServicesContent';
import { client } from '@/sanity/lib/client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fire Safety Services & AMC | NMarkFire',
  description: 'Expert installation, auditing, and maintenance services for industrial fire safety. ISO 9001:2015 certified operations.',
};

import { MAIN_CATEGORIES_NAV_QUERY } from '@/sanity/lib/queries';

export default async function ServicesPage() {
  const navCategories = await client.fetch(MAIN_CATEGORIES_NAV_QUERY);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar categories={navCategories} />
      <ServicesContent />
    </div>
  );
}