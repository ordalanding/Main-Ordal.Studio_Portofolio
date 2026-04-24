import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Play, TrendingUp, Calendar, User as UserIcon, Briefcase, ExternalLink } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    async function fetchProject() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setProject(data);
      } else {
        console.error("Error fetching project:", error);
      }
      setLoading(false);
    }
    
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="project-detail-loading">
        <div className="loading-scanner"></div>
        <p>DECRYPTING_PROJECT_FILE...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-error container">
        <h2>TRANSMISSION_LOST</h2>
        <p>The requested project file could not be found or has been redacted.</p>
        <Link to="/portfolio" className="back-link"><ArrowLeft size={16} /> RETURN_TO_ARCHIVE</Link>
      </div>
    );
  }

  // Helper to extract YouTube video ID if standard youtube link
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const getInstagramEmbed = (url) => {
    if (!url) return null;
    if (url.includes('instagram.com')) {
      const cleanUrl = url.split('?')[0].replace(/\/+$/, '');
      return `${cleanUrl}/embed/`;
    }
    return null;
  };

  const isSocialMedia = project?.category?.toUpperCase().includes('SOCIAL MEDIA');
  const isWebsite = project?.category?.toUpperCase() === 'WEBSITE DEVELOPMENT';
  const isPhotoProduct = project?.category?.toUpperCase() === 'PHOTO & PRODUCT DESIGN';
  
  const videoUrls = project.video_url ? project.video_url.split(',').map(u => u.trim()) : [];
  const videoEmbed = (!isSocialMedia && !isWebsite && !isPhotoProduct) ? getEmbedUrl(videoUrls[0]) : null;

  const getPdfEmbed = (url) => {
    if (!url) return null;
    if (url.includes('drive.google.com/file/d/')) {
       return url.replace(/\/view.*$/, '/preview');
    }
    return url;
  };

  const getImageUrl = (project) => {
    const url = project.portfolio_image_url || project.image_url;
    if (!url || url === 'undefined') return '/Ordalogo.png';
    return url;
  };

  return (
    <div className="project-detail-page">
      {/* HERO SECTION */}
      <section className="detail-hero">
        <div className="detail-hero-bg" style={{ backgroundImage: `url("${getImageUrl(project)}")` }}></div>
        <div className="detail-hero-overlay"></div>
        
        <div className="container detail-hero-content">
          <div className="hero-technical-data">
            <span className="data-item">PROJECT_ID: {project.id.slice(0,8).toUpperCase()}</span>
            <span className="data-item">STATUS: COMPLETED</span>
            <span className="data-item">LOC: 0.000, 0.000</span>
          </div>
          
          <Link to="/portfolio" className="back-link">
            <ArrowLeft size={14} /> BACK_TO_DATABASE
          </Link>
          
          <div className="hero-text-block">
            <div className="category-line">
              <div className="line-accent"></div>
              <span className="category-text">{project.category}</span>
            </div>
            <h1 className="detail-title">{project.title}</h1>
          </div>
        </div>
      </section>

      {/* METADATA BAR */}
      <div className="metadata-bar">
        <div className="container meta-grid">
          <div className="meta-item">
            <UserIcon size={16} />
            <div>
              <span className="meta-label">CLIENT</span>
              <span className="meta-value">{project.client || 'CLASSIFIED'}</span>
            </div>
          </div>
          <div className="meta-item">
            <Briefcase size={16} />
            <div>
              <span className="meta-label">SERVICE</span>
              <span className="meta-value">{project.category}</span>
            </div>
          </div>
          <div className="meta-item">
            <Calendar size={16} />
            <div>
              <span className="meta-label">YEAR</span>
              <span className="meta-value">{project.year || 'CURRENT'}</span>
            </div>
          </div>
          {/* SOCIAL LINKS (IF SOCIAL MEDIA MANAGEMENT) */}
          {(project.instagram_url || project.tiktok_url) && (
            <div className="meta-item social-meta-links">
              <TrendingUp size={16} className="text-primary" />
              <div>
                <span className="meta-label">SOCIAL_CHANNELS</span>
                <div className="social-links-row">
                  {project.instagram_url && (
                    <a href={project.instagram_url} target="_blank" rel="noopener noreferrer" className="meta-link">INSTAGRAM</a>
                  )}
                  {project.tiktok_url && (
                    <a href={project.tiktok_url} target="_blank" rel="noopener noreferrer" className="meta-link">TIKTOK</a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container detail-main-content">
        <div className="tactical-divider top">
          <div className="divider-line"></div>
          <div className="divider-dot"></div>
          <div className="divider-line"></div>
        </div>

        {/* FULL WIDTH MEDIA PREVIEW (NON-SOCIAL MEDIA) */}
        {(!isSocialMedia && project.video_url) && (
          <div className="full-width-media-container" style={{ marginBottom: '4rem' }}>
            <div className="content-block video-block">
              <div className="video-header">
                <div className="status-blinker"></div>
                <h3 className="block-title">
                  {isWebsite ? <><ExternalLink size={14} /> DEPLOYED_URL_PREVIEW</> :
                   isPhotoProduct ? <><ExternalLink size={14} /> PDF_ASSET_PREVIEW</> :
                   <><Play size={14} fill="currentColor" /> RECON_FOOTAGE_STREAM</>}
                </h3>
                <div className="header-technical">CH_01 // SIGNAL: STABLE // FULL_WIDTH</div>
              </div>
              
              <div className="video-frame" style={isWebsite ? { aspectRatio: '16/9' } : {}}>
                <div className="frame-corners">
                  <div className="c-tl"></div><div className="c-tr"></div>
                  <div className="c-bl"></div><div className="c-br"></div>
                </div>
                
                {isWebsite ? (
                  <div className="website-preview-container" style={{ height: '100%', minHeight: '600px' }}>
                    <iframe 
                      src={project.video_url} 
                      title="Website Preview" 
                      className="website-iframe"
                      sandbox="allow-same-origin allow-scripts"
                    ></iframe>
                  </div>
                ) : isPhotoProduct ? (
                  <div className="pdf-preview-container" style={{ height: '85vh', minHeight: '800px' }}>
                    <iframe 
                      src={getPdfEmbed(project.video_url)} 
                      title="PDF Preview" 
                      className="pdf-iframe"
                      allow="autoplay"
                    ></iframe>
                  </div>
                ) : videoEmbed ? (
                  <div className="video-container">
                    <iframe 
                      src={videoEmbed} 
                      title="Project Video" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="external-video-wrapper">
                    <a href={project.video_url} target="_blank" rel="noopener noreferrer" className="btn-secondary external-video-btn">
                      EXTERNAL_LINK_DETECTED <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="project-brief-layout">
          {/* LEFT COLUMN: Mission + Video/Reels */}
          <div className="layout-left">
            {project.mission_statement && (
              <div className="mission-statement">
                <div className="statement-frame">
                  <h2>{project.mission_statement}</h2>
                  <div className="frame-accent"></div>
                </div>
              </div>
            )}

            <div className="tactical-divider middle">
              <div className="divider-line short"></div>
              <div className="divider-square"></div>
              <div className="divider-line"></div>
            </div>

            <div className={`detail-grid ${isSocialMedia ? 'social-media-layout' : ''}`}>
              {/* LEFT: Video for Social Media Only */}
              <div className="detail-left">
                {(isSocialMedia && project.video_url) && (
                  <div className="content-block video-block">
                    <div className="video-header">
                      <div className="status-blinker"></div>
                      <h3 className="block-title">
                        <><Play size={14} fill="currentColor" /> RECON_FOOTAGE_STREAM</>
                      </h3>
                      <div className="header-technical">CH_01 // SIGNAL: STABLE</div>
                    </div>
                    
                    <div className="video-frame">
                      <div className="frame-corners">
                        <div className="c-tl"></div><div className="c-tr"></div>
                        <div className="c-bl"></div><div className="c-br"></div>
                      </div>
                      
                      <div className="reels-swiper-container">
                        <Swiper
                          effect={'cards'}
                          grabCursor={true}
                          cardsEffect={{
                            slideShadows: true,
                            rotate: true,
                            perSlideOffset: 8,
                            perSlideRotate: 2,
                          }}
                          navigation={true}
                          modules={[EffectCards, Navigation]}
                          className="reels-swiper"
                          onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
                        >
                          {videoUrls.map((url, idx) => (
                            <SwiperSlide key={idx} className="reel-slide">
                              <div className={`reel-card ${activeSlide === idx ? 'active' : ''}`}>
                                {activeSlide === idx ? (
                                  <iframe 
                                    src={getInstagramEmbed(url)} 
                                    title={`Reel ${idx}`}
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                  ></iframe>
                                ) : (
                                  <div className="reel-placeholder">
                                    <Play size={48} className="placeholder-icon" />
                                    <span>BUFFERING_REEL_{idx + 1}...</span>
                                  </div>
                                )}
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: Stats/Report */}
              <div className="detail-right">
                {project.success_metrics && (
                  <div className="content-block stats-block">
                    <div className="stats-header">
                      <TrendingUp size={14} />
                      <h3 className="block-title">SUCCESS_METRICS</h3>
                    </div>
                    <div className="metrics-box">
                      <div className="metrics-frame">
                        <div className="m-corner tl"></div><div className="m-corner tr"></div>
                        <div className="m-corner bl"></div><div className="m-corner br"></div>
                        <p className="metrics-text">{project.success_metrics}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Challenge Obj */}
          <div className="layout-right">
            <div className="mission-details">
              <div className="detail-header">
                <div className="red-line-accent-inline"></div>
                <h3 className="block-title">CHALLENGE_OBJ</h3>
              </div>
              <p className="description-text">{project.description || 'No brief provided for this operation.'}</p>
              
              <div className="tactical-meta-list">
                <div className="meta-item">
                  <Calendar size={12} />
                  <span>TIMESTAMP: {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                  <UserIcon size={12} />
                  <span>CLIENT: {project.client}</span>
                </div>
                <div className="meta-item">
                  <Briefcase size={12} />
                  <span>STATUS: COMPLETED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EXTENDED GALLERY (CINEMATIC MARQUEE OR STATIC) */}
        {project.gallery_urls && project.gallery_urls.length > 0 && (
          <div className="extended-gallery-section full-width">
            {project.gallery_urls.length === 1 ? (
              <div className="single-gallery-view container">
                <img 
                  src={project.gallery_urls[0]} 
                  alt="Gallery content" 
                  className="single-gallery-image"
                  onClick={() => setLightboxImg(project.gallery_urls[0])}
                />
              </div>
            ) : (
              <div className="marquee-wrapper">
                <div className="marquee-track">
                  {/* Track 1: First Row - Duplicated to create endless loop */}
                  {(project.gallery_urls || []).filter(url => url && url !== 'undefined').concat((project.gallery_urls || []).filter(url => url && url !== 'undefined')).concat((project.gallery_urls || []).filter(url => url && url !== 'undefined')).map((url, index) => (
                    <div 
                      key={`t1-${index}`} 
                      className="marquee-item" 
                      style={{ backgroundImage: `url(${url})` }}
                      onClick={() => setLightboxImg(url)}
                    >
                      <div className="marquee-overlay"><Play size={24} /></div>
                    </div>
                  ))}
                </div>
                
                {/* Optional Track 2 (Offset or slightly faster) if there are many images */}
                <div className="marquee-track track-offset">
                  {[(...project.gallery_urls || []).filter(url => url && url !== 'undefined'), (...project.gallery_urls || []).filter(url => url && url !== 'undefined'), (...project.gallery_urls || []).filter(url => url && url !== 'undefined')].flat().reverse().map((url, index) => (
                    <div 
                      key={`t2-${index}`} 
                      className="marquee-item" 
                      style={{ backgroundImage: `url(${url})` }}
                      onClick={() => setLightboxImg(url)}
                    >
                      <div className="marquee-overlay"><Play size={24} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* FOOTER CALL TO ACTION */}
      <section className="detail-cta">
        <div className="container">
          <h2>READY TO INITIATE YOUR OWN PROTOCOL?</h2>
          <Link to="/contact" className="tactical-btn">
            ESTABLISH_CONNECTION <ArrowLeft size={16} style={{transform: 'rotate(135deg)'}} />
          </Link>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {lightboxImg && (
        <div className="lightbox-modal" onClick={() => setLightboxImg(null)}>
          <div className="lightbox-close">X</div>
          <img src={lightboxImg} alt="Enlarged view" className="lightbox-image" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
