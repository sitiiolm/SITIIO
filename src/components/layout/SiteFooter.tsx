import { LogoSphere, Wordmark } from '@/components/brand/Brand';
import { MailIcon, PanamaFlag, PinIcon, WhatsAppOutline } from '@/components/icons';
import { gmailComposeUrl, siteConfig, whatsappUrl } from '@/config/site';

/** Dirección de SITIIO + canales de contacto + footer mínimo. */
export function SiteFooter() {
  const { contact } = siteConfig;
  return (
    <footer className="site-footer" id="direccion" data-theme="dark" aria-labelledby="direccion-title">
      <div className="wrap">
        <div className="footer-head">
          <p className="label reveal">Contacto</p>
          <h2 className="reveal" id="direccion-title">Encuéntranos en <span className="gradient-text">{siteConfig.country}.</span></h2>
        </div>
        <address className="contact-strip reveal" style={{ fontStyle: 'normal' }}>
          <a className="contact-item contact-address" href={contact.address.mapsUrl} target="_blank" rel="noopener noreferrer">
            <span className="ci-icon"><PinIcon /></span>
            <span>
              <span className="label">Visítanos</span>
              <strong>{contact.address.line1}</strong>
              <small>{contact.address.line2} <PanamaFlag /></small>
              <em className="ci-link">Cómo llegar →</em>
            </span>
          </a>
          <a className="contact-item" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <span className="ci-icon"><WhatsAppOutline /></span>
            <span>
              <span className="label">WhatsApp</span>
              <strong>{contact.whatsapp.display}</strong>
              <small>{contact.whatsapp.hours}</small>
            </span>
          </a>
          <a className="contact-item" href={gmailComposeUrl()} target="_blank" rel="noopener noreferrer">
            <span className="ci-icon"><MailIcon /></span>
            <span>
              <span className="label">Escríbenos</span>
              <strong>{contact.email}</strong>
              <small>{contact.emailNote}</small>
            </span>
          </a>
        </address>
        <div className="footer-row">
          <span className="brand"><LogoSphere /><Wordmark /></span>
          <nav aria-label="Redes sociales">
            {siteConfig.social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
            ))}
          </nav>
          <span>© {siteConfig.foundedYear} {siteConfig.name} · Hecho en {siteConfig.country}</span>
        </div>
      </div>
      <div className="giant-mark" aria-hidden="true">SITIIO</div>
    </footer>
  );
}
