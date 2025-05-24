import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FiUser, FiMail, FiShoppingCart, 
  FiLogOut, FiChevronDown, FiChevronUp, 
  FiLoader, FiAlertCircle, FiImage 
} from 'react-icons/fi';

interface OrderItemProduct {
  id: string;
  name: string;
  imageUrl?: string;
  price: number; 
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number; 
  product?: OrderItemProduct; 
}

interface Order {
  id: string;
  totalAmount: number;
  status: string; 
  createdAt: string; 
  items: OrderItem[];
}


const AccountPage = () => {
  const { user, logout, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true); 
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user && token) {
      const fetchOrders = async () => {
        setIsLoadingOrders(true);
        setOrdersError(null);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Error al cargar el historial de compras.' }));
            throw new Error(errorData.message || 'Error al cargar el historial de compras.');
          }
          const data: Order[] = await response.json();
          
          const formattedData = data.map(order => ({
              ...order,
              totalAmount: parseFloat(order.totalAmount as any),
              items: order.items.map(item => ({
                  ...item,
                  priceAtPurchase: parseFloat(item.priceAtPurchase as any),

              }))
          }));
          setOrders(formattedData);
        } catch (err: any) {
          setOrdersError(err.message);
          console.error("Error fetching orders:", err);
        } finally {
          setIsLoadingOrders(false);
        }
      };
      fetchOrders();
    } else {
        setIsLoadingOrders(false); 
    }
  }, [user, token]);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (!user) { 
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <FiLoader className="animate-spin h-10 w-10 text-[var(--color-amd-red)]" />
      </div>
    );
  }

  return (
    <div className="mt-10 min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <FiUser className="mx-auto h-16 w-16 text-[var(--color-amd-red)] p-3 bg-[var(--color-bg-secondary)] rounded-full shadow-lg mb-4" />
          <h1 className="text-4xl font-extrabold ">
            ¡Hola, {user.firstName || user.email.split('@')[0]}!
          </h1>
          <p className="mt-2 text-lg text-[var(--color-text-secondary)]">
            Administra la información de tu cuenta y tus preferencias.
          </p>
        </div>

        <div className="space-y-10">
          <section className="bg-[var(--color-bg-secondary)] shadow-xl rounded-[var(--border-radius-large)] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-6 border-b border-[var(--color-bg-tertiary)] pb-3 text-[var(--color-amd-red)]">
              Información Personal
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center">
                <FiUser className="h-5 w-5 mr-3 text-[var(--color-text-muted)]" />
                <span className="font-medium text-[var(--color-text-secondary)] w-28 flex-shrink-0">Nombre:</span>
                <span className="truncate">{user.firstName || 'No especificado'}</span>
              </div>
              <div className="flex items-center">
                <FiUser className="h-5 w-5 mr-3 text-[var(--color-text-muted)]" />
                <span className="font-medium text-[var(--color-text-secondary)] w-28 flex-shrink-0">Apellido:</span>
                <span className="truncate">{user.lastName || 'No especificado'}</span>
              </div>
              <div className="flex items-center">
                <FiMail className="h-5 w-5 mr-3 text-[var(--color-text-muted)]" />
                <span className="font-medium text-[var(--color-text-secondary)] w-28 flex-shrink-0">Email:</span>
                <span className="truncate">{user.email}</span>
              </div>
               <div className="flex items-center">
                <FiUser className="h-5 w-5 mr-3 text-[var(--color-text-muted)]" /> {/* Icono genérico */}
                <span className="font-medium text-[var(--color-text-secondary)] w-28 flex-shrink-0">ID Usuario:</span>
                <span className="text-xs truncate">{user.id}</span>
              </div>
            </div>
          </section>

          <section className="bg-[var(--color-bg-secondary)] shadow-xl rounded-[var(--border-radius-large)] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-6 border-b border-[var(--color-bg-tertiary)] pb-3 text-[var(--color-amd-red)] flex items-center">
              <FiShoppingCart className="mr-3 h-6 w-6" /> Historial de Compras
            </h2>
            {isLoadingOrders && (
              <div className="flex justify-center items-center py-8">
                <FiLoader className="animate-spin h-8 w-8 text-[var(--color-amd-red)]" />
                <p className="ml-3 text-[var(--color-text-secondary)]">Cargando tus pedidos...</p>
              </div>
            )}
            {ordersError && !isLoadingOrders && (
              <div className="p-4 bg-red-900/30 border border-red-700 rounded-md text-center">
                <FiAlertCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-400">{ordersError}</p>
              </div>
            )}
            {!isLoadingOrders && !ordersError && orders.length === 0 && (
              <p className="text-center text-[var(--color-text-muted)] py-6">No has realizado ninguna compra todavía.</p>
            )}
            {!isLoadingOrders && !ordersError && orders.length > 0 && (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border border-[var(--color-bg-tertiary)] rounded-[var(--border-radius-default)] overflow-hidden">
                    <button 
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="w-full flex justify-between items-center p-4 hover:bg-[var(--color-bg-tertiary)]/30 transition-colors focus:outline-none"
                      aria-expanded={expandedOrder === order.id}
                      aria-controls={`order-details-${order.id}`}
                    >
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">Pedido #{order.id.substring(0, 8)}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          Fecha: {new Date(order.createdAt).toLocaleDateString()} | Total: <span className="font-medium text-[var(--color-amd-red)]">${order.totalAmount.toFixed(2)}</span> | Estado: {order.status}
                        </p>
                      </div>
                      {expandedOrder === order.id ? <FiChevronUp className="h-5 w-5" /> : <FiChevronDown className="h-5 w-5" />}
                    </button>
                    {expandedOrder === order.id && (
                      <div id={`order-details-${order.id}`} className="p-4 border-t border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)]/30">
                        <h4 className="text-xs font-semibold mb-3 text-[var(--color-text-secondary)] uppercase tracking-wider">Items del Pedido:</h4>
                        {order.items && order.items.length > 0 ? (
                          <ul className="space-y-3">
                            {order.items.map(item => (
                              <li key={item.id} className="flex items-center justify-between text-xs py-1.5">
                                <div className="flex items-center min-w-0 flex-grow mr-2">
                                  {item.product && item.product.imageUrl ? (
                                    <img 
                                      src={item.product.imageUrl} 
                                      alt={item.productName || 'Imagen del producto'} 
                                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded mr-3 bg-white p-0.5 flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-700 rounded mr-3 flex-shrink-0">
                                      <FiImage className="w-5 h-5 text-gray-500" />
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-grow">
                                    <p className="text-[var(--color-text-primary)] font-medium truncate" title={item.productName}>
                                      {item.productName || 'Nombre no disponible'}
                                    </p>
                                    <p className="text-[var(--color-text-muted)]">
                                      Cant: {item.quantity} x ${item.priceAtPurchase.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-semibold text-[var(--color-text-primary)] whitespace-nowrap flex-shrink-0">
                                  ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-[var(--color-text-muted)]">No hay items detallados para este pedido.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>


        </div>

        <div className="mt-12 text-center">
          <button
            onClick={logout}
            className="group inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-[var(--border-radius-default)] text-white bg-[var(--color-amd-red)] hover:bg-[var(--color-amd-red-darker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] focus:ring-[var(--color-amd-red)] transition-colors"
          >
            <FiLogOut className="h-5 w-5 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;