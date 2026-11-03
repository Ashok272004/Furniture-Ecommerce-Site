import { Link } from "react-router-dom";

function SocialIcon({ label, children }) {
  return (
    <span className="footer__social" role="img" aria-label={label}>
      {children}
    </span>
  );
}

function scrollToPageTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
<div className="footer__grid">
          <section className="footer__identity">
            <a className="footer__brand" href="/#home" aria-label="FurniNest home">
              <span className="footer__logo" aria-hidden="true">F</span>
              <span>Furni<span className="footer__brand-light">Nest</span></span>
            </a>
            <p className="footer__tagline">Thoughtful furniture. Everyday ease.</p>
            <div className="footer__socials" aria-label="Social media icons">
              <SocialIcon label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle className="footer__social-dot" cx="17.5" cy="6.5" r=".8"/></svg></SocialIcon>
              <SocialIcon label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 21v-8h3l.5-3H14V8c0-.9.3-1.5 1.6-1.5h2V3.8c-.4-.1-1.5-.2-2.8-.2-2.8 0-4.7 1.7-4.7 4.9V10H7v3h3.1v8H14Z"/></svg></SocialIcon>
              <SocialIcon label="Pinterest"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.8.2-2.7l1.3-5.4s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.3 1 .5 1.8 1.5 1.8 1.8 0 3.2-2.3 3.2-5.5 0-2.3-1.6-4-4.2-4-3.1 0-5 2.3-5 4.8 0 1 .3 2 .8 2.6.2.3.2.4.1.7l-.3 1c-.1.3-.3.4-.6.3-1.3-.5-2-2-2-3.8 0-2.8 2.4-6.2 7.2-6.2 3.8 0 6.3 2.8 6.3 5.9 0 4-2.2 7-5.5 7-1.1 0-2.2-.6-2.6-1.3l-.7 2.7c-.2 1-.8 1.9-1.2 2.6A10 10 0 1 0 12 2Z"/></svg></SocialIcon>
            </div>
          </section>

          <nav className="footer__column" aria-label="Discover FurniNest">
            <h2>Discover</h2>
            <a href="/#home">Home</a>
            <a href="/#shop-categories-title">Shop furniture</a>
            <a href="/#about">Our story</a>
            <a href="/#contact">Contact</a>
            <Link to="/sitemap" onClick={scrollToPageTop}>Sitemap</Link>
          </nav>

          <nav className="footer__column" aria-label="Customer care">
            <h2>Customer care</h2>
            <Link to="/help" onClick={scrollToPageTop}>FAQs &amp; Help Center</Link>
            <Link to="/my-orders" onClick={scrollToPageTop}>My orders</Link>
            <Link to="/legal/privacy" onClick={scrollToPageTop}>Privacy policy</Link>
            <Link to="/legal/terms" onClick={scrollToPageTop}>Terms of service</Link>
            <Link to="/legal/cookies" onClick={scrollToPageTop}>Cookie policy</Link>
            <Link to="/legal/copyright" onClick={scrollToPageTop}>Copyright notice</Link>
          </nav>

          <section className="footer__contact" id="contact">
            <h2>Get in touch</h2>
            <div className="footer__contact-body">
              <div className="footer__contact-details">
                <span className="footer__demo-label">Sample details</span>
                <a className="footer__contact-item" href="mailto:hello@furninest.example">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
                  <span><small>Email</small><strong>hello@furninest.example</strong></span>
                </a>
                <a className="footer__contact-item" href="tel:+910000000000">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3H4.8A1.8 1.8 0 0 0 3 4.8C3 13.7 10.3 21 19.2 21a1.8 1.8 0 0 0 1.8-1.8V17l-4.8-1.2-1.4 2.1a15.2 15.2 0 0 1-6.7-6.7l2.1-1.4L9 5 7 3Z"/></svg>
                  <span><small>Phone</small><strong>+91 00000 00000</strong></span>
                </a>
                <div className="footer__contact-item footer__location">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
                  <span><small>Location</small><strong>FurniNest Demo Store</strong><em>Chennai, Tamil Nadu, India</em></span>
                </div>
              </div>
              <div className="footer__map-wrap">
                <iframe
                  className="footer__map"
                  title="Sample map showing Chennai, Tamil Nadu"
                  src="https://maps.google.com/maps?q=Chennai%2C+Tamil+Nadu%2C+India&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  loading="eager"
                  allowFullScreen
                />
                <a className="footer__map-link" href="https://maps.google.com/?q=Chennai%2C+Tamil+Nadu%2C+India" target="_blank" rel="noreferrer">
                  View map <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="footer__bottom">
        <small>© {new Date().getFullYear()} FurniNest. All rights reserved.</small>
        <small className="footer__legal-note">Sample contact details and policies shown.</small>
        <nav aria-label="Legal links">
          <Link to="/legal/privacy" onClick={scrollToPageTop}>Privacy</Link>
          <Link to="/legal/terms" onClick={scrollToPageTop}>Terms</Link>
          <Link to="/legal/cookies" onClick={scrollToPageTop}>Cookies</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;

