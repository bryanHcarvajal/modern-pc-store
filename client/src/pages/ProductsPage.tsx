import { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/Products/ProductCard'; 
import type { Product } from '../components/Products/ProductCard'; 
import { FiSearch, FiLoader, FiAlertTriangle } from 'react-icons/fi'; 
import { useLocation} from 'react-router-dom';

type ProductTypeFilter = 'ALL' | 'CPU' | 'GPU';

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation(); 
  const getInitialTypeFilter = (): ProductTypeFilter => {
    const params = new URLSearchParams(location.search);
    const typeFromQuery = params.get('type')?.toUpperCase();
    if (typeFromQuery === 'CPU' || typeFromQuery === 'GPU') {
      return typeFromQuery as ProductTypeFilter;
    }
    return 'ALL';
  };
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<ProductTypeFilter>(getInitialTypeFilter());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeFromQuery = params.get('type')?.toUpperCase();
    if (typeFromQuery === 'CPU' || typeFromQuery === 'GPU') {
      if (typeFilter !== typeFromQuery) { 
        setTypeFilter(typeFromQuery as ProductTypeFilter);
      }
    } else {
      if (typeFilter !== 'ALL') { 
        setTypeFilter('ALL');
      }
    }
  }, [location.search]); 
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(`Error ${response.status}: ${errorData.message || 'No se pudieron cargar los productos'}`);
        }
        const data: Product[] = await response.json();
        setAllProducts(data);
      } catch (err: any) {
        console.error("Error al obtener los productos:", err);
        setError(err.message || "Ocurrió un error desconocido al cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];
    if (typeFilter !== 'ALL') {
      products = products.filter(product => product.type === typeFilter);
    }
    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      products = products.filter(product =>
        product.name.toLowerCase().includes(lowerSearchTerm) ||
        (product.amdChip && product.amdChip.toLowerCase().includes(lowerSearchTerm))
      );
    }
    return products;
  }, [allProducts, typeFilter, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilterChange = (filter: ProductTypeFilter) => {
    setTypeFilter(filter);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-16rem)] text-[var(--color-text-secondary)]">
        <FiLoader className="animate-spin h-12 w-12 mb-4" />
        <p className="text-2xl">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-16rem)] text-center px-6">
        <FiAlertTriangle className="h-16 w-16 text-[var(--color-amd-red)] mb-6" />
        <p className="text-2xl font-semibold text-[var(--color-text-primary)] mb-3">¡Oops! Algo salió mal</p>
        <p className="text-md text-[var(--color-text-secondary)] mb-2">{error}</p>

      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg-primary)] py-16 mt-10 md:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)]">
            Nuestros <span className="text-[var(--color-amd-red)]">Productos</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-[var(--color-text-secondary)]">
            Encuentra los componentes AMD perfectos para potenciar tu próxima build.
          </p>
        </div>

        <div className="mb-10 md:mb-12 p-4 sm:p-6 bg-[var(--color-bg-secondary)] rounded-[var(--border-radius-large)] shadow-xl sticky top-20 z-30 backdrop-blur-md bg-opacity-80"> 
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            <div className="relative w-full sm:flex-grow">
              <input
                type="text"
                placeholder="Buscar por nombre o modelo (ej. Ryzen 7, RX 7800XT)..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 text-sm bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-bg-tertiary)] rounded-[var(--border-radius-default)] focus:ring-2 focus:ring-[var(--color-amd-red)] focus:border-[var(--color-amd-red)] outline-none placeholder:text-[var(--color-text-muted)] transition-colors"
              />
              <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)] pointer-events-none" />
            </div>

            <div className="flex-shrink-0 w-full sm:w-auto flex justify-center space-x-2 sm:space-x-3">
              {(['ALL', 'CPU', 'GPU'] as ProductTypeFilter[]).map((filterValue) => (
                <button
                  key={filterValue}
                  onClick={() => handleTypeFilterChange(filterValue)}
                  className={`flex-grow sm:flex-grow-0 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-[var(--border-radius-default)] transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)] focus:ring-[var(--color-amd-red)]
                    ${typeFilter === filterValue 
                      ? 'bg-[var(--color-amd-red)] text-white shadow-md hover:bg-[var(--color-amd-red-darker)]' 
                      : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-text-muted)] hover:text-[var(--color-bg-primary)]'
                    }`
                  }
                >
                  {filterValue === 'ALL' ? 'Todos' : filterValue}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiSearch className="h-16 w-16 text-[var(--color-text-muted)] mx-auto mb-6" />
            <p className="text-xl font-semibold text-[var(--color-text-secondary)] mb-3">
              No se encontraron productos
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Intenta ajustar tu búsqueda o filtros para encontrar lo que buscas.
            </p>
            {(searchTerm || typeFilter !== 'ALL') && ( 
                 <button 
                    onClick={() => { setSearchTerm(''); setTypeFilter('ALL'); }}
                    className="px-5 py-2.5 text-sm bg-[var(--color-amd-red)] text-white rounded-[var(--border-radius-default)] hover:bg-[var(--color-amd-red-darker)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] focus:ring-[var(--color-amd-red)]"
                >
                    Limpiar búsqueda y filtros
                </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;