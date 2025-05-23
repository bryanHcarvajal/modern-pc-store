import { Link, useParams } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiShoppingBag } from 'react-icons/fi';

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="min-h-screen mt-15 flex flex-col items-center justify-center bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] py-12 px-4 sm:px-6 lg:px-8 text-center">
      <FiCheckCircle className="h-24 w-24 text-green-500 mb-6" />
      <h1 className="text-4xl font-extrabold mb-3">¡Gracias por tu compra!</h1>
      <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-md">
        Tu pedido ha sido procesado y está siendo preparado.
        {orderId && orderId !== 'nuevo' && ` El ID de tu pedido es: #${orderId.substring(0,8)}...`}
      </p>


      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link
          to="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-[var(--color-amd-red)] text-white text-base font-medium rounded-[var(--border-radius-default)] hover:bg-[var(--color-amd-red-darker)] transition-colors"
        >
          <FiShoppingBag className="mr-2 h-5 w-5" />
          Seguir Comprando
        </Link>
        <Link
          to="/cuenta" 
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-base font-medium rounded-[var(--border-radius-default)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <FiPackage className="mr-2 h-5 w-5" />
          Ver Mis Pedidos
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;