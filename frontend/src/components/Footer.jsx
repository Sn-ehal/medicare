import { Link } from 'react-router-dom'
import './Footer.css'

const CURRENT_YEAR = new Date().getFullYear()

const Footer = () => {

  const footerLinks = {
    Company: [
      { label: 'About Us', href: '#' },
      { label: 'Health Articles & Blog', href: '/articles' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
    Services: [
      { label: 'Video Consult', href: '/video-consult' },
      { label: 'Find Doctors', href: '/find-doctors' },
      { label: 'Lab Tests', href: '/lab-tests' },
      { label: 'Surgeries', href: '/surgeries' },
      { label: 'Doctors Near You', href: '/doctors-near-you' },
    ],
    Specialties: [
      { label: 'General Physician', href: '/find-doctors' },
      { label: 'Dermatologist', href: '/find-doctors' },
      { label: 'Cardiologist', href: '/find-doctors' },
      { label: 'Pediatrician', href: '/find-doctors' },
      { label: 'Orthopedic', href: '/find-doctors' },
    ],
    Support: [
      { label: 'Help Center', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Refund Policy', href: '#' },
      { label: 'Cookie Settings', href: '#' },
    ],
  }

  return (
    <footer className="footer" id="footer">
      {/* Newsletter Strip */}
      <div className="footer__newsletter">
        <div className="container footer__newsletter-inner">
          <div className="footer__newsletter-text">
            <h3>Stay Healthy, Stay Informed</h3>
            <p>Get weekly health tips and exclusive offers delivered to your inbox.</p>
          </div>
          <form className="footer__newsletter-form" onSubmit={e => e.preventDefault()} id="newsletter-form">
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email address"
              className="footer__newsletter-input"
            />
            <button type="submit" className="footer__newsletter-btn" id="newsletter-submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            {/* Brand Column */}
            <div className="footer__brand">
              <Link to="/" className="footer__logo">
                <div className="footer__logo-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="14" fill="url(#footerLogoGrad)" />
                    <path d="M14 7v14M7 14h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="28" y2="28">
                        <stop stopColor="#2563eb" />
                        <stop offset="1" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="footer__logo-text">Medi<span>Care</span></span>
              </Link>

              <p className="footer__brand-desc">
                India's largest healthcare platform connecting patients with top doctors. 
                Quality healthcare, simplified.
              </p>

              {/* App Badges */}
              <div className="footer__app-badges">
                <div className="footer__app-badge" id="footer-app-store">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.14 1.28-2.12 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <span>Download on the</span>
                    <strong>App Store</strong>
                  </div>
                </div>
                <div className="footer__app-badge" id="footer-play-store">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.37.6 1.23 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/>
                  </svg>
                  <div>
                    <span>Get it on</span>
                    <strong>Google Play</strong>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="footer__socials">
                {[
                  { id: 'footer-facebook', icon: 'f', label: 'Facebook' },
                  { id: 'footer-twitter', icon: 'X', label: 'Twitter/X' },
                  { id: 'footer-instagram', icon: '📷', label: 'Instagram' },
                  { id: 'footer-linkedin', icon: 'in', label: 'LinkedIn' },
                ].map(s => (
                  <a key={s.id} id={s.id} href="#" className="footer__social" aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="footer__col">
                <h4 className="footer__col-title">{title}</h4>
                <ul className="footer__col-links">
                  {links.map(link => (
                    <li key={link.label}>
                      <Link to={link.href} className="footer__col-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copyright">
            © {CURRENT_YEAR} MediCare. All rights reserved.
          </p>
          <div className="footer__bottom-badges">
            <span className="footer__trust-badge">
              🔒 SSL Secured
            </span>
            <span className="footer__trust-badge">
              ✓ HIPAA Compliant
            </span>
            <span className="footer__trust-badge">
              🏆 ISO Certified
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
