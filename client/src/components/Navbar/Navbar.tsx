import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiAmd } from 'react-icons/si';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
     ${
       isActive
         ? 'bg-[var(--color-amd-red)] text-[var(--color-text-primary)]'
         : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]'
     }`;

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/products' },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out 
                  ${
                    isScrolled || mobileMenuOpen
                      ? 'bg-[var(--color-bg-secondary)]/90 shadow-lg backdrop-blur-sm'
                      : 'bg-transparent'
                  }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <SiAmd className="h-8 w-8 md:h-10 md:w-10 text-[var(--color-amd-red)]" />
            <span className="ml-2 md:ml-3 text-xl md:text-2xl font-bold">
              <span className="text-[var(--color-amd-red)]">AMD</span>
              <span className="text-[var(--color-text-primary)]"> PCStore</span>
            </span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={navLinkClasses}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-[var(--color-bg-tertiary)]/50 inline-flex items-center justify-center p-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-amd-red)]"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              {mobileMenuOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--color-bg-secondary)]/95 backdrop-blur-sm" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ease-in-out
                   ${
                     isActive
                       ? 'bg-[var(--color-amd-red)] text-[var(--color-text-primary)]'
                       : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]'
                   }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;