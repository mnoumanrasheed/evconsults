import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Script from 'next/script';
import { getGlobalSettings } from '@/lib/actions/settings';
import LayoutWrapper from '@/components/LayoutWrapper';

export const revalidate = 0;

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const DEFAULT_BASE = 'https://www.evconsults.pk';

const KEYWORDS = [
  'EV charging station Pakistan',
  'EV charging station consultant Pakistan',
  'NEPRA EV license Pakistan',
  'electric vehicle charging business Pakistan',
  'EV charging station feasibility study Pakistan',
  'how to start EV charging station in Pakistan',
  'EV charger installation Pakistan',
  'EV charging station investment Pakistan',
  'EV charging station license requirements Pakistan',
  'EV charging consultant Karachi',
  'EV charging consultant Lahore',
  'EV charging consultant Islamabad',
  'EV charging station setup cost Pakistan',
  'EV business plan Pakistan',
  'DISCO coordination EV Pakistan',
  'AC DC charger Pakistan',
  'electric vehicle infrastructure Pakistan',
  'EV charging station for petrol pumps Pakistan',
  'EV charging station for shopping malls Pakistan',
  'EV charging station for housing societies Pakistan',
  'Pakistan electric vehicle policy',
  'EV charging ROI Pakistan',
  'EVConsults',
  'evconsults.pk',
];

function formatPhoneForSchema(phone) {
  if (!phone) return '+92-322-5131504';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('92')) return `+${digits.slice(0, 2)}-${digits.slice(2)}`;
  if (digits.startsWith('0')) return `+92-${digits.slice(1)}`;
  return phone;
}

function buildJsonLd({ seo, contact, social }) {
  const BASE = seo?.baseUrl || DEFAULT_BASE;
  const sameAs = Object.values(social || {}).filter((url) => typeof url === 'string' && url.trim());

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: 'EVConsults',
        url: BASE,
        logo: { '@type': 'ImageObject', url: `${BASE}/logo.png` },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: formatPhoneForSchema(contact?.phone1),
            contactType: 'customer service',
            availableLanguage: ['English', 'Urdu'],
          },
          {
            '@type': 'ContactPoint',
            telephone: formatPhoneForSchema(contact?.phone2),
            contactType: 'sales',
            availableLanguage: ['English', 'Urdu'],
          },
        ],
        email: contact?.email || 'alviaatif@hotmail.com',
        areaServed: 'PK',
        description:
          seo?.siteDescription ||
          "Pakistan's leading EV charging station consultancy providing feasibility studies, NEPRA licensing, technical design, and financial modelling.",
        sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        url: BASE,
        name: 'EVConsults Pakistan',
        publisher: { '@id': `${BASE}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/blog?search={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${BASE}/#localbusiness`,
        name: 'EVConsults',
        image: `${BASE}/ev_charging_hero.png`,
        url: BASE,
        telephone: formatPhoneForSchema(contact?.phone1),
        email: contact?.email || 'alviaatif@hotmail.com',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'PK',
          addressLocality: contact?.address || 'Pakistan',
        },
        priceRange: '$$',
        openingHours: 'Mo-Sa 09:00-18:00',
        serviceArea: { '@type': 'Country', name: 'Pakistan' },
      },
      {
        '@type': 'Service',
        name: 'EV Charging Station Consultancy Pakistan',
        provider: { '@id': `${BASE}/#organization` },
        serviceType: 'EV Infrastructure Advisory',
        areaServed: 'Pakistan',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'EV Consultancy Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Feasibility Study' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'NEPRA Licensing Support' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Technical Design Review' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'DISCO Coordination' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Financial Modelling & ROI Analysis' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Charger & Vendor Selection' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Site Assessment' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commissioning Support' } },
          ],
        },
      },
    ],
  };
}

export async function generateMetadata() {
  const settings = await getGlobalSettings(['seo']);
  const seo = settings.seo || {};
  const BASE = seo.baseUrl || DEFAULT_BASE;

  return {
    metadataBase: new URL(BASE),
    title: {
      default: seo.siteTitle || 'EV Charging Station Consultant Pakistan | EVConsults',
      template: '%s | EVConsults Pakistan',
    },
    description:
      seo.siteDescription ||
      "EVConsults is Pakistan's leading EV charging station consultancy. We provide feasibility studies, NEPRA licensing support, technical design, DISCO coordination, financial modelling, charger selection, and commissioning — across Karachi, Lahore, Islamabad, and all major cities.",
    keywords: KEYWORDS,
    authors: [{ name: 'EVConsults', url: BASE }],
    creator: 'EVConsults',
    publisher: 'EVConsults',
    category: 'Energy Consultancy',
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    alternates: {
      canonical: BASE,
    },
    openGraph: {
      type: 'website',
      locale: 'en_PK',
      url: BASE,
      siteName: 'EVConsults Pakistan',
      title: seo.siteTitle || 'EV Charging Station Consultant Pakistan | EVConsults',
      description:
        seo.siteDescription ||
        "Pakistan's #1 EV charging station advisory — feasibility, NEPRA licensing, technical design, and financial modelling for EV infrastructure investors.",
      images: [
        {
          url: `${BASE}/ev_charging_hero.png`,
          width: 1200,
          height: 630,
          alt: 'EV Charging Station Consultant Pakistan - EVConsults',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.siteTitle || 'EV Charging Station Consultant Pakistan | EVConsults',
      description:
        seo.siteDescription ||
        'End-to-end EV charging station consultancy in Pakistan — licensing, feasibility, technical design, and ROI analysis.',
      images: [`${BASE}/ev_charging_hero.png`],
    },
    verification: {
      google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    },
    icons: {
      icon: '/logo.png',
      shortcut: '/logo.png',
      apple: '/logo.png',
    },
  };
}

export default async function RootLayout({ children }) {
  const settings = await getGlobalSettings(['contact', 'seo', 'social']);
  const jsonLd = buildJsonLd(settings);

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={inter.className}>
        <LayoutWrapper
          navbar={<Navbar />}
          footer={<Footer />}
          whatsapp={<WhatsAppFloat settings={settings.contact || {}} />}
        >
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
