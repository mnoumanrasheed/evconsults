"use client";
import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, color: 'var(--color-primary)' }}>Chat with us</h4>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>Hello! How can we help you with your EV charging project?</p>
            
            <a 
              href="https://wa.me/923225131504" target="_blank" rel="noreferrer" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#25D366', color: 'white', padding: '0.75rem 1rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '500' }}
            >
              <MessageSquare size={20} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>Aatif Alvi</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Available for chat</span>
              </div>
            </a>
            
            <a 
              href="https://wa.me/923328271005" target="_blank" rel="noreferrer" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#128C7E', color: 'white', padding: '0.75rem 1rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '500' }}
            >
              <MessageSquare size={20} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>Naveed Ahmed</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Available for chat</span>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '3.5rem', height: '3.5rem', backgroundColor: '#25D366', color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(37, 211, 102, 0.4)' }}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>
    </div>
  );
}
