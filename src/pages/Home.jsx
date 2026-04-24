import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Share2, Code2, Video, Camera, MessageSquare, ExternalLink } from 'lucide-react';
import './Home.css';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

import esLogo from '../assets/OurClient/ESLOGO.png';
import iqosLogo from '../assets/OurClient/LOGOIQOS.png';
import mahardikaLogo from '../assets/OurClient/MAHARDIKALOGO.png';
import mujiLogo from '../assets/OurClient/MUJILOGO.png';
import reboundLogo from '../assets/OurClient/ReboundLogo.png';
import resstyLogo from '../assets/OurClient/ResstyLogo.png';
import sadjaLogo from '../assets/OurClient/SadjaLogo.png';
import terracottaLogo from '../assets/OurClient/TerracottaLogo.png';
import verdaLogo from '../assets/OurClient/VerdaLogo.png';
import GVMlogo from '../assets/OurClient/GVMlogo.png';
import IndiGlassesLogo from '../assets/OurClient/IndiGlassesLogo.png';
import MutiaraSpringsLogo from '../assets/OurClient/MutiaraSpringsLogo.png';
import HisyamLogo from '../assets/OurClient/HisyamLogo.png';
import VEENLOGO from '../assets/OurClient/VEENLOGO.png';
import aswinlogo from '../assets/OurClient/aswinlogo.png';
import madamkettylogo from '../assets/OurClient/madamkettylogo.png';
import DouxLogo from '../assets/OurClient/DouxLogo.png';
import No1Logo from '../assets/OurClient/No1Logo.png';
import LogoBPN from '../assets/OurClient/LogoBPN.png';
import VirtuLogo from '../assets/OurClient/VirtuLogo.png';
import RSPLOGO from '../assets/OurClient/RSPLOGO.png';

const clientLogos = [
  esLogo, iqosLogo, mahardikaLogo, mujiLogo, reboundLogo, resstyLogo, sadjaLogo, terracottaLogo, verdaLogo, MutiaraSpringsLogo,
  IndiGlassesLogo, GVMlogo, HisyamLogo, VEENLOGO, aswinlogo, madamkettylogo, DouxLogo, No1Logo, LogoBPN, VirtuLogo, RSPLOGO
];

function WorkCard({ project }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const truncateText = (text, limit = 100) => {
    if (!text) return "Deploying elite digital infrastructure to dominate market segments.";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    if (project.id) {
      navigate(`/portfolio/${project.id}`);
    }
  };

  return (
    <div 
      className={`work-card ${isFlipped ? 'is-flipped' : ''}`} 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="work-image" style={{ backgroundImage: `url(${project.image_url})` }}></div>
          <div className="work-category-tag">{project.category}</div>
          <div className="work-info">
            <h6>{project.client}</h6>
            <h3>{project.title}</h3>
          </div>
        </div>
        <div className="card-back">
          <div className="back-content">
            <div className="back-header">MISSION_BRIEF</div>
            <p className="brief-text">{truncateText(project.description)}</p>
            <button className="btn-secondary back-btn" onClick={handleNavigate}>
              DECRYPT_DETAILS <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="back-glow"></div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    services: [],
    message: ''
  });
  const [status, setStatus] = useState('');

  const scrollToWorks = () => {
    const section = document.getElementById('selected-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track mouse position for the Aura effect
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const heroRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const toggleTag = (type, value) => {
    setFormData(prev => {
      const current = prev[type];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  // Fetch projects for Selected Works section
  useEffect(() => {
    async function fetchProjects() {
      // Fetch up to 20 recent projects to randomize from
      const { data } = await supabase.from('projects').select('*').limit(20).order('created_at', { ascending: false });
      if (data && data.length > 0) {
        // Shuffle the array randomly
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        // Only keep 3 cards for the home page
        setProjects(shuffled.slice(0, 3));
      }
    }
    fetchProjects();
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    
    const servicesStr = formData.services.length > 0 ? formData.services.join(', ') : 'None selected';
    
    const text = `*New Mission Inquiry*%0A%0A` +
                 `*Name:* ${formData.name}%0A` +
                 `*Email:* ${formData.email}%0A` +
                 `*Company:* ${formData.company}%0A` +
                 `*Phone:* ${formData.phone}%0A` +
                 `*Services:* ${servicesStr}%0A` +
                 `*Message:* ${formData.message}`;
    
    window.open(`https://wa.me/6282293309995?text=${text}`, '_blank');
    setStatus('success');
  };

  // Scroll Reveal Logic
  const scrollRefs = useRef([]);
  scrollRefs.current = [];

  const addToRefs = (el) => {
    if (el && !scrollRefs.current.includes(el)) {
      scrollRefs.current.push(el);
    }
  };

  useEffect(() => {
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

    scrollRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      scrollRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [projects]);

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section
        className="hero-section container"
        ref={heroRef}
        onMouseMove={handleMouseMove}
      >
        {/* Animated Backgrounds */}
        <div className="hero-grid-bg"></div>
        <div
          className="hero-aura"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, color-mix(in srgb, var(--primary) 12%, transparent) 0%, transparent 60%)`
          }}
        ></div>

        <div className="hero-grid">
          <div className="hero-content reveal-on-scroll reveal-left" ref={addToRefs}>
            <h1 className="hero-title">
              AMPLIFY <br />
              <span className="hero-highlight">YOUR</span> <br />
              DIGITAL <br />
              PRESENCE.
            </h1>
            <p className="hero-desc">
              Engineering tactical dominance for global brands. <br />
              We don't just build platforms; we create <strong>unfair advantages</strong>.
            </p>
            <div className="hero-actions">
              <button 
                className="btn-primary cta-btn" 
                onClick={() => navigate('/contact')}
              >
                OUR EDGE <ArrowUpRight size={16} />
              </button>
              <button 
                className="btn-secondary cta-btn"
                onClick={scrollToWorks}
              >
                VIEW WORK
              </button>
            </div>
          </div>
          <div className="hero-visual reveal-on-scroll reveal-right" ref={addToRefs}>
            <div className="hero-desk-widget">
              <h5>+3 Years</h5>
              <label>EXPERIENCE</label>
            </div>

            {/* Cyber HUD Orbital Visual */}
            <div className="cyber-hud-container">
              {/* Radar Rings */}
              <div className="radar-ring ring-1"></div>
              <div className="radar-ring ring-2"></div>
              <div className="radar-ring ring-3"></div>

              <div className="radar-scanner"></div>
              <div className="radar-core"></div>

              {/* HUD Widgets */}
              <div className="hud-card top-right">
                <div className="hud-header">SYS_LOAD || [O-E]</div>
                <div className="hud-value">24<span className="text-muted">%</span></div>
                <div className="hud-chart">
                  <div className="bar b1"></div><div className="bar b2"></div><div className="bar b3"></div>
                  <div className="bar b4"></div><div className="bar b5"></div><div className="bar b2"></div>
                </div>
              </div>

              <div className="hud-card bottom-right">
                <div className="hud-header">TARGET_ACQUISITION</div>
                <div className="hud-value flex-align">
                  SERVER
                  <span className="dot dot-green blink" style={{ marginLeft: 'auto' }}></span>
                </div>
                <div className="hud-value flex-align" style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--on-surface-variant)' }}>
                  ENCRYPTION <span className="text-primary" style={{ marginLeft: 'auto' }}>ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CORE ENGINE (SERVICES) */}
      <section className="core-engine-section container">
        <div className="directory-label">DIRECTORY / EXECUTION_PILLARS / V1.0</div>

        <div className="core-header-row">
          <h2 className="section-title">THE <span className="text-outline">CORE</span> ENGINE.</h2>
        </div>

        <div className="core-subtitle-row">
          <div className="core-subtitle-left">
            <div className="red-line-accent"></div>
            <p>Dismantling legacy agency models to deploy high-velocity<br />labs that deliver pure performance and tactical advantage.</p>
          </div>
          <div className="core-tech-stats">
            <div className="stat-row"><span className="stat-label">PRIORITY:</span> <span className="stat-val text-primary">CRITICAL</span></div>
            <div className="stat-row"><span className="stat-label">ENGINE:</span> <span className="stat-val">V8_HYPERDRIVE</span></div>
            <div className="stat-row"><span className="stat-label">THROUGHPUT:</span> <span className="stat-val">UNLIMITED</span></div>
          </div>
        </div>

        <div className="services-grid">
          {[
            { id: 'SYS_01', icon: Share2, title: 'SOCIAL MEDIA MANAGEMENT', desc: 'Strategic content deployment and community management engineered to dominate market share and drive conversion.', footer: 'INJECT_PROTOCOL' },
            { id: 'SYS_02', icon: Code2, title: 'WEBSITE DEVELOPMENT', desc: 'High-performance digital ecosystems built with precision code, optimized for speed and tactical user acquisition.', footer: 'BOOT_INTERFACE' },
            { id: 'SYS_03', icon: Video, title: 'VIDEO PROFILE', desc: 'High-velocity visual storytelling and brand narratives captured through elite-grade motion cinematography.', footer: 'BROADCAST_SIGNAL' },
            { id: 'SYS_04', icon: Camera, title: 'PHOTO & PRODUCT DESIGN', desc: 'Precision product visualization and asset design, rendering your brand presence with elite cinematic standards.', footer: 'RENDER_ASSETS' }
          ].map((svc, i) => (
            <div key={svc.id} className={`service-card ${i === 0 ? 'accent-card' : ''} reveal-on-scroll`} ref={addToRefs} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="card-top">
                <div className="icon-box"><svc.icon size={20} /></div>
                <span className="sys-label">{svc.id}</span>
              </div>
              <h3 className="service-title">{svc.title.split(' ')[0]}<br />{svc.title.split(' ').slice(1).join(' ')}</h3>
              <p className="service-desc">{svc.desc}</p>
              <div className="card-footer">{svc.footer} &rarr;</div>
            </div>
          ))}
        </div>
      </section>

      {/* CLIENTS MARKQUEE */}
      <section className="our-clients-section reveal-on-scroll" ref={addToRefs}>
        <h2 className="section-title center" style={{ marginBottom: "4rem" }}>OUR <span className="text-outline">CLIENT</span></h2>
        <div className="marquee">
          <div className="marquee-content">
            {clientLogos.map((logo, idx) => (
              <img key={`marquee-1-${idx}`} src={logo} alt={`Client Logo ${idx}`}
                className={`client-logo ${logo === reboundLogo ? 'rebound-logo' : ''}`} />
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {clientLogos.map((logo, idx) => (
              <img key={`marquee-2-${idx}`} src={logo} alt={`Client Logo ${idx}`}
                className={`client-logo ${logo === reboundLogo ? 'rebound-logo' : ''}`} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. SELECTED WORKS */}
      <section className="selected-works-section container" id="selected-works">
        <div className="works-layout-grid">
          <div className="works-content reveal-on-scroll reveal-left" ref={addToRefs}>
            <div className="directory-label">GALLERY / DEPLOYED_ASSETS / V1.0</div>
            <h2 className="section-title selected-works-title">
              <span className="cyan-line-text">SELECTED</span> <span className="text-outline">WORKS</span>
            </h2>
            <div className="works-description">
              <p>Exploring the frontier of digital excellence. Each project is a strategic deployment of high-velocity code and cinematic design, engineered to dominate market share.</p>
              <p>We don't just build portfolios; we document <strong>tactical victories</strong> for our global partners.</p>
            </div>
            
            <div className="works-stats-box">
              <div className="stat-row"><span className="stat-label">DEPLOYMENTS:</span> <span className="stat-val">ACTIVE</span></div>
              <div className="stat-row"><span className="stat-label">SUCCESS_RATE:</span> <span className="stat-val text-primary">100%</span></div>
            </div>
          </div>

          <div className="works-swiper-container reveal-on-scroll reveal-right" ref={addToRefs}>
          <Swiper
            effect={'cards'}
            grabCursor={true}
            modules={[EffectCards, Autoplay]}
            className="works-swiper"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            cardsEffect={{
              slideShadows: true,
              rotate: true,
              perSlideOffset: 8,
              perSlideRotate: 2,
            }}
          >
            {projects.length > 0 ? projects.map((project, i) => (
              <SwiperSlide key={project.id || i}>
                <WorkCard project={project} />
              </SwiperSlide>
            )) : (
              <>
                <SwiperSlide>
                  <WorkCard project={{ client: 'FINTECH', title: 'NEO-WEALTH ECOSYSTEM', description: 'Engineering a high-velocity financial ecosystem with modular architecture for global scalability.' }} />
                </SwiperSlide>
                <SwiperSlide>
                  <WorkCard project={{ client: 'LIFESTYLE', title: 'VIRAL LUXURY', description: 'Tactical brand positioning and cinematic content deployment for elite lifestyle demographics.' }} />
                </SwiperSlide>
                <SwiperSlide>
                  <WorkCard project={{ client: 'SAAS', title: 'NEXUS FLOW', description: 'Precision SaaS infrastructure built for mission-critical operations and seamless data transmission.' }} />
                </SwiperSlide>
                <SwiperSlide>
                  <WorkCard project={{ client: 'COMMUNITY', title: 'GLOBAL COLLECTIVE', description: 'Architecting decentralized community platforms to foster high-engagement tactical networks.' }} />
                </SwiperSlide>
              </>
            )}
          </Swiper>
        </div>
      </div>
    </section>

      {/* 4. THE INSIDER ADVANTAGE */}
      <section className="insider-section container">
        <div className="insider-grid">
          <div className="insider-content reveal-on-scroll reveal-left" ref={addToRefs}>
            <h2 className="section-title">THE <span className="hero-highlight">INSIDER</span> ADVANTAGE.</h2>
            <div className="insider-text">
              <p><strong>Ordal [Ohr-dal]</strong> functions as your internal tactical unit. We embed with mission objectives, bypassing standard agency frictions.</p>
              <p>We are the <strong>engineers in the room</strong>. Strategic partners who hold the master keys because we architected the infrastructure.</p>
            </div>
            <div className="founder-block">
              <div className="founder-avatars">
                <div className="avatar"></div>
                <div className="avatar"></div>
              </div>
              <div>
                <h5>THE ELITE TEAM</h5>
                <label>Founders & Lead Engineers</label>
              </div>
            </div>
          </div>
          <div className="insider-visual reveal-on-scroll reveal-right" ref={addToRefs}>
            <div className="insider-image-main"></div>
            <div className="insider-image-sub"></div>
            <div className="thunder-badge"><p>⚡</p></div>
          </div>
        </div>
      </section>

      {/* 5. START THE TRANSMISSION (CONTACT) */}
      <section className="contact-section container">
        <div className="directory-label">OUTBOUND / SIGNAL_START</div>
        <div className="contact-grid">
          <div className="contact-info reveal-on-scroll reveal-left" ref={addToRefs}>
            <h2 className="section-title contact-title">
              <span className="glitch-text">START THE</span><br />
              <span className="hero-highlight">TRANSMISSION.</span>
            </h2>
            <div className="contact-subtitle-row">
              <div className="red-line-accent" style={{ height: '90px' }}></div>
              <p className="contact-desc">The future of your digital dominance begins<br />with a single signal. Our tactical team is on<br />standby.</p>
            </div>

            <div className="contact-methods">
              <div className="method">
                <div className="method-icon-box">@</div>
                <div>
                  <label>EMAIL</label>
                  <p className="method-text">orangdalam.agency@gmail.com</p>
                </div>
              </div>
              <div className="method mt-2">
                <div className="method-icon-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div>
                  <label>BASE_OPERATIONS</label>
                  <p className="method-text">Makassar, Indonesia</p>
                </div>
              </div>
            </div>

            <div className="status-badges">
              <div className="status-badge"><span className="dot dot-green"></span> SERVERS_ONLINE</div>
              <div className="status-badge"><span className="dot dot-blue"></span> SECURE_LINK</div>
            </div>
          </div>

          <div className="contact-form-wrapper reveal-on-scroll reveal-right" ref={addToRefs}>
            <div className="form-id">FORM_ID: TRANSMIT_04</div>
            {status === 'success' ? (
              <div className="success-msg">SIGNAL RECEIVED. STANDBY.</div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div className="tactical-form-grid">
                  <div className="input-group">
                    <label>IDENTIFIER_NAME</label>
                    <input type="text" placeholder="Full name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>FREQUENCY_EMAIL</label>
                    <input type="email" placeholder="Email address" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>ORGANIZATION</label>
                    <input type="text" placeholder="Company name" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>COMMS_CHANNEL</label>
                    <input type="text" placeholder="Phone or Telegram" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>

                <div className="tag-selection-group">
                  <span className="tag-label">WHAT SERVICES ARE YOU LOOKING FOR?</span>
                  <div className="tag-cloud">
                    {['Social Media Management', 'Website Development', 'Video Profile', 'Photo & Product Design'].map(tag => (
                      <button 
                        key={tag} 
                        type="button" 
                        className={`tag-item ${formData.services.includes(tag) ? 'active' : ''}`}
                        onClick={() => toggleTag('services', tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="input-group">
                  <label>THE_MISSION_BRIEF</label>
                  <textarea 
                    className="tactical-textarea" 
                    placeholder="Tell us about your objectives..."
                    value={formData.message} 
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="tactical-submit-btn w-full">
                  <MessageSquare size={20} />
                  SEND MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
