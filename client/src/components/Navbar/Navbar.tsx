import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SiAmd } from 'react-icons/si';
import { FiMenu, FiX, FiLogIn, FiUserPlus, FiLogOut, FiUser, FiHome, FiBox, FiShield} from 'react-icons/fi'; 
import { useAuth, UserRole } from '../../context/AuthContext';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext'; 
import type { IconType } from 'react-icons';

interface NavItem {
  name: string;
  path?: string;
  action?: () => void;
  icon?: IconType;
  isButton?: boolean;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth();
  const { getTotalItems, isLoading: isCartContextLoading } = useCart(); 
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinkBaseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out flex items-center";
  const navLinkActiveClasses = "bg-[var(--color-amd-red)] text-[var(--color-text-primary)] hover:bg-[var(--color-amd-red-darker)]"; 
  const navLinkInactiveClasses = "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]";

  const getNavLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `${navLinkBaseClasses} ${isActive ? navLinkActiveClasses : navLinkInactiveClasses}`;
  
  const getMobileNavLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ease-in-out flex items-center ${isActive ? navLinkActiveClasses : navLinkInactiveClasses}`;

  let navItemsToDisplay: NavItem[] = [
    { name: 'Inicio', path: '/', icon: FiHome },
    { name: 'Productos', path: '/products', icon: FiBox },
  ];

  const totalCartItems = getTotalItems();

       if (!isAuthLoading) { 
        if (isAuthenticated && user) {
          navItemsToDisplay.push(
            { name: user.firstName || user.email.split('@')[0] || 'Mi Cuenta', path: '/cuenta', icon: FiUser },
          );
          if (user.roles && user.roles.includes(UserRole.ADMIN)) { 
            navItemsToDisplay.push({ name: 'Admin Productos', path: '/admin/products', icon: FiShield });
          }
          navItemsToDisplay.push(
            { name: 'Cerrar Sesión', action: handleLogout, icon: FiLogOut, isButton: true }
          );
        } else {
          
      navItemsToDisplay.push(
        { name: 'Login', path: '/login', icon: FiLogIn },
        { name: 'Registro', path: '/register', icon: FiUserPlus }
      );
    }
  }

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out 
                  ${isScrolled || mobileMenuOpen
                      ? 'bg-[var(--color-bg-secondary)]/95 shadow-lg backdrop-blur-sm' 
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

          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-1 lg:space-x-2"> 
              {navItemsToDisplay.map((item) =>
                item.isButton && item.action ? (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className={`${navLinkBaseClasses} ${navLinkInactiveClasses}`} 
                  >
                    {item.icon && <item.icon className="mr-1.5 h-4 w-4" />}
                    {item.name}
                  </button>
                ) : (
                  <NavLink
                    key={item.name}
                    to={item.path!} 
                    className={getNavLinkClasses}
                  >
                    {item.icon && <item.icon className="mr-1.5 h-4 w-4" />}
                    {item.name}
                  </NavLink>
                )
              )}
            </div>

            {!isAuthLoading && isAuthenticated && ( 
              <Link 
                to="/cart" 
                className={`${navLinkBaseClasses} ${navLinkInactiveClasses} ml-4 relative`}
                aria-label="Ver carrito"
              >
                <FiShoppingCart className="h-5 w-5" />
                {!isCartContextLoading && totalCartItems > 0 && ( 
                  <span className="absolute -top-1.5 -right-2 bg-[var(--color-amd-red)] text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center p-0.5 leading-none">
                    {totalCartItems > 9 ? '9+' : totalCartItems}
                  </span>
                )}
              </Link>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-[var(--color-bg-tertiary)]/50 inline-flex items-center justify-center p-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-amd-red)]"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              {mobileMenuOpen ? <FiX className="block h-6 w-6" /> : <FiMenu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--color-bg-secondary)]/95 backdrop-blur-sm pb-2" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItemsToDisplay.map((item) =>
              item.isButton && item.action ? (
                <button
                  key={item.name}
                  onClick={() => { item.action!(); setMobileMenuOpen(false); }}
                  className={`w-full text-left ${getMobileNavLinkClasses({ isActive: false })}`}
                >
                  {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                  {item.name}
                </button>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.path!}
                  className={getMobileNavLinkClasses}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                  {item.name}
                </NavLink>
              )
            )}
            
            {!isAuthLoading && isAuthenticated && (
              <NavLink
                to="/cart"
                className={getMobileNavLinkClasses}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiShoppingCart className="mr-2 h-5 w-5" />
                Carrito
                {!isCartContextLoading && totalCartItems > 0 && (
                  <span className="ml-auto bg-[var(--color-amd-red)] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCartItems > 9 ? '9+' : totalCartItems}
                  </span>
                )}
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;