import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Trash2, LogOut, LayoutDashboard, Send, Image as ImageIcon, Briefcase, User as UserIcon, Tag, Calendar, TrendingUp, Video, UploadCloud, Edit3, XCircle, ExternalLink } from 'lucide-react';
import './Admin.css';

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    client: '',
    category: 'SOCIAL MEDIA MANAGEMENT',
    mission_statement: '',
    description: '',
    image_url: '',
    portfolio_image_url: '',
    gallery_urls: [],
    video_url: '',
    instagram_url: '',
    tiktok_url: '',
    success_metrics: '',
    year: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingPortfolioThumb, setUploadingPortfolioThumb] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: '',
    text: '',
    is_featured: false,
    image_url: '',
    rating: 5
  });
  const [submittingTestimonial, setSubmittingTestimonial] = useState(false);
  const [uploadingTestimonialImg, setUploadingTestimonialImg] = useState(false);
  
  const navigate = useNavigate();

  const CATEGORIES = [
    "SOCIAL MEDIA MANAGEMENT",
    "WEBSITE DEVELOPMENT",
    "VIDEO PROFILE",
    "PHOTO & PRODUCT DESIGN"
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/login');
      else setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/login');
      else setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session) {
      fetchProjects();
      fetchTestimonials();
    }
  }, [session]);

  async function fetchProjects() {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  }

  async function fetchTestimonials() {
    setLoadingTestimonials(true);
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (data) setTestimonials(data);
    setLoadingTestimonials(false);
  }

  const handleFileUpload = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-media')
      .upload(filePath, file);

    if (uploadError) {
      alert(`Upload failed: ${uploadError.message}`);
      return null;
    }

    const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const onThumbnailDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target?.files[0];
    if (!file) return;

    setUploadingThumb(true);
    const url = await handleFileUpload(file);
    if (url) setNewProject(prev => ({ ...prev, image_url: url }));
    setUploadingThumb(false);
  };

  const onPortfolioThumbDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target?.files[0];
    if (!file) return;

    setUploadingPortfolioThumb(true);
    const url = await handleFileUpload(file);
    if (url) setNewProject(prev => ({ ...prev, portfolio_image_url: url }));
    setUploadingPortfolioThumb(false);
  };

  const onGalleryDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
    if (files.length === 0) return;

    setUploadingGallery(true);
    const urls = [];
    for (const file of files) {
      const url = await handleFileUpload(file);
      if (url) urls.push(url);
    }
    setNewProject(prev => ({ ...prev, gallery_urls: [...prev.gallery_urls, ...urls] }));
    setUploadingGallery(false);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleAddProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    let result;
    if (editingId) {
      result = await supabase.from('projects').update(newProject).eq('id', editingId);
    } else {
      result = await supabase.from('projects').insert([newProject]);
    }

    if (!result.error) {
      resetForm();
      fetchProjects();
    } else {
      alert(`Error saving project: ${result.error.message}`);
    }
    setSubmitting(false);
  };

  const resetForm = () => {
    setNewProject({ 
      title: '', client: '', category: 'SOCIAL MEDIA MANAGEMENT', mission_statement: '', description: '', 
      image_url: '', portfolio_image_url: '', gallery_urls: [], video_url: '', 
      instagram_url: '', tiktok_url: '', success_metrics: '', year: '' 
    });
    setEditingId(null);
  };

  const handleEdit = (project) => {
    setNewProject({
      title: project.title || '',
      client: project.client || '',
      category: project.category || 'SOCIAL MEDIA MANAGEMENT',
      mission_statement: project.mission_statement || '',
      description: project.description || '',
      image_url: project.image_url || '',
      portfolio_image_url: project.portfolio_image_url || '',
      gallery_urls: project.gallery_urls || [],
      video_url: project.video_url || '',
      instagram_url: project.instagram_url || '',
      tiktok_url: project.tiktok_url || '',
      success_metrics: project.success_metrics || '',
      year: project.year || ''
    });
    setEditingId(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('INITIATE_DELETE_SEQUENCE? This action is irreversible.')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) {
        if (editingId === id) resetForm();
        fetchProjects();
      }
    }
  };

  const handleTestimonialImgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingTestimonialImg(true);
    const url = await handleFileUpload(file);
    if (url) setNewTestimonial({ ...newTestimonial, image_url: url });
    setUploadingTestimonialImg(false);
  };

  const resetTestimonialForm = () => {
    setNewTestimonial({
      name: '',
      role: '',
      text: '',
      is_featured: false,
      image_url: '',
      rating: 5
    });
    setEditingTestimonialId(null);
  };

  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    setSubmittingTestimonial(true);
    
    if (editingTestimonialId) {
      const { error } = await supabase.from('testimonials').update(newTestimonial).eq('id', editingTestimonialId);
      if (!error) {
        resetTestimonialForm();
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase.from('testimonials').insert([newTestimonial]);
      if (!error) {
        resetTestimonialForm();
        fetchTestimonials();
      }
    }
    setSubmittingTestimonial(false);
  };

  const handleEditTestimonial = (testimonial) => {
    setNewTestimonial({
      name: testimonial.name,
      role: testimonial.role,
      text: testimonial.text,
      is_featured: testimonial.is_featured,
      image_url: testimonial.image_url || '',
      rating: testimonial.rating !== undefined ? testimonial.rating : 5
    });
    setEditingTestimonialId(testimonial.id);
  };

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm('DELETE_SIGNAL? This action is irreversible.')) {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (!error) {
        if (editingTestimonialId === id) resetTestimonialForm();
        fetchTestimonials();
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!session) return null;

  return (
    <div className="admin-portal">
      <nav className="admin-nav">
        <div className="container nav-flex">
          <div className="admin-logo">
            <LayoutDashboard size={20} className="text-primary" />
            <span>ORDAL / ADMIN_COMMAND_CENTER</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            LOG_OUT
          </button>
        </div>
      </nav>

      <main className="container admin-content">
        <div className="admin-grid">
          {/* FORM SECTION */}
          <section className="admin-section form-section">
            <div className="section-header">
              <div className="red-line-accent"></div>
              <h3>{editingId ? 'PROJECT_CALIBRATION' : 'PROJECT_FORGE'}</h3>
              <p>{editingId ? 'Adjusting project parameters for the archive.' : 'Forge new tactical transmissions for the archive.'}</p>
              {editingId && (
                <button className="cancel-edit-btn" onClick={resetForm}>
                  <XCircle size={14} /> CANCEL_CALIBRATION
                </button>
              )}
            </div>

            <form onSubmit={handleAddProject} className="tactical-form">
              <div className="form-row">
                <div className="admin-input-group">
                  <label><Tag size={12} /> PROJECT_TITLE</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Tactical Digital Ecosystem" 
                    value={newProject.title}
                    onChange={e => setNewProject({...newProject, title: e.target.value})}
                    required 
                  />
                </div>
                <div className="admin-input-group">
                  <label><Briefcase size={12} /> CATEGORY</label>
                  <div className="select-wrapper">
                    <select 
                      value={newProject.category}
                      onChange={e => setNewProject({...newProject, category: e.target.value})}
                      required
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {newProject.category === 'SOCIAL MEDIA MANAGEMENT' && (
                <div className="form-row social-row">
                  <div className="admin-input-group">
                    <label>INSTAGRAM_URL</label>
                    <input 
                      type="url" 
                      placeholder="https://instagram.com/..." 
                      value={newProject.instagram_url}
                      onChange={e => setNewProject({...newProject, instagram_url: e.target.value})}
                    />
                  </div>
                  <div className="admin-input-group">
                    <label>TIKTOK_URL</label>
                    <input 
                      type="url" 
                      placeholder="https://tiktok.com/..." 
                      value={newProject.tiktok_url}
                      onChange={e => setNewProject({...newProject, tiktok_url: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="admin-input-group">
                  <label><UserIcon size={12} /> CLIENT</label>
                  <input 
                    type="text" 
                    placeholder="Client name" 
                    value={newProject.client}
                    onChange={e => setNewProject({...newProject, client: e.target.value})}
                  />
                </div>
                <div className="admin-input-group">
                  <label><Calendar size={12} /> YEAR</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2024" 
                    value={newProject.year}
                    onChange={e => setNewProject({...newProject, year: e.target.value})}
                  />
                </div>
              </div>

              <div className="media-forge-container">
                <h4 className="forge-subtitle">MEDIA_PAYLOAD</h4>
                <div className="admin-input-group">
                  <label><ImageIcon size={12} /> PRIMARY_THUMBNAIL (Saran ukuran 3:4 - Tampilan Home)</label>
                  <div 
                    className="dropzone" 
                    onDrop={onThumbnailDrop} 
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById('thumb-upload').click()}
                  >
                    <input type="file" id="thumb-upload" hidden accept="image/*" onChange={onThumbnailDrop} />
                    {uploadingThumb ? (
                      <span className="upload-status">UPLOADING_DATA...</span>
                    ) : newProject.image_url ? (
                      <div className="dropzone-preview" style={{backgroundImage: `url(${newProject.image_url})`}}>
                        <div className="preview-overlay">REPLACE_THUMBNAIL</div>
                      </div>
                    ) : (
                      <div className="dropzone-empty">
                        <UploadCloud size={24} />
                        <p>DRAG_AND_DROP or CLICK to upload primary image</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="admin-input-group">
                  <label><ImageIcon size={12} /> PORTFOLIO_THUMBNAIL (Saran rasio landscape/persegi - Tampilan Portofolio)</label>
                  <div 
                    className="dropzone" 
                    onDrop={onPortfolioThumbDrop} 
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById('portfolio-thumb-upload').click()}
                  >
                    <input type="file" id="portfolio-thumb-upload" hidden accept="image/*" onChange={onPortfolioThumbDrop} />
                    {uploadingPortfolioThumb ? (
                      <span className="upload-status">UPLOADING_DATA...</span>
                    ) : newProject.portfolio_image_url ? (
                      <div className="dropzone-preview" style={{backgroundImage: `url(${newProject.portfolio_image_url})`}}>
                        <div className="preview-overlay">REPLACE_PORTFOLIO_THUMBNAIL</div>
                      </div>
                    ) : (
                      <div className="dropzone-empty">
                        <UploadCloud size={24} />
                        <p>DRAG_AND_DROP or CLICK to upload secondary image</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="admin-input-group">
                  <label><ImageIcon size={12} /> EXTENDED_GALLERY ({newProject.gallery_urls.length} files)</label>
                  <div 
                    className="dropzone gallery-dropzone" 
                    onDrop={onGalleryDrop} 
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById('gallery-upload').click()}
                  >
                    <input type="file" id="gallery-upload" hidden accept="image/*" multiple onChange={onGalleryDrop} />
                    {uploadingGallery ? (
                      <span className="upload-status">BATCH_UPLOADING...</span>
                    ) : (
                      <div className="dropzone-empty">
                        <UploadCloud size={24} />
                        <p>DRAG_AND_DROP multiple images for project gallery</p>
                      </div>
                    )}
                  </div>
                  {newProject.gallery_urls.length > 0 && (
                    <div className="gallery-previews">
                      {newProject.gallery_urls.map((url, idx) => (
                        <div key={idx} className="g-preview" style={{backgroundImage: `url(${url})`}}>
                          <button 
                            type="button" 
                            className="remove-g-item" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewProject(prev => ({...prev, gallery_urls: prev.gallery_urls.filter((_, i) => i !== idx)}));
                            }}
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {newProject.category !== 'PHOTO & PRODUCT DESIGN' && (
                  <div className="admin-input-group">
                    <label>
                      {newProject.category === 'WEBSITE DEVELOPMENT' ? <><ExternalLink size={12} /> WEBSITE_LINK (Optional)</> :
                       newProject.category === 'VIDEO PROFILE' ? <><Video size={12} /> YOUTUBE_LINK (Optional)</> :
                       <><Video size={12} /> VIDEO/REELS_URL (Optional)</>}
                    </label>
                    <input 
                      type="url" 
                      placeholder={
                        newProject.category === 'SOCIAL MEDIA MANAGEMENT' ? "Links Instagram Reels (pisahkan dengan koma)" : 
                        newProject.category === 'WEBSITE DEVELOPMENT' ? "https://yourwebsite.com" :
                        "https://youtube.com/..."
                      }
                      value={newProject.video_url}
                      onChange={e => setNewProject({...newProject, video_url: e.target.value})}
                    />
                    {newProject.category === 'SOCIAL MEDIA MANAGEMENT' && (
                      <small className="input-tip" style={{color: 'var(--primary)', fontSize: '0.7rem', marginTop: '0.5rem', display: 'block', opacity: 0.8}}>
                        Tip: Masukkan beberapa link Instagram Reels dipisahkan dengan koma untuk tampilan swipe.
                      </small>
                    )}
                  </div>
                )}
                {newProject.category === 'PHOTO & PRODUCT DESIGN' && (
                  <div className="admin-input-group">
                    <label><ExternalLink size={12} /> PDF_PREVIEW_LINK (Optional)</label>
                    <input 
                      type="url" 
                      placeholder="https://link-to-pdf..."
                      value={newProject.video_url}
                      onChange={e => setNewProject({...newProject, video_url: e.target.value})}
                    />
                    <small className="input-tip" style={{color: 'var(--primary)', fontSize: '0.7rem', marginTop: '0.5rem', display: 'block', opacity: 0.8}}>
                      Tip: Masukkan link Google Drive PDF atau link preview PDF lainnya.
                    </small>
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="admin-input-group">
                  <label>MISSION_STATEMENT (Teks Utama Besar)</label>
                  <textarea 
                    rows="3" 
                    placeholder="e.g. The image shows flowing shapes in iridescent hues..."
                    value={newProject.mission_statement}
                    onChange={e => setNewProject({...newProject, mission_statement: e.target.value})}
                  ></textarea>
                </div>
                <div className="admin-input-group">
                  <label>CHALLENGE / DETAILS (Penjelasan Lengkap)</label>
                  <textarea 
                    rows="5" 
                    placeholder="Describe the tactical objective, background, and approach..."
                    value={newProject.description}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                  ></textarea>
                </div>
              </div>

              {newProject.category === 'SOCIAL MEDIA MANAGEMENT' && (
                <div className="admin-input-group">
                  <label><TrendingUp size={12} /> SUCCESS_METRICS</label>
                  <input 
                    type="text" 
                    placeholder="e.g. +300% Engagement, 50K Impressions" 
                    value={newProject.success_metrics}
                    onChange={e => setNewProject({...newProject, success_metrics: e.target.value})}
                  />
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={submitting || uploadingThumb || uploadingGallery}>
                <Send size={18} />
                {submitting ? "PROCESSING..." : editingId ? "UPDATE_TRANSMISSION" : "DEPLOY_TO_ARCHIVE"}
              </button>
            </form>
          </section>

          {/* LIST SECTION */}
          <section className="admin-section list-section">
            <div className="section-header">
              <div className="red-line-accent"></div>
              <h3>ACTIVE_TRANSMISSIONS</h3>
              <p>Managing {projects.length} live archive entries.</p>
            </div>

            {loading ? (
              <div className="admin-loading">SCANNING_DATABASE...</div>
            ) : (
              <div className="project-list">
                {projects.map(project => (
                  <div key={project.id} className={`admin-project-card ${editingId === project.id ? 'editing' : ''}`}>
                    <div className="proj-img" style={{ backgroundImage: `url(${project.image_url})` }}></div>
                    <div className="proj-info">
                      <h4>{project.title}</h4>
                      <p>{project.client} // {project.category}</p>
                    </div>
                    <div className="admin-actions">
                      <button onClick={() => handleEdit(project)} className="edit-btn-action" title="CALIBRATE_ENTRY">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="delete-btn" title="DELETE_ENTRY">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* TESTIMONIALS SECTION */}
          <section className="admin-section form-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <div className="red-line-accent"></div>
              <h3>{editingTestimonialId ? 'CALIBRATE_SIGNAL' : 'FEEDBACK / SIGNAL_LOGS'}</h3>
              <p>{editingTestimonialId ? 'Adjusting client signal.' : 'Record new client transmissions and feedback.'}</p>
              {editingTestimonialId && (
                <button className="cancel-edit-btn" onClick={resetTestimonialForm}>
                  <XCircle size={14} /> CANCEL_CALIBRATION
                </button>
              )}
            </div>

            <form onSubmit={handleAddTestimonial} className="tactical-form">
              <div className="form-row">
                <div className="admin-input-group">
                  <label><UserIcon size={12} /> CLIENT_NAME</label>
                  <input 
                    type="text" 
                    placeholder="e.g. EUDEN M." 
                    value={newTestimonial.name}
                    onChange={e => setNewTestimonial({...newTestimonial, name: e.target.value})}
                    required
                  />
                </div>
                <div className="admin-input-group">
                  <label><Briefcase size={12} /> ROLE / COMPANY</label>
                  <input 
                    type="text" 
                    placeholder="e.g. LEAD_ENGINEER, OMNI_FLOW" 
                    value={newTestimonial.role}
                    onChange={e => setNewTestimonial({...newTestimonial, role: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label>RATING (0-5 STARS)</label>
                <input 
                  type="number" 
                  min="0" max="5" step="1"
                  placeholder="5" 
                  value={newTestimonial.rating}
                  onChange={e => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value) || 0})}
                  required
                />
              </div>

              <div className="admin-input-group">
                <label>TRANSMISSION_TEXT</label>
                <textarea 
                  rows="3" 
                  placeholder="The actual feedback..."
                  value={newTestimonial.text}
                  onChange={e => setNewTestimonial({...newTestimonial, text: e.target.value})}
                  required
                ></textarea>
              </div>

              <div className="form-row align-center" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={newTestimonial.is_featured}
                      onChange={e => setNewTestimonial({...newTestimonial, is_featured: e.target.checked})}
                    />
                    SET_AS_FEATURED_STORY
                  </label>
                </div>
                {newTestimonial.is_featured && (
                  <div className="admin-input-group" style={{ marginBottom: 0, flex: 1 }}>
                    <label className="file-upload-label">
                      <UploadCloud size={16} />
                      {uploadingTestimonialImg ? "UPLOADING..." : "UPLOAD FEATURED IMAGE"}
                      <input type="file" accept="image/*" onChange={handleTestimonialImgUpload} disabled={uploadingTestimonialImg} />
                    </label>
                  </div>
                )}
              </div>

              {newTestimonial.is_featured && newTestimonial.image_url && (
                <div className="preview-mini-img" style={{ backgroundImage: `url(${newTestimonial.image_url})`, height: '100px', marginBottom: '1rem' }}></div>
              )}

              <button type="submit" className="submit-btn" disabled={submittingTestimonial || uploadingTestimonialImg}>
                <Send size={18} />
                {submittingTestimonial ? "PROCESSING..." : editingTestimonialId ? "UPDATE_SIGNAL" : "DEPLOY_SIGNAL"}
              </button>
            </form>
          </section>

          <section className="admin-section list-section" style={{ marginTop: '2rem' }}>
             <div className="section-header">
              <div className="red-line-accent"></div>
              <h3>RECORDED_SIGNALS</h3>
              <p>Managing {testimonials.length} client feedback logs.</p>
            </div>
            {loadingTestimonials ? (
              <div className="admin-loading">SCANNING_DATABASE...</div>
            ) : (
              <div className="project-list">
                {testimonials.map(testi => (
                  <div key={testi.id} className={`admin-project-card ${editingTestimonialId === testi.id ? 'editing' : ''}`} style={{ gridTemplateColumns: '1fr auto' }}>
                    <div className="proj-info">
                      <h4>{testi.name} {testi.is_featured ? '(FEATURED)' : ''}</h4>
                      <p>{testi.role}</p>
                    </div>
                    <div className="admin-actions">
                      <button onClick={() => handleEditTestimonial(testi)} className="edit-btn-action" title="CALIBRATE_SIGNAL">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDeleteTestimonial(testi.id)} className="delete-btn" title="DELETE_SIGNAL">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
