import { Link } from 'react-router-dom';
import { SiAmd } from 'react-icons/si';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: "https://github.com", icon: FaGithub, label: "GitHub" },
    { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
    { href: "https://twitter.com", icon: FaTwitter, label: "Twitter" },
  ];

  return (
    <footer className="bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] border-t border-[var(--color-bg-tertiary)]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Logo e Info */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center justify-center md:justify-start mb-3">
              <SiAmd className="h-7 w-7 text-[var(--color-amd-red)]" />
              <span className="ml-2 text-lg font-semibold">
                <span className="text-[var(--color-amd-red)]">AMD</span>
                <span className="text-[var(--color-text-primary)]"> PCStore</span>
              </span>
            </Link>
            <p className="text-sm">
              Tu destino para los componentes AMD más avanzados.
            </p>
            <p className="text-xs">© {currentYear} AMD PCStore. Todos los derechos reservados.</p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] tracking-wider uppercase mb-4">
              Navegación
            </h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-[var(--color-amd-red)] transition-colors">Inicio</Link></li>
              <li><Link to="/products" className="text-sm hover:text-[var(--color-amd-red)] transition-colors">Productos</Link></li>
              <li><a href="#" className="text-sm hover:text-[var(--color-amd-red)] transition-colors">Soporte</a></li>
              <li><a href="#" className="text-sm hover:text-[var(--color-amd-red)] transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] tracking-wider uppercase mb-4">
              Síguenos
            </h3>
            <div className="flex justify-center md:justify-start space-x-5">
              {socialLinks.map(social => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-amd-red)] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-bg-tertiary)] pt-8 text-center text-xs">
          <p>
            Diseñado con <span className="text-[var(--color-amd-red)]">❤</span> y la última tecnología web.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;