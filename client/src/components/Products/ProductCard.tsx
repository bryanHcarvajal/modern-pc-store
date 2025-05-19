import { motion } from 'framer-motion';
import { FaCartPlus, FaInfoCircle } from 'react-icons/fa';

export interface Product {
  id: string;
  name: string;
  type: 'GPU' | 'CPU';
  imageUrl?: string; // Opcional, si tienes imágenes
  price: number;
  specs: string[]; // Ejemplo: ["8 Cores", "16 Threads", "4.7GHz Boost"]
  amdChip?: string; // Ej: "Radeon RX 7800 XT" o "Ryzen 7 7800X3D"
}

interface ProductCardProps {
  product: Product;
  index: number; // Para escalonar animaciones
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  return (
    <motion.div
      className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-amd-red/30 hover:scale-[1.02]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-contain bg-white p-2" />
      ) : (
        <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500 text-lg">Sin Imagen</span>
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full self-start mb-2 ${product.type === 'GPU' ? 'bg-purple-600 text-purple-100' : 'bg-blue-600 text-blue-100'}`}>
          {product.type}
        </span>
        <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
        {product.amdChip && <p className="text-sm text-amd-red mb-3 font-semibold">{product.amdChip}</p>}
        
        <ul className="text-sm text-gray-300 mb-4 space-y-1 list-disc list-inside flex-grow">
          {product.specs.map((spec, i) => <li key={i}>{spec}</li>)}
        </ul>

        <p className="text-3xl font-extrabold text-white mb-4">${product.price.toFixed(2)}</p>

        <div className="mt-auto grid grid-cols-2 gap-3">
            <button className="w-full flex items-center justify-center bg-amd-red text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300">
                <FaCartPlus className="mr-2"/> Añadir
            </button>
            <button className="w-full flex items-center justify-center bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-500 transition duration-300">
                <FaInfoCircle className="mr-2"/> Detalles
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;