import Link from 'next/link';
import { Zap, Mail, Phone } from 'lucide-react';

import prisma from '@/lib/prisma';

export default async function Footer() {
  let settingsRecords = [];
  try {
    settingsRecords = await prisma.globalSetting.findMany({
      where: { key: { in: ['contact', 'footer'] } }
    });
  } catch (err) {
    console.warn('[Footer] database fetch failed, using fallback defaults.');
  }

  const settings = {};
  settingsRecords.forEach(rec => {
    settings[rec.key] = rec.value || {};
  });

  const email = settings.contact?.email || 'alviaatif@hotmail.com';
  const phone1 = settings.contact?.phone1 || '0322 5131504';
  const phone2 = settings.contact?.phone2 || '0332 8271005';
  const tagline = settings.footer?.tagline || 'The leading advisory platform for electric vehicle infrastructure in Pakistan. We provide end-to-end consultancy for feasibility, licensing, and implementation.';
  const copyright = settings.footer?.copyright || 'EVConsults';

  return (
    <footer style={{ backgroundColor: '#020813', color: '#ffffff', paddingTop: '3rem', paddingBottom: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">

        {/* Main Footer Grid */}
        <div className="footer-main-grid">
          
          {/* Column 1: Brand */}
          <div className="footer-brand">
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.6rem', fontWeight: '700', marginBottom: '1.25rem', color: 'white', textDecoration: 'none' }}>
              <Zap style={{ color: 'var(--color-secondary)' }} size={32} />
              EVConsults
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              {tagline}
            </p>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: '600', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link href="/about" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.3s', textDecoration: 'none' }}>About Us</Link>
              <Link href="/services" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.3s', textDecoration: 'none' }}>Services</Link>
              <Link href="/industries" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.3s', textDecoration: 'none' }}>Industries</Link>
              <Link href="/blog" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.3s', textDecoration: 'none' }}>Insights</Link>
            </div>
          </div>

          {/* Column 3: Expertise */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: '600', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Expertise</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link href="/licensing" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.3s', textDecoration: 'none' }}>Licensing</Link>
              <Link href="/services" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.3s', textDecoration: 'none' }}>Feasibility</Link>
              <Link href="/services" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.3s', textDecoration: 'none' }}>Financials</Link>
              <Link href="/contact" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.3s', textDecoration: 'none' }}>Consultation</Link>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: '600', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(0, 174, 239, 0.1)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(0, 174, 239, 0.2)', flexShrink: 0 }}>
                  <Mail size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <span style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Email Support</span>
                  <a href={`mailto:${email}`} style={{ color: 'white', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.3s', textDecoration: 'none', wordBreak: 'break-all' }}>{email}</a>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(57, 211, 83, 0.1)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(57, 211, 83, 0.2)', flexShrink: 0 }}>
                  <Phone size={18} style={{ color: 'var(--color-secondary)' }} />
                </div>
                <div>
                  <span style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Call for Consultation</span>
                  <a href={`tel:${phone1.replace(/\s+/g, '')}`} style={{ display: 'block', color: 'white', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.3s', marginBottom: '0.4rem', textDecoration: 'none' }}>{phone1}</a>
                  <a href={`tel:${phone2.replace(/\s+/g, '')}`} style={{ display: 'block', color: 'white', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.3s', textDecoration: 'none' }}>{phone2}</a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="footer-copyright-row" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', marginTop: '1rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: 0 }}>&copy; {new Date().getFullYear()} {copyright}. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', transition: 'color 0.3s', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', transition: 'color 0.3s', textDecoration: 'none' }}>Terms &amp; Conditions</Link>
          </div>
        </div>

      </div>

      <style>{`
        .footer-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        @media (min-width: 640px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
        }
        @media (min-width: 992px) {
          .footer-main-grid {
            grid-template-columns: 2fr 1fr 1fr 2fr;
          }
          .footer-brand {
            grid-column: auto;
          }
        }
        .footer-main-grid a:hover {
          color: rgba(255,255,255,0.9) !important;
        }
      `}</style>
    </footer>
  );
}
