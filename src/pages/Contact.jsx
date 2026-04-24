import { useState, useEffect, useRef } from "react";
import { MessageSquare, MapPin, Clock } from 'lucide-react';
import './Contact.css';

// Importing assets
import contactBuilding from '../assets/contact_building.png';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    services: [],
    message: ''
  });

  const toggleTag = (type, value) => {
    setFormData(prev => {
      const current = prev[type];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };
  const [currentTime, setCurrentTime] = useState(new Date());

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
  }, []);

  // Effect for the live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);



  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleWhatsAppRedirect = (e) => {
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
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-main-grid container">

        {/* LEFT COLUMN: BRANDING & INFO */}
        <div className="contact-branding reveal-on-scroll reveal-left" ref={addToRefs}>
          <div className="header-stack">
            <h1 className="transmission-title">
              Start the<br />
              <span className="accent-red">Transmission</span>
            </h1>
            <p className="transmission-subtext">
              We transform concepts into digital artifacts. Our studio operates at the intersection of neon noir aesthetics and brutalist efficiency.
            </p>
          </div>

          <div className="direct-links-stack">
            <div className="info-block">
              <label className="sys-label-tiny">DIRECT LINK</label>
              <a href="mailto:orangdalam.agency@gmail.com" className="info-value">orangdalam.agency@gmail.com</a>
            </div>

            <div className="info-block">
              <label className="sys-label-tiny">BASE OPERATIONS</label>
              <p className="info-value">Makassar, Indonesia</p>
              <span className="sys-meta">GMT+8 • South Sulawesi District</span>
            </div>
          </div>

          <div className="building-visual-container">
            <img src={contactBuilding} alt="Ordal HQ Visual" className="building-image" />
          </div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className="contact-form-surface reveal-on-scroll reveal-right" ref={addToRefs}>
          <form className="transmission-form" onSubmit={handleWhatsAppRedirect}>
            <div className="tactical-form-grid">
              <div className="form-step">
                <label className="step-label">01. IDENTITY</label>
                <input
                  type="text"
                  placeholder="WHO IS SENDING THIS?"
                  className="tactical-input"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-step">
                <label className="step-label">02. EMAIL</label>
                <input
                  type="email"
                  placeholder="WHERE DO WE REPLY?"
                  className="tactical-input"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-step">
                <label className="step-label">03. ORGANIZATION</label>
                <input
                  type="text"
                  placeholder="COMPANY NAME"
                  className="tactical-input"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className="form-step">
                <label className="step-label">04. COMMS CHANNEL</label>
                <input
                  type="text"
                  placeholder="PHONE OR TELEGRAM"
                  className="tactical-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
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

            <div className="form-step">
              <label className="step-label">05. BRIEF</label>
              <textarea
                placeholder="DESCRIBE THE MISSION OBJECTIVES..."
                className="tactical-textarea"
                required
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="tactical-submit-btn w-full">
              <MessageSquare size={20} className="wa-icon" />
              SEND VIA WHATSAPP
            </button>

            <div className="form-status-footer">
              <span className="blinking-dot"></span>
              AWAITING INPUT SIGNAL • SECURITY LEVEL ALPHA
            </div>
          </form>
        </div>
      </div>

      {/* BOTTOM WIDGETS */}
      <div className="contact-widgets-grid container">
        <div className="widget-card coordinates-widget reveal-on-scroll reveal-left" ref={addToRefs}>
          <div className="widget-header">
            <MapPin size={14} className="accent-red" />
            <label>COORDINATES</label>
          </div>
          <div className="map-view-container">
            <div className="map-overlay-tag">ORDAL_STUDIO_HQ</div>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1226.1430336806752!2d119.43914726961782!3d-5.211641999672871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNcKwMTInNDEuOSJTIDExOcKwMjYnMjMuMyJF!5e1!3m2!1sid!2sid!4v1776523919273!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Tactical Operations Center"
              className="map-iframe"
            ></iframe>
          </div>
        </div>

        <div className="widget-card time-widget reveal-on-scroll reveal-right" ref={addToRefs}>
          <div className="widget-header">
            <Clock size={14} className="accent-red" />
            <label>LOCAL TIME</label>
          </div>
          <div className="time-display">
            <span className="big-time">{formatTime(currentTime)}</span>
            <span className="time-status">ACTIVE OPERATIONS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
