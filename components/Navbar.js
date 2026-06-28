"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Licensing', path: '/licensing' },
    { name: 'Industries', path: '/industries' },
    { name: 'Blog', path: '/blog' }
  ];

  return (
    <header className="header" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="container nav-container">
        <Link href="/" className="logo">
          <Zap className="logo-icon" size={28} />
          <span style={{ fontFamily: 'var(--font-poppins)' }}>EVConsults</span>
        </Link>
        
        <nav className="nav-links">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name} 
                href={item.path} 
                className="nav-link"
                style={{
                  position: 'relative',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                  padding: '0.5rem 0',
                  transition: 'color 0.2s ease'
                }}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: 'var(--color-accent)',
                      borderRadius: '3px'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <Link href="/contact" className="btn btn-primary" style={{ marginLeft: '1.5rem', boxShadow: '0 4px 14px 0 rgba(57, 211, 83, 0.39)' }}>
            Contact Us
          </Link>
        </nav>
        
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ 
              position: 'absolute', top: '100%', left: 0, right: 0, 
              backgroundColor: 'white', padding: '1.5rem', 
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              borderTop: '1px solid #E2E8F0'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navItems.map((item) => {
                const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                return (
                  <Link 
                    key={item.name} 
                    href={item.path} 
                    onClick={() => setIsOpen(false)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isActive ? 'rgba(0, 174, 239, 0.1)' : 'transparent',
                      color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                      fontWeight: isActive ? '600' : '500',
                      display: 'block'
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Link href="/contact" className="btn btn-primary" style={{ textAlign: 'center', marginTop: '1rem' }} onClick={() => setIsOpen(false)}>Contact Us</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
