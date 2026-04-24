import './Footer.css';
import ordalLogo from '../assets/OrdalLogo.png';

export default function Footer() {
  return (
    <footer className="footer container">
      <div className="footer-content">
        <div className="footer-brand">
          <img src={ordalLogo} alt="Ordal Studio Logo" className="footer-logo" />
        </div>
        <div className="footer-links">
          <div>
            <label>PAGES</label>
            <nav><a href="/">HOME</a><a href="/portfolio">PORTFOLIO</a></nav>
          </div>
          <div>
            <label>SOCIAL</label>
            <nav><a href="https://www.instagram.com/ordal.studio/">INSTAGRAM</a><a href="#">LINKEDIN</a></nav>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 ORDAL.STUDIO LTD. ALL RIGHTS RESERVED.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
