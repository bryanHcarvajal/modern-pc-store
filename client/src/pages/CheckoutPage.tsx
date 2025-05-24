import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiCreditCard, FiLoader, FiAlertCircle, FiPackage, FiShoppingCart, FiArrowLeft } from 'react-icons/fi'; 
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, getCartTotalAmount, clearCart: clearCartContext, isLoading: isCartContextLoading } = useCart();
  const { token, isAuthenticated } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    if (!isCartContextLoading && isAuthenticated) { 
      if (!cart || !cart.items || cart.items.length === 0) {
        toast.error("Tu carrito está vacío. Añade productos antes de proceder al pago.", { duration: 4000 });
        navigate('/products', { replace: true });
      }
    }
  }, [cart, isCartContextLoading, isAuthenticated, navigate]);

  const totalAmount = getCartTotalAmount();

  const handleConfirmPurchase = async () => {
    if (!isAuthenticated) {
        toast.error("Por favor, inicia sesión para completar tu compra.");
        navigate('/login', { state: { from: location } });
        return;
    }
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error("Tu carrito está vacío.");
      return;
    }

    setIsProcessingOrder(true);
    setOrderError(null);
    const toastId = toast.loading('Procesando tu pedido...');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(data.message) ? data.message.join('. ') : data.message;
        throw new Error(errorMessage || 'No se pudo procesar el pedido.');
      }

      await clearCartContext(); 
      toast.success('¡Pedido realizado con éxito!', { id: toastId, duration: 4000 });
      
      const orderId = data.id || (data.order && data.order.id) || 'nuevo'; 
      navigate(`/order-confirmation/${orderId}`, { replace: true });

    } catch (err: any) {
      console.error("Error al confirmar la compra:", err);
      setOrderError(err.message || 'Ocurrió un error al procesar tu pedido.');
      toast.error(err.message || 'Error al procesar el pedido.', { id: toastId });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (isCartContextLoading && !cart) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center text-[var(--color-text-secondary)]">
        <FiLoader className="animate-spin h-12 w-12 mb-4 text-[var(--color-amd-red)]" />
        <p className="text-2xl">Cargando checkout...</p>
      </div>
    );
  }
  
  if (!cart || !cart.items || cart.items.length === 0) {
      return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center text-center px-6 bg-[var(--color-bg-primary)]">
          <FiShoppingCart className="h-24 w-24 text-[var(--color-text-muted)] mb-8" />
          <h2 className="text-3xl font-semibold text-[var(--color-text-primary)] mb-4">Tu carrito está vacío</h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-8">
            Redirigiendo a la página de productos...
          </p>
        </div>
      );
  }

  return (
    <div className="min-h-screen mt-15 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <FiCreditCard className="mx-auto h-12 w-12 text-[var(--color-amd-red)] mb-4" />
          <h1 className="text-4xl font-extrabold">Checkout</h1>
          <p className="mt-2 text-lg text-[var(--color-text-secondary)]">Revisa tu pedido y confirma la compra.</p>
        </div>

        <div className="bg-[var(--color-bg-secondary)] shadow-xl rounded-[var(--border-radius-large)] p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 border-b border-[var(--color-bg-tertiary)] pb-3">Resumen de tu Pedido</h2>
          
          <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
            {cart.items.map(item => (
              <div key={item.id} className="flex items-center text-sm py-3 border-b border-[var(--color-bg-tertiary)] border-opacity-50 last:border-b-0">
                <img 
                  src={item.product.imageUrl || 'https://via.placeholder.com/60?text=N/A'} 
                  alt={item.product.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-md bg-white p-1 mr-4 flex-shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <span className="font-medium text-[var(--color-text-primary)] block truncate">{item.product.name}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">Cantidad: {item.quantity}</span>
                </div>
                <span className="font-medium text-[var(--color-text-primary)] ml-auto whitespace-nowrap flex-shrink-0">
                  ${(item.priceAtAddition * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm pt-4 border-t border-[var(--color-bg-tertiary)]">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Subtotal:</span>
              <span className="font-medium">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Envío:</span>
              <span className="font-medium">Gratis</span>
            </div>
            <div className="flex justify-between text-xl font-bold mt-2">
              <span className="text-[var(--color-text-primary)]">Total a Pagar:</span>
              <span className="text-[var(--color-amd-red)]">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {orderError && (
            <div className="my-6 p-4 bg-red-500/10 border border-red-500/30 rounded-md text-center">
                <div className="flex items-center justify-center text-red-400">
                    <FiAlertCircle className="h-5 w-5 mr-2" />
                    <p className="text-sm ">{orderError}</p>
                </div>
            </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleConfirmPurchase}
            disabled={isProcessingOrder || isCartContextLoading || !cart || cart.items.length === 0}
            className="w-full flex items-center justify-center py-3.5 px-6 border border-transparent text-base font-semibold rounded-[var(--border-radius-default)] text-white bg-[var(--color-amd-red)] hover:bg-[var(--color-amd-red-darker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] focus:ring-[var(--color-amd-red)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isProcessingOrder ? (
              <FiLoader className="animate-spin h-5 w-5 mr-3" />
            ) : (
              <FiPackage className="h-5 w-5 mr-3" />
            )}
            Confirmar Compra y Pagar (Simulado)
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link to="/cart" className="text-sm font-medium text-[var(--color-amd-red)] hover:text-[var(--color-amd-red-darker)] inline-flex items-center">
            <FiArrowLeft className="mr-1 h-4 w-4" /> Volver al Carrito
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;