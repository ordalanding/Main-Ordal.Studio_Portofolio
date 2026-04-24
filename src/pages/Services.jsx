import { useEffect, useRef, useState } from 'react';
import { Code2, Share2, Video, Camera } from 'lucide-react';
import './Services.css';

const PRICING_DATA = {
  "Social Media Management": [
    { name: "Starter", price: "Rp5.000.000/bulan", target: "UMKM mapan, klinik, F&B, toko lokal", deliverables: ["12 feed/carousel", "8 story", "6 reels", "Content calendar", "Copywriting", "Scheduling/posting", "Report bulanan", "1 meeting/bulan"] },
    { name: "Growth", price: "Rp7.500.000/bulan", target: "Brand yang ingin lebih aktif dan rapi", deliverables: ["16 feed/carousel", "12 story", "8 reels", "Riset kompetitor ringan", "Optimasi bio/highlight", "Copywriting custom", "Posting", "Report bulanan", "Admin reply jam kerja ringan"] },
    { name: "Pro", price: "Rp10.000.000/bulan", target: "Brand yang fokus growth dan branding", deliverables: ["20 feed/carousel", "16 story", "10 reels", "1x content direction/visit per bulan", "Monthly strategy review", "Report lebih detail", "Admin DM/komentar jam kerja"] },
    { name: "Premium", price: "Rp15.000.000/bulan", target: "Multi-branch, corporate, personal brand serius", deliverables: ["24-30 feed/carousel", "20 story", "12-14 reels", "Campaign planning bulanan", "Report performa lebih lengkap", "Community management lebih aktif"] }
  ],
  "Website Development": [
    { name: "Basic Landing Page", price: "Rp2.500.000", target: "Kampanye spesifik, event, atau promo 1 produk", deliverables: ["1 halaman landing page", "Desain responsif (mobile/desktop)", "Formulir kontak", "Tombol integrasi WhatsApp", "Revisi desain 2x"] },
    { name: "Company Profile", price: "Rp5.500.000", target: "Perusahaan, agensi, portofolio profesional", deliverables: ["Hingga 5 halaman (Home, About, Services, Portfolio, Contact)", "SEO dasar", "Gratis domain & hosting tahun pertama", "CMS untuk edit konten mandiri"] },
    { name: "E-Commerce / Custom", price: "Rp12.000.000+", target: "Toko online penuh, platform membership", deliverables: ["Fitur keranjang belanja", "Integrasi payment gateway (transfer, e-wallet)", "Sistem manajemen inventaris", "Fitur login pembeli", "UI/UX kustom"] }
  ],
  "Video Profile": [
    { name: "Basic Video", price: "Rp3.500.000", target: "UMKM, toko lokal, pengenalan singkat", deliverables: ["Video durasi 1 menit", "1 hari syuting (maks 4 jam)", "1 videografer", "Editing standar", "Background music (bebas royalti)"] },
    { name: "Professional", price: "Rp8.000.000", target: "Corporate, pabrik, brand skala menengah", deliverables: ["Video durasi 2-3 menit", "1 hari syuting penuh", "2 videografer", "Drone aerial footage", "Voice over profesional", "Color grading", "Motion graphics dasar"] },
    { name: "Cinematic", price: "Rp15.000.000+", target: "Brand besar, TVC digital, kampanye utama", deliverables: ["Konsep & storyboard lengkap", "Syuting 2 hari", "Penataan lighting premium", "Sutradara", "Aktor/talent (opsional)", "Editing sinematik"] }
  ],
  "Photo & Product Design": [
    { name: "Basic Catalog", price: "Rp1.500.000", target: "Katalog e-commerce, buku menu F&B standar", deliverables: ["20 foto produk (background polos/putih)", "Basic retouching (pembersihan noda, perbaikan warna)", "Resolusi tinggi"] },
    { name: "Creative Lifestyle", price: "Rp3.500.000", target: "Konten media sosial, banner promosi website", deliverables: ["15 foto produk dengan styling & properti pendukung", "Pembuatan moodboard konsep", "Retouching detail"] },
    { name: "Full Design Bundle", price: "Rp6.500.000", target: "Launching produk baru, rebranding visual", deliverables: ["20 foto kreatif (styled)", "Desain kemasan atau label produk (1 varian)", "5 template banner promo siap pakai untuk medsos/marketplace"] }
  ]
};

const PricingCard = ({ pkg, index, total }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // We set a dynamic top so each card stacks slightly lower than the one before it
  // Header is usually 80px, so we start sticky around 120px.
  const stickyTop = 120 + (index * 40);

  // Determine visual tier: 0 is lowest, 1 is mid, 2 is high/premium
  // If there are 3 items: 0, 1, 2. If 4 items: 0, 1, 1, 2.
  let tierClass = "tier-low";
  if (index === total - 1) {
    tierClass = "tier-premium";
  } else if (index > 0) {
    tierClass = "tier-mid";
  }

  return (
    <div
      className={`pricing-card ${isFlipped ? 'is-flipped' : ''} ${tierClass}`}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ top: `${stickyTop}px` }}
    >
      <div className="pricing-card-inner">
        {/* FRONT */}
        <div className="pricing-card-front">
          <div className="card-top-accent"></div>
          <h3 className="pkg-name">{pkg.name}</h3>
          <div className="pkg-price">{pkg.price}</div>
          <div className="pkg-target">
            <span className="target-label">COCOK UNTUK:</span>
            <p>{pkg.target}</p>
          </div>
          <div className="flip-hint">CLICK TO VIEW DELIVERABLES &rarr;</div>
        </div>

        {/* BACK */}
        <div className="pricing-card-back">
          <div className="card-top-accent"></div>
          <div className="deliverables-content">
            <h4>DELIVERABLES UTAMA</h4>
            <ul className="deliverables-table">
              {pkg.deliverables.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="flip-hint">&larr; BACK TO PRICING</div>
        </div>
      </div>
    </div>
  );
};

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("Social Media Management");
  const revealRefs = useRef([]);
  revealRefs.current = [];

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('deployed');
        }
      });
    }, { threshold: 0.1 });

    revealRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="services-page">
      {/* GLOBAL SCANLINE EFFECT */}
      <div className="scanline-overlay"></div>

      {/* 1. HERO TITLE */}
      <section className="services-hero container">
        <div className="camera-wireframe-bg animate-pulse-slow"></div>
        <h1 className="sv-title text-center">
          OUR <span className="text-primary">SERVICES</span>
        </h1>
        <p className="sv-subtitle text-center reveal-fast">
          Dismantling legacy agency models to deploy high-velocity labs that deliver pure performance and tactical advantage.
        </p>
      </section>

      {/* 2. SERVICES GRID & METHODOLOGY */}
      <section className="services-detailed container">
        <div className="detailed-grid">
          
          {/* Card: Web Dev (SYS_02) */}
          <div className="sv-card svc-wide reveal-card" ref={addToRefs}>
            <div className="card-header-row">
              <Code2 className="sv-icon" size={32} />
              <div className="sys-info">
                <span className="sys-status">DEPLOYED</span>
                <span className="sys-label">SYS_02</span>
              </div>
            </div>
            <div className="sv-card-content">
              <h3>Website Development</h3>
              <p>High-performance digital ecosystems built with precision code, optimized for speed and tactical user acquisition. Engineered for impact.</p>
              <div className="sv-tags">
                <span>NEXT.JS</span>
                <span>HEADLESS CMS</span>
                <span>CUSTOM API</span>
              </div>
            </div>
            <div className="code-bg"></div>
            <div className="card-border-accent"></div>
          </div>

          {[
            { id: 'SYS_01', icon: Share2, title: 'Social Media Management', desc: 'Strategic content deployment and community management engineered to dominate market share. Aggressive growth velocity.', tags: ['ENGAGEMENT', 'CONVERSION'], color: 'svc-primary' },
            { id: 'SYS_03', icon: Video, title: 'Video Profile', desc: 'High-velocity visual storytelling and brand narratives captured through elite-grade motion cinematography. Dominance in motion.', tags: ['CINEMATOGRAPHY', 'NARRATIVE'], color: 'svc-normal' },
            { id: 'SYS_04', icon: Camera, title: 'Photo & Product Design', desc: 'Precision product visualization and asset design, rendering your brand presence with elite cinematic standards. Render your dominance.', tags: ['ASSET RENDER', 'VISUALS'], color: 'svc-normal' }
          ].map((svc, idx) => (
            <div key={svc.id} className={`sv-card ${svc.color} reveal-card`} ref={addToRefs} style={{ transitionDelay: `${(idx + 1) * 100}ms` }}>
              <div className="card-header-row">
                <svc.icon className="sv-icon" size={32} />
                <span className="sys-label">{svc.id}</span>
              </div>
              <div className="sv-card-content">
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
                <div className="sv-tags">
                  {svc.tags.map(tag => <span key={tag}>{tag}</span>)}
                </div>
                {svc.color === 'svc-primary' && <a href="/portfolio" className="sv-link">VIEW CASE STUDIES →</a>}
              </div>
              <div className="card-border-accent"></div>
            </div>
          ))}

          {/* Card: Methodology */}
          <div className="sv-card svc-methodology reveal-card" ref={addToRefs}>
            <div className="sv-card-content text-center">
              <h3>OUR METHODOLOGY</h3>
              <p className="text-sm opacity-60">The Ordal Protocol. From zero to absolute dominance.</p>
              
              <div className="method-steps">
                {['ANALYZE', 'ARCHITECT', 'DEPLOY', 'ITERATE'].map((step, i) => (
                  <div key={step} className="step-group">
                    <div className="step">
                      <div className="step-circle">{`0${i + 1}`}</div>
                      <label>{step}</label>
                    </div>
                    {i < 3 && <div className="step-line"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRICING PROTOCOL */}
      <section className="pricing-section container reveal-card" ref={addToRefs}>
        <div className="directory-label text-center mb-4">SYSTEM / PRICING_TIERS / V1.0</div>
        <h2 className="section-title text-center mb-8">
          <span className="cyan-line-text">PRICING</span> <span className="text-outline">PROTOCOL</span>
        </h2>

        <div className="pricing-tabs">
          {Object.keys(PRICING_DATA).map((cat) => (
            <button
              key={cat}
              className={`pricing-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sticky-cards-container">
          {PRICING_DATA[activeCategory].map((pkg, idx, arr) => (
            <PricingCard key={`${activeCategory}-${idx}`} pkg={pkg} index={idx} total={arr.length} />
          ))}
        </div>
      </section>

      {/* 4. CUSTOM CALIBRATION CTA */}
      <section className="ascend-cta container text-center reveal-card" ref={addToRefs}>
        <h2>NEED A CUSTOM CALIBRATION?</h2>
        <p className="opacity-70 max-w-xl mx-auto mb-10">Have specific targets or budget parameters? Let's sit down and engineer a custom deployment plan that aligns perfectly with your vision and scale.</p>
        <div className="cta-buttons">
          <button className="btn-primary industrial-btn">REQUEST CUSTOM PROPOSAL</button>
          <button className="btn-secondary industrial-btn">INITIATE DISCUSSION</button>
        </div>
      </section>
    </div>
  );
}
