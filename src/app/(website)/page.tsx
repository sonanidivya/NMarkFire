import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { TrustedBy } from '@/components/home/TrustedBy';
import { CoreSolutions } from '@/components/home/CoreSolutions';
import { ProcessSteps } from '@/components/home/ProcessSteps';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';

import { Testimonials } from '@/components/home/Testimonials';
import { CTA } from '@/components/home/CTA';

import { client } from '@/sanity/lib/client';
import { SHOWCASED_CATEGORIES_QUERY, MAIN_CATEGORIES_NAV_QUERY, HOME_PAGE_QUERY } from '@/sanity/lib/queries';

export default async function Home() {
  const [showcasedCategories, navCategories, homePageData] = await Promise.all([
    client.fetch(SHOWCASED_CATEGORIES_QUERY, {}, { next: { revalidate: 0 } }),
    client.fetch(MAIN_CATEGORIES_NAV_QUERY, {}, { next: { revalidate: 0 } }),
    client.fetch(HOME_PAGE_QUERY, {}, { next: { revalidate: 0 } })
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-red-500/20">
      <Navbar categories={navCategories} />
      <Hero 
        heading={homePageData?.heroHeading}
        subheading={homePageData?.heroSubheading}
        animatedWords={homePageData?.heroAnimatedWords}
      />
      <TrustedBy />
      <CoreSolutions 
        categories={showcasedCategories} 
        title={homePageData?.featuredTitle}
        description={homePageData?.showcaseDescription}
      />

      <ProcessSteps />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
    </div>
  );
}
