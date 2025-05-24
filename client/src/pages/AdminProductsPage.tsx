import React, { useState, useEffect, useCallback } from 'react';
import type {FormEvent} from 'react';
import type { Product } from '../components/Products/ProductCard'; 
import { useAuth } from '../context/AuthContext';
import { 
    FiPlusCircle, FiEdit, FiTrash2, FiLoader, FiAlertCircle, 
    FiImage, FiPackage, FiDollarSign, FiCpu, FiTag, FiSave, FiXCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import StyledInput from '../components/Forms/StyledInput';

interface ProductFormData {
  id: string; 
  name: string;
  type: 'CPU' | 'GPU';
  amdChip?: string;
  price: string;
  specs: string; 
  imageUrl?: string;
}

const initialFormData: ProductFormData = {
  id: '', 
  name: '',
  type: 'GPU', 
  amdChip: '',
  price: '',
  specs: '',
  imageUrl: '',
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth(); 

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); 
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false); 


  // --- Funciones de API ---
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al cargar productos del servidor.');
      }
      let data: Product[] = await response.json();
      // Asegurar que el precio sea número para el estado local
      data = data.map(p => ({...p, price: typeof p.price === 'string' ? parseFloat(p.price) : p.price }));
      setProducts(data);
    } catch (err: any) {
      const errorMessage = err.message || "No se pudieron cargar los productos. Intenta de nuevo.";
      setError(errorMessage);
      // No mostramos toast aquí para no ser intrusivos al cargar la página, el error se muestra en la UI
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async (productId: string, productName: string) => {
     if (!window.confirm(`¿Estás seguro de que quieres eliminar el producto "${productName}" (ID: ${productId})? Esta acción no se puede deshacer.`)) {
         return;
     }
     if (!token) {
         toast.error("No autenticado para realizar esta acción.");
         return;
     }
     const toastId = toast.loading('Eliminando producto...');
     setIsLoading(true);
     try {
         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${productId}`, {
             method: 'DELETE',
             headers: { 'Authorization': `Bearer ${token}` },
         });
         
         if (response.status === 204) {
            toast.success('Producto eliminado con éxito.', { id: toastId });
         } else {
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Error al eliminar el producto.');
            }
            toast.success(resData.message || 'Producto eliminado con éxito.', { id: toastId });
         }
         fetchProducts(); 
     } catch (err: any) {
         toast.error(err.message || 'Error al eliminar el producto.', { id: toastId });
         console.error("Error deleting product:", err);
     } finally {
        setIsLoading(false);
     }
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateForm = () => {
    setEditingProduct(null); 
    setFormData(initialFormData); 
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id, 
      name: product.name,
      type: product.type,
      amdChip: product.amdChip || '',
      price: product.price.toString(),
      specs: product.specs.join('\n'), 
      imageUrl: product.imageUrl || '',
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("No autenticado para realizar esta acción.");
      return;
    }

    if (!formData.name.trim() || (!editingProduct && !formData.id.trim())) { 
        toast.error("ID (si es nuevo) y Nombre del producto son obligatorios.");
        return;
    }
    const priceNumber = parseFloat(formData.price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
        toast.error("El precio debe ser un número válido mayor que cero.");
        return;
    }
    if (!formData.specs.trim()) {
        toast.error("Debe haber al menos una especificación.");
        return;
    }

    setIsSubmittingForm(true);
    
    const productPayload = {
      ...formData, 
      price: priceNumber,
      specs: formData.specs.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0),
    };



    const url = editingProduct 
      ? `${import.meta.env.VITE_API_BASE_URL}/products/${editingProduct.id}` 
      : `${import.meta.env.VITE_API_BASE_URL}/products`;
    const method = editingProduct ? 'PATCH' : 'POST';
    const successMessage = editingProduct ? 'Producto actualizado con éxito.' : 'Producto creado con éxito.';
    const loadingMessage = editingProduct ? 'Actualizando producto...' : 'Creando producto...';

    const toastId = toast.loading(loadingMessage);

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(productPayload), 
      });
      const resData = await response.json();
      if (!response.ok) {
        const errorMessage = Array.isArray(resData.message) ? resData.message.join('. ') : (resData.message || 'Error desconocido del servidor.');
        throw new Error(errorMessage);
      }
      toast.success(successMessage, { id: toastId });
      setIsFormOpen(false);
      fetchProducts(); 
    } catch (err: any) {
      toast.error(err.message || `Error al ${editingProduct ? 'actualizar' : 'crear'} el producto.`, { id: toastId });
      console.error("Error submitting product form:", err);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // --- Renderizado ---
  if (isLoading && products.length === 0) {
    return ( 
      <div className="min-h-screen flex justify-center items-center bg-[var(--color-bg-primary)]"> 
        <FiLoader className="animate-spin h-12 w-12 text-[var(--color-amd-red)]" /> 
      </div> 
    );
  }

  if (error && products.length === 0) {
    return ( 
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-6 bg-[var(--color-bg-primary)]"> 
        <FiAlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4"/>
        <p className="text-xl text-red-400 mb-4">Error: {error}</p>
        <button 
          onClick={fetchProducts} 
          className="mt-4 px-6 py-2.5 bg-[var(--color-amd-red)] text-white rounded-md hover:bg-[var(--color-amd-red-darker)] text-sm font-medium"
        >
          Reintentar Carga
        </button>
      </div> 
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 mt-25 bg-[var(--color-bg-primary)] min-h-screen text-[var(--color-text-primary)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pt-16 sm:pt-0"> 
          <h1 className="text-3xl lg:text-4xl font-bold flex items-center mb-4 sm:mb-0">
             <FiPackage className="mr-3 h-8 w-8 text-[var(--color-amd-red)]"/>
             Administrar Productos
          </h1>
          <button 
            onClick={openCreateForm} 
            className="w-full sm:w-auto px-5 py-2.5 bg-[var(--color-amd-red)] text-white rounded-[var(--border-radius-default)] hover:bg-[var(--color-amd-red-darker)] flex items-center justify-center text-sm font-medium shadow-lg hover:shadow-md transition-shadow"
          >
             <FiPlusCircle className="mr-2 h-5 w-5"/> Añadir Nuevo Producto
          </button>
        </div>

        {isFormOpen && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" 
            onClick={() => setIsFormOpen(false)}
          >
            <div 
              className="bg-[var(--color-bg-secondary)] p-6 sm:p-8 rounded-[var(--border-radius-large)] shadow-2xl w-full max-w-xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalAppear"
              onClick={(e) => e.stopPropagation()}
            >
              <style>{`
                @keyframes modalAppear { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
                .animate-modalAppear { animation: modalAppear 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
              `}</style>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                  {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
                </h2>
                <button onClick={() => setIsFormOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-full hover:bg-[var(--color-bg-tertiary)]">
                    <FiXCircle className="h-6 w-6"/>
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <StyledInput label="ID del Producto" id="id" name="id" value={formData.id} onChange={handleFormInputChange} placeholder="ej. gpu-rx7900xtx (único)" required Icon={FiTag} disabled={!!editingProduct} />
                <StyledInput label="Nombre del Producto" id="name" name="name" value={formData.name} onChange={handleFormInputChange} placeholder="Nombre completo del producto" required Icon={FiPackage} />
                <div>
                    <label htmlFor="type" className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Tipo</label>
                    <select id="type" name="type" value={formData.type} onChange={handleFormInputChange} required 
                            className="w-full px-4 py-3 text-sm bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-bg-tertiary)] rounded-[var(--border-radius-default)] focus:ring-2 focus:ring-[var(--color-amd-red)] focus:border-[var(--color-amd-red)] outline-none">
                        <option value="GPU">GPU</option>
                        <option value="CPU">CPU</option>
                    </select>
                </div>
                <StyledInput label="Chip AMD (Opcional)" id="amdChip" name="amdChip" value={formData.amdChip} onChange={handleFormInputChange} placeholder="ej. Radeon RX 7900 XTX" Icon={FiCpu} />
                <StyledInput label="Precio" id="price" name="price" type="number" step="0.01" min="0.01" value={formData.price} onChange={handleFormInputChange} placeholder="ej. 999.99" required Icon={FiDollarSign} />
                <div>
                    <label htmlFor="specs" className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Especificaciones (una por línea o separadas por coma)</label>
                    <textarea id="specs" name="specs" value={formData.specs} onChange={handleFormInputChange} rows={3} placeholder="8GB GDDR6
Arquitectura RDNA 3
..." required 
                              className="w-full px-4 py-3 text-sm bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-bg-tertiary)] rounded-[var(--border-radius-default)] focus:ring-2 focus:ring-[var(--color-amd-red)] focus:border-[var(--color-amd-red)] outline-none placeholder:text-[var(--color-text-muted)] resize-y"/>
                </div>
                <StyledInput label="URL de la Imagen (Opcional)" id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleFormInputChange} placeholder="https://ejemplo.com/imagen.png" Icon={FiImage} />
                
                <div className="flex justify-end space-x-3 pt-5 border-t border-[var(--color-bg-tertiary)] mt-6">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 text-sm font-medium rounded-md text-[var(--color-text-secondary)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-text-muted)]/30 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSubmittingForm} className="px-5 py-2.5 text-sm font-medium rounded-md text-white bg-[var(--color-amd-red)] hover:bg-[var(--color-amd-red-darker)] disabled:opacity-60 flex items-center justify-center min-w-[150px]">
                    {isSubmittingForm ? <FiLoader className="animate-spin mr-2 h-5 w-5" /> : (editingProduct ? <FiSave className="mr-2 h-5 w-5"/> : <FiPlusCircle className="mr-2 h-5 w-5"/>)}
                    {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-[var(--color-bg-secondary)] shadow-xl rounded-[var(--border-radius-large)] overflow-x-auto mt-8">
          <table className="min-w-full divide-y divide-[var(--color-bg-tertiary)]">
            <thead className="bg-[var(--color-bg-tertiary)]/50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Imagen</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">ID</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider hidden sm:table-cell">Tipo</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Precio</th>
                <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-bg-tertiary)]">
              {products.length === 0 && !isLoading ? (
                 <tr><td colSpan={6} className="text-center py-10 text-[var(--color-text-muted)]">No hay productos para mostrar. Intenta añadir uno nuevo.</td></tr>
              ) : (
                 products.map((product) => (
                 <tr key={product.id} className="hover:bg-[var(--color-bg-tertiary)]/30 transition-colors">
                   <td className="px-4 py-3">
                     {product.imageUrl ? (
                       <img src={product.imageUrl} alt={product.name} className="h-10 w-10 object-contain rounded bg-white p-0.5" />
                     ) : ( <div className="h-10 w-10 flex items-center justify-center bg-[var(--color-bg-tertiary)] rounded"> <FiImage className="h-5 w-5 text-[var(--color-text-muted)]"/> </div> )}
                   </td>
                   <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--color-text-muted)] font-mono" title={product.id}>{product.id.length > 15 ? product.id.substring(0,12) + '...' : product.id}</td>
                   <td className="px-4 py-3">
                     <div className="text-sm font-medium text-[var(--color-text-primary)] truncate max-w-[150px] sm:max-w-xs" title={product.name}>{product.name}</div>
                     {product.amdChip && <div className="text-xs text-[var(--color-text-muted)] truncate max-w-[150px] sm:max-w-xs">{product.amdChip}</div>}
                   </td>
                   <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--color-text-secondary)] hidden sm:table-cell">{product.type}</td>
                   <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--color-text-primary)] font-semibold">${product.price.toFixed(2)}</td>
                   <td className="px-2 py-3 whitespace-nowrap text-center text-sm font-medium">
                     <div className="flex justify-center items-center space-x-2">
                        <button 
                            onClick={() => openEditForm(product)}
                            className="text-blue-400 hover:text-blue-300 p-1" title="Editar">
                        <FiEdit className="h-4 w-4 sm:h-5 sm:w-5"/>
                        </button>
                        <button 
                            onClick={() => handleDeleteProduct(product.id, product.name)} 
                            className="text-red-500 hover:text-red-400 p-1" title="Eliminar">
                        <FiTrash2 className="h-4 w-4 sm:h-5 sm:w-5"/>
                        </button>
                     </div>
                   </td>
                 </tr>
               ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;