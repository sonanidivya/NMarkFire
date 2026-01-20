
import { Navbar } from '@/components/layout/Navbar';
import { ContactContent } from './ContactContent';
import { client } from '@/sanity/lib/client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact NMarkFire | Get a Quote',
    description: 'Contact our fire safety experts for audits, quotes, and support. 24/7 pan-India service network.',
};

import { MAIN_CATEGORIES_NAV_QUERY } from '@/sanity/lib/queries';

export default async function ContactPage() {
  const navCategories = await client.fetch(MAIN_CATEGORIES_NAV_QUERY);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar categories={navCategories} />
      <ContactContent />
    </div>
  );
}
