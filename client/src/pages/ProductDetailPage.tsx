import { useState, useEffect } from 'react'; 
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'; 
import type { Product } from '../components/Products/ProductCard'; 
import { FiLoader, FiAlertTriangle, FiShoppingCart, FiChevronLeft, FiCpu, FiGitMerge, FiImage } from 'react-icons/fi'; 
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext'; 
import toast from 'react-hot-toast'; 

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>(); 
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProductDetails, setLoadingProductDetails] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);

  const { addToCart, isLoading: isCartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!productId) {
      setError("ID de producto no encontrado en la URL.");
      setLoadingProductDetails(false);
      return;
    }

    const fetchProductDetails = async () => {
      setLoadingProductDetails(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(`Error ${response.status}: ${errorData.message || 'No se pudo cargar el producto.'}`);
        }
        const data: Product = await response.json();
        if (typeof data.price === 'string') { 
            data.price = parseFloat(data.price);
        }
        setProduct(data);
      } catch (err: any) {
        console.error(`Error al obtener detalles del producto ${productId}:`, err);
        setError(err.message || "Ocurrió un error desconocido.");
      } finally {
        setLoadingProductDetails(false);
      }
    };

    fetchProductDetails();
  }, [productId]); 

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Inicia sesión para añadir al carrito.");
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!product) return;

    const toastId = toast.loading('Añadiendo al carrito...');
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} añadido al carrito!`, { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Error al añadir el producto.", { id: toastId });
      console.error("Error al añadir al carrito desde ProductDetail:", error);
    }
  };


  if (loadingProductDetails) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center text-[var(--color-text-secondary)]">
        <FiLoader className="animate-spin h-12 w-12 mb-4" />
        <p className="text-2xl">Cargando detalles del producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center text-center px-6">
        <FiAlertTriangle className="h-16 w-16 text-[var(--color-amd-red)] mb-6" />
        <p className="text-2xl font-semibold text-[var(--color-text-primary)] mb-3">¡Oops! Algo salió mal</p>
        <p className="text-md text-[var(--color-text-secondary)] mb-2">{error}</p>
        <Link 
          to="/products" 
          className="mt-6 px-6 py-2 bg-[var(--color-amd-red)] text-white font-semibold rounded-[var(--border-radius-default)] hover:bg-[var(--color-amd-red-darker)] transition-colors"
        >
          Volver a Productos
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex justify-center items-center">
        <p className="text-2xl text-[var(--color-text-secondary)]">Producto no encontrado.</p>
      </div>
    );
  }

  const ProductIcon = product.type === 'CPU' ? FiCpu : FiGitMerge; 

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] pt-24 mt-10 md:pt-28 px-4 sm:px-6 lg:px-8"> 
      <div className="max-w-4xl mx-auto pb-12 md:pb-16"> 
        <div className="mb-8"> 
          <Link 
            to="/products" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-[var(--border-radius-default)] shadow-sm text-white bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-text-muted)]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] focus:ring-[var(--color-amd-red)] transition-colors"
          >
            <FiChevronLeft className="h-5 w-5 mr-2 -ml-1" /> 
            Volver a Productos
          </Link>
        </div>

        <div className="bg-[var(--color-bg-secondary)] shadow-2xl rounded-[var(--border-radius-large)] overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-white p-6 md:p-8 flex items-center justify-center">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={`Imagen de ${product.name}`} 
                  className="max-w-full max-h-[300px] md:max-h-[400px] object-contain"
                />
              ) : (
                <div className="w-full h-[300px] md:h-[400px] flex flex-col items-center justify-center text-center text-[var(--color-text-muted)] bg-[var(--color-bg-primary)]">
                  <FiImage className="w-24 h-24 mb-2 opacity-50" /> 
                  <span>Imagen no disponible</span>
                </div>
              )}
            </div>

            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <span 
                  className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full self-start mb-3
                              ${product.type === 'GPU' ? 'bg-purple-600/20 text-purple-300' : 'bg-sky-600/20 text-sky-300'}`}
                >
                  <ProductIcon className="h-4 w-4 mr-1.5" />
                  {product.type}
                </span>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)] mb-2">
                  {product.name}
                </h1>
                {product.amdChip && (
                  <p className="text-md text-[var(--color-amd-red)] font-semibold mb-4">
                    {product.amdChip}
                  </p>
                )}
                <p className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-6">
                  ${product.price.toFixed(2)}
                </p>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Especificaciones:</h3>
                  <ul className="space-y-1.5 text-sm text-[var(--color-text-secondary)] list-disc list-inside pl-1">
                    {product.specs.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={isCartLoading || loadingProductDetails}
                  className={`w-full flex items-center justify-center py-3 px-6 border border-transparent text-base font-medium rounded-[var(--border-radius-default)] text-white bg-[var(--color-amd-red)] hover:bg-[var(--color-amd-red-darker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)] focus:ring-[var(--color-amd-red)] transition-colors 
                              ${isCartLoading || loadingProductDetails ? 'opacity-60 cursor-not-allowed' : ''}
                              ${!isAuthenticated ? 'opacity-60 cursor-not-allowed' : ''}`} 
                >
                  <FiShoppingCart className="h-5 w-5 mr-2" />
                  {isCartLoading ? 'Añadiendo...' : 'Añadir al Carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;