// client/src/components/Products/ProductCard.tsx
import { motion } from 'framer-motion';
import { FaCartPlus, FaInfoCircle } from 'react-icons/fa'; // O los íconos que prefieras

// Asegúrate que esta interfaz coincida con la del backend y la usada en ProductsPage
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
  index: number; // Para escalonar animaciones si las tienes
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, delay: index * 0.07 } 
    },
  };

  return (
    <motion.div
      className="bg-[var(--color-bg-secondary)] rounded-[var(--border-radius-large)] shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[var(--color-amd-red)]/40 hover:scale-[1.03]"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true, amount: 0.1 }} // Para que la animación se dispare al entrar en vista si está dentro de un scroll
    >
      <div className="w-full h-52 bg-white p-2 flex items-center justify-center overflow-hidden"> {/* Fondo blanco para que los logos se vean bien */}
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-110" // group-hover necesita un 'group' en el div padre de la imagen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-tertiary)]">
            <span className="text-[var(--color-text-muted)] text-lg">Sin Imagen</span>
          </div>
        )}
      </div>

      <div className="p-5 md:p-6 flex flex-col flex-grow">
        <span 
          className={`text-xs font-semibold px-2.5 py-1 rounded-full self-start mb-3
                      ${product.type === 'GPU' ? 'bg-purple-600/20 text-purple-400' : 'bg-sky-600/20 text-sky-400'}`}
        >
          {product.type}
        </span>
        <h3 className="text-lg md:text-xl font-bold text-[var(--color-text-primary)] mb-1 leading-tight min-h-[2.5em] line-clamp-2"> {/* min-h para altura consistente, line-clamp para multilínea */}
          {product.name}
        </h3>
        {product.amdChip && (
          <p className="text-xs text-[var(--color-amd-red)] mb-3 font-medium">
            {product.amdChip}
          </p>
        )}
        
        <ul className="text-xs text-[var(--color-text-secondary)] mb-4 space-y-1 list-disc list-inside flex-grow min-h-[4.5em]"> {/* min-h para specs */}
          {product.specs.slice(0, 3).map((spec, i) => <li key={i} className="truncate">{spec}</li>)} {/* Mostrar solo las primeras 3 specs y truncar */}
        </ul>

        <p className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] mb-5">
          ${product.price.toFixed(2)}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-3">
            <button className="w-full flex items-center justify-center bg-[var(--color-amd-red)] text-white px-3 py-2.5 rounded-[var(--border-radius-default)] text-sm font-semibold hover:bg-[var(--color-amd-red-darkest)] transition duration-300">
                <FaCartPlus className="mr-2 h-4 w-4"/> Añadir
            </button>
            <button className="w-full flex items-center justify-center bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] px-3 py-2.5 rounded-[var(--border-radius-default)] text-sm font-semibold hover:bg-[var(--color-text-muted)] hover:text-[var(--color-bg-primary)] transition duration-300">
                <FaInfoCircle className="mr-2 h-4 w-4"/> Detalles
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;