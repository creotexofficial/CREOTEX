import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import {
  FileText,
  UploadCloud,
  Trash2,
  Plus,
  X,
  FileCode
} from 'lucide-react';

export const AdminDatasheets = () => {
  const { datasheets, addDatasheet, deleteDatasheet } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Motors',
    format: 'PDF',
    size: '2.5 MB',
    sku: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    addDatasheet(formData);
    setIsModalOpen(false);
    setFormData({ title: '', category: 'Motors', format: 'PDF', size: '2.5 MB', sku: '' });
  };

  return (
    <div className="admin-page-content">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} strokeWidth={2} style={{ color: 'var(--primary)' }} />
              Technical Datasheets &amp; CAD Repositories
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Pinouts, 3D STEP Models, Arduino Code &amp; User Manuals published for makers
            </div>
          </div>

          <button className="admin-action-pill-btn primary" onClick={() => setIsModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} strokeWidth={2.5} />
            Upload Datasheet
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Category</th>
                <th>Format / Size</th>
                <th>Linked SKU</th>
                <th>Total Downloads</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasheets.map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileCode size={16} strokeWidth={1.8} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <span>{d.title}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{d.category}</span>
                  </td>
                  <td>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.75rem',
                      background: 'var(--bg-input)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)'
                    }}>
                      {d.format} • {d.size}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--primary)' }}>
                      {d.sku || 'Universal'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '700', color: '#22C55E' }}>{d.downloads.toLocaleString()}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.lastUpdated}</span>
                  </td>
                  <td>
                    <button
                      className="btn-table-icon danger"
                      title="Delete Datasheet"
                      onClick={() => {
                        if (window.confirm(`Delete datasheet "${d.title}"?`)) {
                          deleteDatasheet(d.id);
                        }
                      }}
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Datasheet Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-box" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={18} strokeWidth={2} style={{ color: 'var(--primary)' }} />
                Publish Technical Resource
              </h3>
              <button className="btn-table-icon" onClick={() => setIsModalOpen(false)} aria-label="Close">
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-body">
              <div className="admin-form-grid">
                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Resource Title *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    required
                    placeholder="e.g. Cytron MDD10A Arduino Sample Code &amp; Schematic"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Category *</label>
                  <select
                    className="admin-select"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Motors">Motors</option>
                    <option value="Motor Drivers">Motor Drivers</option>
                    <option value="Sensors">Sensors</option>
                    <option value="Kits & Guides">Kits &amp; Guides</option>
                    <option value="Chassis & Frame">Chassis &amp; Frame</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">File Format &amp; Size</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. PDF (3.2 MB)"
                    value={`${formData.format} (${formData.size})`}
                    onChange={e => setFormData({ ...formData, format: e.target.value })}
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Associated Product SKU</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. CTX-DRV-CYT10A"
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer" style={{ margin: '24px -24px -24px', padding: '16px 24px' }}>
                <button type="button" className="admin-action-pill-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-action-pill-btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <UploadCloud size={15} strokeWidth={2.2} />
                  Save &amp; Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
