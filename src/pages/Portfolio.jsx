import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus, Minus, Star, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import './Portfolio.css';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;

  const scrollRefs = useRef([]);

  const addToRefs = (el) => {
    if (el && !scrollRefs.current.includes(el)) {
      scrollRefs.current.push(el);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const { data: projectsData, error: projError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (projError) console.error("Error fetching projects:", projError);
      else setProjects(projectsData || []);
      
      const { data: testData, error: testError } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (testError) console.error("Error fetching testimonials:", testError);
      else setTestimonials(testData || []);

      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Filter null values and observe
    const currentRefs = scrollRefs.current.filter(Boolean);
    currentRefs.forEach((ref) => observer.observe(ref));

    return () => {
      currentRefs.forEach((ref) => observer.unobserve(ref));
    };
  }, [loading, projects, testimonials, currentPage]);

  const faqs = [
    { q: "How do you handle project timelines?", a: "We operate on tactical sprint cycles. Every project has a clear mission timeline with defined execution phases to ensure high-velocity delivery without friction." },
    { q: "Can we modify services once a project starts?", a: "The Ordal Protocol is dynamic. While the core architecture remains stable, we calibrate tactical objectives based on real-time data and market shifts." },
    { q: "What is your primary tech stack?", a: "We engineer with elite-grade frameworks including Next.js, React, and custom headless CMS architectures, optimized for absolute performance." },
    { q: "What's the best way to start a collaboration?", a: "Initiate a transmission through our contact portal. Our lead engineers will analyze your objectives and calibrate a custom solution within 24 hours." }
  ];

  return (
    <div className="portfolio-page">
      {/* 1. HERO SECTION */}
      <section className="portfolio-hero">
        <div className="hero-glow"></div>
        <div className="container">
          <div className="hero-content-wrapper">
            <header className="portfolio-header reveal-on-scroll reveal-left" ref={addToRefs}>
              <div className="directory-label">GALLERY / MISSION_ARCHIVE / V1.0</div>
              <h1 className="page-title">
                THE <span className="text-highlight">PROJECT</span> <span className="text-outline">LOGS.</span>
              </h1>
            </header>

            <div className="hero-visual reveal-on-scroll reveal-right" ref={addToRefs}>
              <div className="tech-ring outer"></div>
              <div className="tech-ring inner"></div>
              <div className="logo-glow"></div>
              <img src="/Ordalogo.png" alt="Ordal Studio" className="hero-logo-large" />
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO STATUS BAR */}
      <div className="portfolio-status-bar container reveal-on-scroll reveal-up" ref={addToRefs}>
        <div className="status-item">
          <label>ARCHIVE_STATUS</label>
          <div className="status-indicator">
            <span className="dot pulse"></span>
            <span>DECRYPTED_READY</span>
          </div>
        </div>
        <div className="status-item">
          <label>SECURITY_CLEARANCE</label>
          <span>ACCESS_LEVEL_04</span>
        </div>
        <div className="status-item">
          <label>DATA_INTEGRITY</label>
          <span>100% SECURE</span>
        </div>
        <div className="status-item">
          <label>LAST_CALIBRATION</label>
          <span>{new Date().toLocaleDateString('en-GB').replace(/\//g, '.')}</span>
        </div>
      </div>

      {/* 2. PROJECT GRID */}
      <section className="portfolio-grid-section container">
        <div className="section-header-row reveal-on-scroll" ref={addToRefs}>
          <h2 className="section-subtitle-main">Explore some of our <br/> tactical deployments</h2>
          <div className="grid-count">LOG_COUNT: {projects.length}</div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-bar"></div>
            <p>SYNCING_ARCHIVE...</p>
          </div>
        ) : (
          <>
            <div className="projects-grid">
              {projects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage).map((project, i) => (
              <Link 
                to={`/portfolio/${project.id}`}
                key={project.id} 
                className="project-card reveal-on-scroll" 
                ref={addToRefs}
                style={{ transitionDelay: `${(i % 2) * 200}ms` }}
              >
                <div className="project-image-wrapper">
                  <div className="project-image" style={{ backgroundImage: `url(${project.portfolio_image_url || project.image_url || '/Ordalogo.png'})` }}></div>
                  <div className="project-btn-top">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
                <div className="project-info-row">
                  <h3 className="project-title-link">{project.title}</h3>
                  <div className="project-tags">
                    {project.category || 'TACTICAL_V1'} • {project.client || 'CLIENT_SECURE'}
                  </div>
                </div>
              </Link>
            ))}
            </div>
            
            {projects.length > projectsPerPage && (
              <div className="pagination-controls">
                <button 
                  className="pagination-btn" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  PREV_PAGE
                </button>
                <div className="pagination-indicator">
                  PAGE {currentPage} / {Math.ceil(projects.length / projectsPerPage)}
                </div>
                <button 
                  className="pagination-btn" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(projects.length / projectsPerPage)))}
                  disabled={currentPage === Math.ceil(projects.length / projectsPerPage)}
                >
                  NEXT_PAGE
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* 3. STORIES FROM OUR CLIENTS */}
      <section className="stories-section">
        <div className="container">
          {testimonials.filter(t => t.is_featured).length > 0 && (
            <div className="featured-story-grid">
              {testimonials.filter(t => t.is_featured).slice(0, 1).map(story => (
                <div key={story.id} style={{ display: 'contents' }}>
                  <div className="featured-card reveal-on-scroll reveal-left" ref={addToRefs}>
                    <div className="directory-label mb-2">FEATURED_FEEDBACK</div>
                    <div className="stars">
                      {[...Array(story.rating !== undefined ? story.rating : 5)].map((_, i) => <Star key={i} size={16} fill="white" stroke="none" />)}
                    </div>
                    <p className="quote-text">
                      "{story.text}"
                    </p>
                    <div className="quote-author">
                      <div className="author-info">
                        <h5>{story.name}</h5>
                        <label>{story.role}</label>
                      </div>
                    </div>
                  </div>
                  <div className="featured-visual reveal-on-scroll reveal-right" ref={addToRefs}>
                    <div className="visual-image" style={{ backgroundImage: `url("${story.image_url || '/Ordalogo.png'}")` }}></div>
                    <div className="visual-overlay"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {testimonials.filter(t => !t.is_featured).length > 0 && (
            <div className="stories-layout-grid mt-6">
              <div className="stories-content reveal-on-scroll reveal-left" ref={addToRefs}>
                <div className="directory-label">FEEDBACK / SIGNAL_LOGS</div>
                <h2 className="section-title">Stories from our clients</h2>
              </div>
              
              <div className="mini-stories-swiper-container reveal-on-scroll reveal-right" ref={addToRefs}>
                <Swiper
                  effect={'cards'}
                  grabCursor={true}
                  modules={[EffectCards, Autoplay]}
                  className="mini-stories-swiper"
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  cardsEffect={{
                    slideShadows: true,
                    rotate: false,
                    perSlideOffset: 8,
                  }}
                >
                  {testimonials.filter(t => !t.is_featured).map((story, i) => (
                    <SwiperSlide key={story.id}>
                      <div className="mini-story-card">
                        <div className="stars">
                          {[...Array(story.rating !== undefined ? story.rating : 5)].map((_, j) => <Star key={j} size={12} fill="var(--primary)" stroke="none" />)}
                        </div>
                        <p className="mini-text">{story.text}</p>
                        <div className="mini-author">
                          <h6>{story.name}</h6>
                          <label>{story.role}</label>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className="faq-section container">
        <div className="faq-grid">
          <div className="faq-content reveal-on-scroll reveal-left" ref={addToRefs}>
            <div className="directory-label">SYS_INFO / DATA_ARCHIVE</div>
            <h2 className="section-title">Got a question?<br /><span className="text-highlight">We've got the answer.</span></h2>
          </div>
          <div className="faq-list reveal-on-scroll reveal-right" ref={addToRefs}>
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${activeFaq === i ? 'active' : ''}`} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <div className="faq-icon">
                    {activeFaq === i ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </div>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
