'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPageWithSections, updateSectionContent, updatePageSeo } from '@/lib/actions/pages';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  Save, 
  ChevronRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle,
  Loader
} from 'lucide-react';

export default function PageSectionEditor({ params }) {
  const pageSlug = params.pageSlug;
  const router = useRouter();

  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('seo'); // 'seo' or section key
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Active form data states
  const [seoForm, setSeoForm] = useState({ title: '', seoTitle: '', seoDesc: '' });
  const [sectionContent, setSectionContent] = useState(null);

  // Fetch page and sections
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPageWithSections(pageSlug);
        if (!data) {
          setSaveError('Page not found');
          setLoading(false);
          return;
        }
        setPage(data);
        setSections(data.sections || []);
        setSeoForm({
          title: data.title || '',
          seoTitle: data.seoTitle || '',
          seoDesc: data.seoDesc || '',
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setSaveError('Failed to load page data');
        setLoading(false);
      }
    }
    loadData();
  }, [pageSlug]);

  // Set initial content when active tab changes
  useEffect(() => {
    if (activeTab === 'seo') {
      setSectionContent(null);
    } else {
      const activeSec = sections.find(s => s.key === activeTab);
      if (activeSec) {
        // Deep copy JSON content
        setSectionContent(JSON.parse(JSON.stringify(activeSec.content)));
      } else {
        setSectionContent(null);
      }
    }
    setSaveSuccess(false);
    setSaveError(null);
  }, [activeTab, sections]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 70px)'
      }}>
        <Loader size={36} style={{ color: '#00AEEF', animation: 'spin 1s linear infinite' }} />
        <span style={{ marginTop: '1rem', color: '#555555', fontSize: '0.95rem' }}>Loading page content...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const handleSeoChange = (e) => {
    const { name, value } = e.target;
    setSeoForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSeo = async () => {
    setSaveLoading(true);
    setSaveSuccess(false);
    setSaveError(null);

    const res = await updatePageSeo(pageSlug, seoForm);
    setSaveLoading(false);
    if (res.error) {
      setSaveError(res.error);
    } else {
      setSaveSuccess(true);
      // Update page state
      setPage(prev => ({ ...prev, ...seoForm }));
    }
  };

  const handleSaveSection = async () => {
    setSaveLoading(true);
    setSaveSuccess(false);
    setSaveError(null);

    const res = await updateSectionContent(pageSlug, activeTab, sectionContent);
    setSaveLoading(false);
    if (res.error) {
      setSaveError(res.error);
    } else {
      setSaveSuccess(true);
      // Update active section cache in sections state
      setSections(prev => prev.map(s => {
        if (s.key === activeTab) {
          return { ...s, content: JSON.parse(JSON.stringify(sectionContent)) };
        }
        return s;
      }));
    }
  };

  // Helper functions to edit sectionContent state
  const updateField = (key, value) => {
    setSectionContent(prev => {
      if (typeof prev === 'object' && prev !== null && !Array.isArray(prev)) {
        return { ...prev, [key]: value };
      }
      return value; // For array-only sections like hero_slides
    });
  };

  const updateArrayItem = (arrayKey, index, fieldKey, value) => {
    setSectionContent(prev => {
      const arr = Array.isArray(prev) ? [...prev] : [...prev[arrayKey]];
      if (fieldKey === null) {
        arr[index] = value; // simple string array
      } else {
        arr[index] = { ...arr[index], [fieldKey]: value };
      }

      if (Array.isArray(prev)) {
        return arr;
      } else {
        return { ...prev, [arrayKey]: arr };
      }
    });
  };

  const addArrayItem = (arrayKey, defaultObj = '') => {
    setSectionContent(prev => {
      if (Array.isArray(prev)) {
        return [...prev, defaultObj];
      } else {
        const arr = [...(prev[arrayKey] || [])];
        return { ...prev, [arrayKey]: [...arr, defaultObj] };
      }
    });
  };

  const removeArrayItem = (arrayKey, index) => {
    setSectionContent(prev => {
      if (Array.isArray(prev)) {
        return prev.filter((_, i) => i !== index);
      } else {
        const arr = prev[arrayKey].filter((_, i) => i !== index);
        return { ...prev, [arrayKey]: arr };
      }
    });
  };

  // Humanize section keys
  const humanizeKey = (key) => {
    return key
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <>
      <AdminHeader title={`Edit Page: ${page?.title || ''}`} />

      {/* Breadcrumb / Action Bar */}
      <div style={{
        padding: '1rem 2rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #EEF1F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={() => router.push('/admin/pages')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            border: 'none',
            background: 'none',
            color: '#555555',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Back to pages
        </button>

        <button
          onClick={activeTab === 'seo' ? handleSaveSeo : handleSaveSection}
          disabled={saveLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '8px',
            backgroundColor: '#39D353',
            color: '#0B1F33',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            cursor: saveLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => { if (!saveLoading) e.target.style.backgroundColor = '#2ebc46'; }}
          onMouseLeave={(e) => { if (!saveLoading) e.target.style.backgroundColor = '#39D353'; }}
        >
          {saveLoading ? (
            <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Save size={16} />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Editor Content Area */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        backgroundColor: '#F5F7FA'
      }}>
        {/* Section Tabs */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRight: '1px solid #EEF1F5',
          padding: '1.5rem 0'
        }}>
          <span style={{
            display: 'block',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '0 1.5rem',
            marginBottom: '0.75rem'
          }}>
            Page Configuration
          </span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button
              onClick={() => setActiveTab('seo')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1.5rem',
                border: 'none',
                backgroundColor: activeTab === 'seo' ? 'rgba(0, 174, 239, 0.08)' : 'transparent',
                color: activeTab === 'seo' ? '#00AEEF' : '#0B1F33',
                fontWeight: activeTab === 'seo' ? 700 : 500,
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              <span>Page SEO & Metadata</span>
              <ChevronRight size={14} style={{ opacity: activeTab === 'seo' ? 1 : 0 }} />
            </button>
          </div>

          <span style={{
            display: 'block',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '0 1.5rem',
            margin: '1.5rem 0 0.75rem 0'
          }}>
            Content Sections
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            {sections.map((sec) => (
              <button
                key={sec.key}
                onClick={() => setActiveTab(sec.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  backgroundColor: activeTab === sec.key ? 'rgba(0, 174, 239, 0.08)' : 'transparent',
                  color: activeTab === sec.key ? '#00AEEF' : '#0B1F33',
                  fontWeight: activeTab === sec.key ? 700 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                <span>{humanizeKey(sec.key)}</span>
                <ChevronRight size={14} style={{ opacity: activeTab === sec.key ? 1 : 0 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Form */}
        <div style={{ padding: '2rem 3rem', overflowY: 'auto', maxHeight: 'calc(100vh - 190px)' }}>
          {/* Notifications */}
          {saveSuccess && (
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
              fontWeight: 600,
              marginBottom: '1.5rem'
            }}>
              <Check size={18} />
              <span>Changes saved successfully! Page content has been revalidated.</span>
            </div>
          )}

          {saveError && (
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
              fontWeight: 600,
              marginBottom: '1.5rem'
            }}>
              <AlertCircle size={18} />
              <span>Error: {saveError}</span>
            </div>
          )}

          {/* Form Renderers */}
          {activeTab === 'seo' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #EEF1F5' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>SEO Settings</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B1F33' }}>Page Header Title</label>
                <input
                  type="text"
                  name="title"
                  value={seoForm.title}
                  onChange={handleSeoChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B1F33' }}>Meta Title (SEO)</label>
                <input
                  type="text"
                  name="seoTitle"
                  value={seoForm.seoTitle}
                  onChange={handleSeoChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B1F33' }}>Meta Description (SEO)</label>
                <textarea
                  name="seoDesc"
                  value={seoForm.seoDesc}
                  onChange={handleSeoChange}
                  rows={4}
                  style={textareaStyle}
                />
              </div>
            </div>
          ) : (
            sectionContent && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #EEF1F5', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                    Editing: {humanizeKey(activeTab)}
                  </h3>

                  {/* Render Fields Dynamically */}
                  {renderFields(sectionContent, updateField, updateArrayItem, addArrayItem, removeArrayItem)}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

// Styling Constants
const inputStyle = {
  padding: '0.75rem 1rem',
  border: '1px solid #E2E8F0',
  borderRadius: '8px',
  fontSize: '0.95rem',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box'
};

const textareaStyle = {
  padding: '0.75rem 1rem',
  border: '1px solid #E2E8F0',
  borderRadius: '8px',
  fontSize: '0.95rem',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  resize: 'vertical',
  boxSizing: 'border-box'
};

// Dynamic Field Renderer based on JSON Structure
function renderFields(content, updateField, updateArrayItem, addArrayItem, removeArrayItem) {
  // If content is pure array (like hero_slides or services_list)
  if (Array.isArray(content)) {
    return renderArray(null, content, updateArrayItem, addArrayItem, removeArrayItem);
  }

  // If content is an object
  return Object.keys(content).map((key) => {
    const value = content[key];

    // 1. Array field
    if (Array.isArray(value)) {
      return (
        <div key={key} style={{ borderTop: '1px solid #EEF1F5', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0B1F33', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '1rem' }}>
            {key.split('_').join(' ')}
          </label>
          {renderArray(key, value, updateArrayItem, addArrayItem, removeArrayItem)}
        </div>
      );
    }

    // 2. Object field (nesting - not used in our seed schema, but handled just in case)
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} style={{ border: '1px solid #EEF1F5', padding: '1rem', borderRadius: '8px' }}>
          <span style={{ fontWeight: 600 }}>{key}</span>
          {/* Shallow render keys */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
            {Object.keys(value).map(subKey => (
              <div key={subKey} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>{subKey}</label>
                <input
                  type="text"
                  value={value[subKey] || ''}
                  onChange={(e) => {
                    const newObj = { ...value, [subKey]: e.target.value };
                    updateField(key, newObj);
                  }}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 3. String / primitive field
    const isLongText = key === 'description' || key === 'subtitle' || key === 'text' || key === 'desc' || key === 'tagline';
    return (
      <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B1F33' }}>
          {key.charAt(0).toUpperCase() + key.slice(1).split('_').join(' ')}
        </label>
        {isLongText ? (
          <textarea
            value={value || ''}
            onChange={(e) => updateField(key, e.target.value)}
            rows={3}
            style={textareaStyle}
          />
        ) : (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => updateField(key, e.target.value)}
            style={inputStyle}
          />
        )}
      </div>
    );
  });
}

// Render Array of items (strings or objects)
function renderArray(arrayKey, arr, updateArrayItem, addArrayItem, removeArrayItem) {
  const isObjectArray = arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {arr.map((item, index) => {
        if (isObjectArray) {
          // Render item edit panel
          return (
            <div key={index} style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '1.25rem',
              position: 'relative'
            }}>
              <button
                type="button"
                onClick={() => removeArrayItem(arrayKey, index)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  border: 'none',
                  background: 'none',
                  color: '#EF4444',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={16} />
              </button>

              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '0.75rem' }}>
                ITEM #{index + 1}
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '1.5rem' }}>
                {Object.keys(item).map((itemFieldKey) => {
                  const val = item[itemFieldKey];
                  const label = itemFieldKey.charAt(0).toUpperCase() + itemFieldKey.slice(1).split('_').join(' ');
                  const isTextArea = itemFieldKey === 'text' || itemFieldKey === 'desc' || itemFieldKey === 'paragraphs' || itemFieldKey === 'sub';

                  // If nested list, e.g. points in services_list
                  if (Array.isArray(val)) {
                    return (
                      <div key={itemFieldKey} style={{ borderLeft: '2px solid #E2E8F0', paddingLeft: '1rem', margin: '0.5rem 0' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B1F33', display: 'block', marginBottom: '0.5rem' }}>
                          Bullet Points / Sub-items
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {val.map((subVal, subIndex) => (
                            <div key={subIndex} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <input
                                type="text"
                                value={subVal || ''}
                                onChange={(e) => {
                                  const newPoints = [...val];
                                  newPoints[subIndex] = e.target.value;
                                  updateArrayItem(arrayKey, index, itemFieldKey, newPoints);
                                }}
                                style={inputStyle}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newPoints = val.filter((_, si) => si !== subIndex);
                                  updateArrayItem(arrayKey, index, itemFieldKey, newPoints);
                                }}
                                style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newPoints = [...val, ''];
                              updateArrayItem(arrayKey, index, itemFieldKey, newPoints);
                            }}
                            style={{
                              alignSelf: 'start',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              border: 'none',
                              background: 'none',
                              color: '#00AEEF',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              marginTop: '0.25rem'
                            }}
                          >
                            <Plus size={12} /> Add Point
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={itemFieldKey} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B1F33' }}>{label}</label>
                      {isTextArea ? (
                        <textarea
                          value={val || ''}
                          onChange={(e) => updateArrayItem(arrayKey, index, itemFieldKey, e.target.value)}
                          rows={2}
                          style={textareaStyle}
                        />
                      ) : (
                        <input
                          type="text"
                          value={val || ''}
                          onChange={(e) => updateArrayItem(arrayKey, index, itemFieldKey, e.target.value)}
                          style={inputStyle}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        } else {
          // Render simple string item
          return (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                value={item}
                onChange={(e) => updateArrayItem(arrayKey, index, null, e.target.value)}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => removeArrayItem(arrayKey, index)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#EF4444',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        }
      })}

      <button
        type="button"
        onClick={() => {
          if (isObjectArray) {
            // Get keys of the first item to construct a blank object template
            const template = {};
            Object.keys(arr[0]).forEach((k) => {
              template[k] = Array.isArray(arr[0][k]) ? [] : '';
            });
            addArrayItem(arrayKey, template);
          } else {
            addArrayItem(arrayKey, '');
          }
        }}
        style={{
          alignSelf: 'start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: '1px solid #E2E8F0',
          backgroundColor: '#ffffff',
          color: '#0B1F33',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        <Plus size={14} /> Add New Item
      </button>
    </div>
  );
}
