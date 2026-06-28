'use client';
import { useState } from 'react';
import { updateContactStatus, deleteContactRequest } from '@/lib/actions/contact';
import DeleteModal from '@/components/admin/DeleteModal';
import { 
  Inbox, 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  X,
  AlertCircle,
  Mail,
  Phone,
  Building,
  MapPin
} from 'lucide-react';

export default function ContactRequestsClient({ initialRequests }) {
  const [requests, setRequests] = useState(initialRequests || []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Selection/Detail drawer
  const [selectedReq, setSelectedReq] = useState(null);
  
  // Deletion modal
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.name.toLowerCase().includes(search.toLowerCase()) || 
      (req.company && req.company.toLowerCase().includes(search.toLowerCase())) ||
      req.city.toLowerCase().includes(search.toLowerCase()) ||
      req.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateContactStatus(id, newStatus);
      if (res.error) {
        setError(res.error);
      } else {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        if (selectedReq?.id === id) {
          setSelectedReq(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update status.');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    setError(null);

    try {
      const res = await deleteContactRequest(deleteId);
      if (res.error) {
        setError(res.error);
      } else {
        setRequests(prev => prev.filter(r => r.id !== deleteId));
        if (selectedReq?.id === deleteId) {
          setSelectedReq(null);
        }
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete contact request.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '500px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8'
            }} />
            <input
              type="text"
              placeholder="Search by name, company, email or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.6rem 1rem',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '0.9rem',
              backgroundColor: '#ffffff',
              outline: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="READ">Read</option>
            <option value="RESPONDED">Responded</option>
          </select>
        </div>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: '#EF4444',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: list + sidebar details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedReq ? '1fr 380px' : '1fr',
        gap: '1.5rem',
        alignItems: 'start',
        transition: 'grid-template-columns 0.3s ease'
      }}>
        
        {/* Table list */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #EEF1F5',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          {filteredRequests.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#555555'
            }}>
              <Inbox size={40} style={{ color: '#E2E8F0', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B1F33', margin: '0 0 0.25rem 0' }}>No requests</h3>
              <p style={{ fontSize: '0.85rem', color: '#555555', margin: 0 }}>No contact requests match your search filters.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
                textAlign: 'left'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #EEF1F5' }}>
                    <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600 }}>Contact Info</th>
                    <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600 }}>Location</th>
                    <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600 }}>Site / Load</th>
                    <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600 }}>Date</th>
                    <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => {
                    const isSelected = selectedReq?.id === req.id;
                    return (
                      <tr key={req.id} style={{
                        borderBottom: '1px solid #EEF1F5',
                        backgroundColor: isSelected ? 'rgba(0, 174, 239, 0.04)' : 'transparent',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <td style={{ padding: '1rem 1.5rem', color: '#0B1F33' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{ fontWeight: 600 }}>{req.name}</span>
                            <span style={{ fontSize: '0.8rem', color: '#555555' }}>{req.company || 'Private Investor'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: '#555555' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span>{req.city}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{req.phone}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: '#555555' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{ fontWeight: 500 }}>{req.siteType}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{req.load || 'Load unstated'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{
                            padding: '0.15rem 0.5rem',
                            borderRadius: '50px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.5px',
                            backgroundColor: req.status === 'NEW' ? 'rgba(57, 211, 83, 0.12)' : req.status === 'READ' ? 'rgba(0, 174, 239, 0.12)' : 'rgba(139, 92, 246, 0.12)',
                            color: req.status === 'NEW' ? '#39D353' : req.status === 'READ' ? '#00AEEF' : '#8B5CF6',
                          }}>
                            {req.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: '#94A3B8', fontSize: '0.82rem' }}>
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'end', gap: '0.5rem' }}>
                            <button
                              onClick={() => {
                                setSelectedReq(req);
                                if (req.status === 'NEW') {
                                  handleStatusChange(req.id, 'READ');
                                }
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                border: '1px solid #E2E8F0',
                                color: '#555555',
                                backgroundColor: '#ffffff',
                                cursor: 'pointer'
                              }}
                              title="View details"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(req.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                backgroundColor: '#EF4444',
                                color: '#ffffff',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                              title="Delete request"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar details Drawer */}
        {selectedReq && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #EEF1F5',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedReq(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                border: 'none',
                background: 'none',
                color: '#64748B',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0B1F33', margin: 0, paddingRight: '2rem' }}>
              Request Details
            </h3>

            {/* Status updates buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
              <button
                onClick={() => handleStatusChange(selectedReq.id, 'READ')}
                disabled={selectedReq.status === 'READ'}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  padding: '0.4rem 0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  backgroundColor: selectedReq.status === 'READ' ? '#00AEEF12' : '#ffffff',
                  color: selectedReq.status === 'READ' ? '#00AEEF' : '#555555',
                  cursor: 'pointer'
                }}
              >
                <Clock size={12} /> Mark Read
              </button>
              <button
                onClick={() => handleStatusChange(selectedReq.id, 'RESPONDED')}
                disabled={selectedReq.status === 'RESPONDED'}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  padding: '0.4rem 0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  backgroundColor: selectedReq.status === 'RESPONDED' ? '#8B5CF612' : '#ffffff',
                  color: selectedReq.status === 'RESPONDED' ? '#8B5CF6' : '#555555',
                  cursor: 'pointer'
                }}
              >
                <CheckCircle size={12} /> Responded
              </button>
            </div>

            {/* Profile Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Building size={16} style={{ color: '#94A3B8' }} />
                <div>
                  <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.72rem' }}>Company</span>
                  <span style={{ fontWeight: 600, color: '#0B1F33' }}>{selectedReq.company || 'Private Investor'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={16} style={{ color: '#94A3B8' }} />
                <div>
                  <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.72rem' }}>Email Address</span>
                  <a href={`mailto:${selectedReq.email}`} style={{ fontWeight: 600, color: '#00AEEF' }}>{selectedReq.email}</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={16} style={{ color: '#94A3B8' }} />
                <div>
                  <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.72rem' }}>Phone Number</span>
                  <a href={`tel:${selectedReq.phone}`} style={{ fontWeight: 600, color: '#0B1F33' }}>{selectedReq.phone}</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <MapPin size={16} style={{ color: '#94A3B8' }} />
                <div>
                  <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.72rem' }}>City</span>
                  <span style={{ fontWeight: 600, color: '#0B1F33' }}>{selectedReq.city}</span>
                </div>
              </div>
            </div>

            {/* Site detail */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              padding: '0.85rem',
              fontSize: '0.82rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Site Type</span>
                <span style={{ fontWeight: 600, color: '#0B1F33' }}>{selectedReq.siteType}</span>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Expected Electrical Load</span>
                <span style={{ fontWeight: 600, color: '#0B1F33' }}>{selectedReq.load || 'Not stated'}</span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.72rem', marginBottom: '0.35rem' }}>Message</span>
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1rem',
                fontSize: '0.88rem',
                color: '#0B1F33',
                lineHeight: 1.6,
                maxHeight: '200px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedReq.message}
              </div>
            </div>
            
            {/* Delete button */}
            <button
              onClick={() => handleDeleteClick(selectedReq.id)}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                borderRadius: '6px',
                backgroundColor: '#EF444412',
                color: '#EF4444',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}
            >
              <Trash2 size={14} /> Delete Request
            </button>

          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Contact Request"
        message="Are you sure you want to delete this contact request? This record will be permanently deleted from the database."
      />
    </div>
  );
}
