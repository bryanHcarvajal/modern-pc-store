import { motion } from 'framer-motion';
import { FaCartPlus } from 'react-icons/fa'; 
import { FiImage } from 'react-icons/fi'; 
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export interface Product {
  id: string;
  name: string;
  type: 'GPU' | 'CPU';
  amdChip?: string;
  price: number;
  specs: string[];
  imageUrl?: string;
}

interface ProductCardProps {
  product: Product;
  index: number; 
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addToCart, isLoading: isCartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate(); 
  const location = useLocation(); 

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, delay: index * 0.07 } 
    },
  };

    const numericPrice = typeof product.price === 'string' 
    ? parseFloat(product.price) 
    : (typeof product.price === 'number' ? product.price : 0); 

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Inicia sesión para añadir al carrito.");
      navigate('/login', { state: { from: location } });
      return;
    }
    
    const toastId = toast.loading('Añadiendo al carrito...');
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} añadido al carrito!`, { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Error al añadir el producto.", { id: toastId });
      console.error("Error al añadir al carrito desde ProductCard:", error);
    }
  };
  
  return (
    <motion.div
      className="bg-[var(--color-bg-secondary)] rounded-[var(--border-radius-large)] shadow-xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-[var(--color-amd-red)]/40 hover:scale-[1.03]"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <Link to={`/products/${product.id}`} className="block hover:opacity-90 transition-opacity">
        <div className="w-full h-52 sm:h-56 bg-white p-3 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={`Imagen de ${product.name}`} 
              className="max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center text-[var(--color-text-muted)] bg-[var(--color-bg-primary)] p-4">
              <FiImage className="w-16 h-16 mb-2 opacity-50" />
              <span className="text-xs">Imagen no disponible</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 md:p-6 flex flex-col flex-grow">
        <span 
          className={`text-xs font-semibold px-2.5 py-1 rounded-full self-start mb-3
                      ${product.type === 'GPU' ? 'bg-purple-600/20 text-purple-400' : 'bg-sky-600/20 text-sky-400'}`}
        >
          {product.type}
        </span>
        
        <Link to={`/products/${product.id}`} className="hover:text-[var(--color-amd-red)] transition-colors">
          <h3 className="text-lg md:text-xl font-bold text-[var(--color-text-primary)] mb-1 leading-tight min-h-[2.5em] line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.amdChip && (
          <p className="text-xs text-[var(--color-amd-red)] mb-3 font-medium">
            {product.amdChip}
          </p>
        )}
        
        <ul className="text-xs text-[var(--color-text-secondary)] mb-4 space-y-1 list-disc list-inside flex-grow min-h-[4.5em]">
          {product.specs.slice(0, 3).map((spec, i) => <li key={i} className="truncate">{spec}</li>)}
        </ul>

        <p className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] mb-5">
          ${numericPrice.toFixed(2)}
        </p>

        <div className="mt-auto">
            <button 
              onClick={handleAddToCart}
              disabled={isCartLoading} 
              className={`w-full flex items-center justify-center bg-[var(--color-amd-red)]  text-white px-3 py-2.5 rounded-[var(--border-radius-default)] text-sm font-semibold hover:bg-[var(--color-amd-red-darker)] transition duration-300 
                          ${isCartLoading ? 'opacity-60 cursor-not-allowed' : ''}
                          ${!isAuthenticated ? 'opacity-60 cursor-not-allowed' : ''}`} 
            >
                <FaCartPlus className="mr-2 h-4 w-4"/> 
                {isCartLoading ? 'Añadiendo...' : 'Añadir al Carrito'}
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;