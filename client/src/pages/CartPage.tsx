import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiTrash2, FiMinusCircle, FiPlusCircle, FiLoader, FiAlertCircle, FiArrowLeft, FiCreditCard  } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { 
    cart, 
    isLoading: isCartContextLoading,
    error, 
    updateCartItemQuantity, 
    removeItemFromCart, 
    clearCart,
    getCartTotalAmount 
  } = useCart();
  
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false); 
  const navigate = useNavigate();

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (isProcessingAction) return; 

    if (newQuantity < 1) {
        await handleRemoveItem(itemId);
        return;
    }
    setIsProcessingAction(true);
    try {
        await updateCartItemQuantity(itemId, newQuantity);
        toast.success('Cantidad actualizada.');
    } catch (error: any) {
        toast.error(error.message || 'Error al actualizar cantidad.');
        console.error("Error al actualizar cantidad:", error);
    } finally {
        setIsProcessingAction(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (isProcessingAction) return;
    setIsProcessingAction(true);
    const toastId = toast.loading('Eliminando item...');
    try {
        await removeItemFromCart(itemId);
        toast.success('Item eliminado del carrito.', { id: toastId });
    } catch (error: any) {
        toast.error(error.message || 'Error al eliminar item.', { id: toastId });
        console.error("Error al eliminar item:", error);
    } finally {
        setIsProcessingAction(false);
    }
  };
  
  const handleClearCartWithConfirmation = async () => {
    if (isProcessingAction) return;
    setIsProcessingAction(true);
    const toastId = toast.loading('Vaciando carrito...');
    try {
      await clearCart();
      toast.success('Carrito vaciado exitosamente.', { id: toastId });
      setShowClearCartConfirm(false);
    } catch (error: any) {
      toast.error(error.message || 'Error al vaciar el carrito.', { id: toastId });
      setShowClearCartConfirm(false);
      console.error("Error al vaciar carrito:", error);
    } finally {
      setIsProcessingAction(false);
    }
  };

  if (isCartContextLoading && !cart) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex flex-col justify-center items-center text-[var(--color-text-secondary)]">
        <FiLoader className="animate-spin h-12 w-12 mb-4 text-[var(--color-amd-red)]" />
        <p className="text-2xl">Cargando tu carrito...</p>
      </div>
    );
  }

  if (error && !cart) { 
    return (
      <div className="min-h-[calc(100vh-16rem)] flex flex-col justify-center items-center text-center px-6">
        <FiAlertCircle className="h-16 w-16 text-[var(--color-amd-red)] mb-6" />
        <p className="text-2xl font-semibold text-[var(--color-text-primary)] mb-3">Error al cargar el carrito</p>
        <p className="text-md text-[var(--color-text-secondary)]">{error}</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex flex-col justify-center items-center text-center px-6 bg-[var(--color-bg-primary)]">
        <FiShoppingCart className="h-24 w-24 text-[var(--color-text-muted)] mb-8" />
        <h2 className="text-3xl font-semibold text-[var(--color-text-primary)] mb-4">Tu carrito está vacío</h2>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8">
          Parece que no has añadido ningún producto a tu carrito todavía.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center px-8 py-3 bg-[var(--color-amd-red)] text-white text-base font-medium rounded-[var(--border-radius-default)] hover:bg-[var(--color-amd-red-darker)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] focus:ring-[var(--color-amd-red)]"
        >
          Explorar Productos
        </Link>
      </div>
    );
  }

  const totalAmount = getCartTotalAmount();

  return (
    <div className="min-h-screen mt-15 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center">
            <FiShoppingCart className="mr-3 h-8 w-8 text-[var(--color-amd-red)]" />
            Tu Carrito de Compras
          </h1>
          {cart.items.length > 0 && (
            <button
              onClick={() => setShowClearCartConfirm(true)}
              disabled={isProcessingAction || isCartContextLoading}
              className="text-xs sm:text-sm text-[var(--color-text-muted)] hover:text-[var(--color-amd-red)] flex items-center transition-colors disabled:opacity-50 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-text-muted)]/30 px-3 py-1.5 rounded-md"
            >
              <FiTrash2 className="mr-1.5 h-4 w-4" /> Vaciar Carrito
            </button>
          )}
        </div>

        <div className="lg:flex lg:gap-8">
          <div className="lg:w-2/3 space-y-4 mb-8 lg:mb-0">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-start p-4 bg-[var(--color-bg-secondary)] rounded-[var(--border-radius-default)] shadow-lg gap-3 sm:gap-4">
                <Link to={`/products/${item.productId}`} className="flex-shrink-0">
                  <img 
                    src={item.product.imageUrl || 'https://via.placeholder.com/100?text=No+Imagen'}
                    alt={item.product.name} 
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-md bg-white p-1"
                  />
                </Link>
                <div className="flex-grow min-w-0"> 
                  <Link to={`/products/${item.productId}`} className="hover:text-[var(--color-amd-red)] transition-colors">
                    <h3 className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)] line-clamp-2 break-words">{item.product.name}</h3>
                  </Link>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 truncate">{item.product.amdChip || item.product.type}</p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)] mt-2">
                    ${item.priceAtAddition.toFixed(2)} c/u
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2 ml-auto flex-shrink-0">
                  <div className="flex items-center border border-[var(--color-bg-tertiary)] rounded-md">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} 
                      disabled={isProcessingAction || isCartContextLoading}
                      className="p-1.5 sm:p-2 text-[var(--color-text-muted)] hover:text-[var(--color-amd-red)] disabled:opacity-50"
                      aria-label="Reducir cantidad"
                    >
                      <FiMinusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <span className="px-2 text-sm font-medium w-8 text-center tabular-nums">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={isProcessingAction || isCartContextLoading}
                      className="p-1.5 sm:p-2 text-[var(--color-text-muted)] hover:text-[var(--color-amd-red)] disabled:opacity-50"
                      aria-label="Aumentar cantidad"
                    >
                      <FiPlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)]">
                    ${(item.priceAtAddition * item.quantity).toFixed(2)}
                  </p>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isProcessingAction || isCartContextLoading}
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-amd-red)] flex items-center disabled:opacity-50"
                    aria-label="Eliminar item"
                  >
                    <FiTrash2 className="mr-1 h-3 w-3" /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3 p-6 bg-[var(--color-bg-secondary)] rounded-[var(--border-radius-large)] shadow-xl h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-6 border-b border-[var(--color-bg-tertiary)] pb-3">Resumen del Pedido</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Subtotal:</span>
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Envío:</span>
                <span className="font-medium">Gratis (Promoción)</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-[var(--color-bg-tertiary)] mt-3">
                <span className="text-[var(--color-text-primary)]">Total:</span>
                <span className="text-[var(--color-amd-red)]">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              disabled={isCartContextLoading || !cart || cart.items.length === 0}
              className="w-full flex items-center justify-center py-3 px-6 border border-transparent text-base font-medium rounded-[var(--border-radius-default)] text-white bg-[var(--color-amd-red)] hover:bg-[var(--color-amd-red-darker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)] focus:ring-[var(--color-amd-red)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiCreditCard className="mr-2 h-5 w-5" /> 
              Ir a Pagar
            </button>
            <Link 
              to="/products" 
              className="mt-4 w-full flex items-center justify-center py-3 px-6 border border-[var(--color-bg-tertiary)] text-sm font-medium rounded-[var(--border-radius-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Seguir Comprando
            </Link>
          </div>
        </div>

        {showClearCartConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
            <div className="bg-[var(--color-bg-secondary)] p-6 sm:p-8 rounded-[var(--border-radius-large)] shadow-2xl max-w-sm w-full transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow">
              <style>{`
                @keyframes modalShow {
                  to { opacity: 1; transform: scale(1); }
                }
                .animate-modalShow { animation: modalShow 0.3s forwards; }
              `}</style>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">Confirmar Acción</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Esto limpiará tu carrito por completo. ¿Estás seguro?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowClearCartConfirm(false)}
                  className="px-5 py-2 text-sm font-medium rounded-md text-[var(--color-text-secondary)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-text-muted)]/30 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleClearCartWithConfirmation}
                  disabled={isProcessingAction || isCartContextLoading}
                  className="px-5 py-2 text-sm font-medium rounded-md text-white bg-[var(--color-amd-red)] hover:bg-[var(--color-amd-red-darker)] disabled:opacity-50 transition-colors flex items-center justify-center min-w-[80px]"
                >
                  {isProcessingAction && showClearCartConfirm ? <FiLoader className="animate-spin h-5 w-5" /> : 'Aceptar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;