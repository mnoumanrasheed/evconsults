'use client';
import { useState } from 'react';
import { updateGlobalSetting } from '@/lib/actions/settings';
import AdminHeader from '@/components/admin/AdminHeader';
import { Save, Check, AlertCircle, Loader, Phone, Mail, Globe, Heart, Shield } from 'lucide-react';

export default function SettingsClient({ initialSettings }) {
  const [activeTab, setActiveTab] = useState('contact');
  const [settings, setSettings] = useState(initialSettings || {});
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const tabs = [
    { id: 'contact', name: 'Contact Details', icon: <Phone size={16} /> },
    { id: 'social', name: 'Social Links', icon: <Heart size={16} /> },
    { id: 'seo', name: 'SEO Defaults', icon: <Shield size={16} /> },
    { id: 'footer', name: 'Footer & Global', icon: <Globe size={16} /> }
  ];

  const handleFieldChange = (tabId, fieldKey, value) => {
    setSettings(prev => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        [fieldKey]: value
      }
    }));
    setSuccess(false);
    setError(null);
  };

  const handleSave = async (tabId) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await updateGlobalSetting(tabId, settings[tabId]);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem' }}>
      
      {/* Sidebar Tabs */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #EEF1F5',
        padding: '1.25rem 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.15rem',
        boxShadow: 'var(--shadow-sm)',
        height: 'fit-content'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSuccess(false);
              setError(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.25rem',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'rgba(0, 174, 239, 0.08)' : 'transparent',
              color: activeTab === tab.id ? '#00AEEF' : '#0B1F33',
              fontWeight: activeTab === tab.id ? 700 : 500,
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.88rem'
            }}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Settings Form Workspace */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {success && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(57, 211, 83, 0.08)',
            border: '1px solid rgba(57, 211, 83, 0.2)',
            borderRadius: '8px',
            padding: '0.75rem 1.25rem',
            color: '#39D353',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            <Check size={18} />
            <span>Settings saved successfully! Website footer and fields are updated.</span>
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            padding: '0.75rem 1.25rem',
            color: '#EF4444',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            <AlertCircle size={18} />
            <span>Error: {error}</span>
          </div>
        )}

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #EEF1F5',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #EEF1F5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B1F33', margin: 0 }}>
              {tabs.find(t => t.id === activeTab)?.name} Settings
            </h3>
            <button
              onClick={() => handleSave(activeTab)}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1rem',
                borderRadius: '6px',
                backgroundColor: '#39D353',
                color: '#0B1F33',
                fontWeight: 700,
                fontSize: '0.82rem',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => { if (!isLoading) e.target.style.backgroundColor = '#2ebc46'; }}
              onMouseLeave={(e) => { if (!isLoading) e.target.style.backgroundColor = '#39D353'; }}
            >
              {isLoading ? (
                <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Save size={14} />
              )}
              <span>Save Category</span>
            </button>
          </div>

          {/* Form Content */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {activeTab === 'contact' && (
              <>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Primary Contact Email</label>
                  <input
                    type="email"
                    value={settings.contact?.email || ''}
                    onChange={(e) => handleFieldChange('contact', 'email', e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Phone 1 (Aatif Alvi)</label>
                    <input
                      type="text"
                      value={settings.contact?.phone1 || ''}
                      onChange={(e) => handleFieldChange('contact', 'phone1', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Phone 2 (Naveed Ahmed)</label>
                    <input
                      type="text"
                      value={settings.contact?.phone2 || ''}
                      onChange={(e) => handleFieldChange('contact', 'phone2', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>WhatsApp 1 Number (w/ country code, e.g. 923225131504)</label>
                    <input
                      type="text"
                      value={settings.contact?.whatsapp1 || ''}
                      onChange={(e) => handleFieldChange('contact', 'whatsapp1', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>WhatsApp 2 Number</label>
                    <input
                      type="text"
                      value={settings.contact?.whatsapp2 || ''}
                      onChange={(e) => handleFieldChange('contact', 'whatsapp2', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Office / Contact Address</label>
                  <input
                    type="text"
                    value={settings.contact?.address || ''}
                    onChange={(e) => handleFieldChange('contact', 'address', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            {activeTab === 'social' && (
              <>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={settings.social?.linkedin || ''}
                    onChange={(e) => handleFieldChange('social', 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/..."
                    style={inputStyle}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Facebook Page URL</label>
                  <input
                    type="text"
                    value={settings.social?.facebook || ''}
                    onChange={(e) => handleFieldChange('social', 'facebook', e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Twitter / X URL</label>
                  <input
                    type="text"
                    value={settings.social?.twitter || ''}
                    onChange={(e) => handleFieldChange('social', 'twitter', e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Instagram Profile URL</label>
                  <input
                    type="text"
                    value={settings.social?.instagram || ''}
                    onChange={(e) => handleFieldChange('social', 'instagram', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            {activeTab === 'seo' && (
              <>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Default Site Title</label>
                  <input
                    type="text"
                    value={settings.seo?.siteTitle || ''}
                    onChange={(e) => handleFieldChange('seo', 'siteTitle', e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Default Site Description</label>
                  <textarea
                    value={settings.seo?.siteDescription || ''}
                    onChange={(e) => handleFieldChange('seo', 'siteDescription', e.target.value)}
                    rows={4}
                    style={textareaStyle}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Base Production URL (Canonical base)</label>
                  <input
                    type="text"
                    value={settings.seo?.baseUrl || ''}
                    onChange={(e) => handleFieldChange('seo', 'baseUrl', e.target.value)}
                    placeholder="https://www.evconsults.pk"
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            {activeTab === 'footer' && (
              <>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Footer Tagline / Brief Description</label>
                  <textarea
                    value={settings.footer?.tagline || ''}
                    onChange={(e) => handleFieldChange('footer', 'tagline', e.target.value)}
                    rows={3}
                    style={textareaStyle}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Copyright Label (e.g. EVConsults)</label>
                  <input
                    type="text"
                    value={settings.footer?.copyright || ''}
                    onChange={(e) => handleFieldChange('footer', 'copyright', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </>
            )}

          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Styling Constants
const inputStyle = {
  padding: '0.75rem 1rem',
  border: '1px solid #E2E8F0',
  borderRadius: '8px',
  fontSize: '0.92rem',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box'
};

const textareaStyle = {
  padding: '0.75rem 1rem',
  border: '1px solid #E2E8F0',
  borderRadius: '8px',
  fontSize: '0.92rem',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  resize: 'vertical',
  boxSizing: 'border-box'
};

const labelStyle = {
  fontSize: '0.82rem',
  fontWeight: 600,
  color: '#0B1F33',
  marginBottom: '0.35rem',
  display: 'block'
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column'
};
