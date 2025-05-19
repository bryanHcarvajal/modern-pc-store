import type { Product } from '../components/Products/ProductCard'; 

export const mockProducts: Product[] = [
  // GPUs AMD
  {
    id: 'gpu1',
    name: 'AMD Radeon RX 5700 XT',
    type: 'GPU',
    amdChip: 'Radeon RX 5700 XT',
    price: 299.99,
    specs: ['8GB GDDR6', 'Arquitectura RDNA', 'PCIe 4.0'],
    imageUrl: 'https://www.amd.com/system/files/styles/992px/private/2019-06/238593-radeon-rx5700xt-angle-1260x709.png?itok=EuBAbGdV' 
  },
  {
    id: 'gpu2',
    name: 'AMD Radeon RX 7800 XT',
    type: 'GPU',
    amdChip: 'Radeon RX 7800 XT',
    price: 499.99,
    specs: ['16GB GDDR6', 'Arquitectura RDNA 3', 'Ray Tracing Avanzado'],
    imageUrl: 'https://www.amd.com/system/files/styles/992px/private/2023-08/676546-amd-radeon-rx-7800-xt-angle-1260x709.png?itok=1q03H5e4'
  },
  {
    id: 'gpu3',
    name: 'AMD Radeon RX 7900 XTX',
    type: 'GPU',
    amdChip: 'Radeon RX 7900 XTX',
    price: 999.99,
    specs: ['24GB GDDR6', 'Chiplet Design', 'DisplayPort 2.1'],
    imageUrl: 'https://www.amd.com/system/files/styles/992px/private/2022-11/650561-amd-radeon-rx-7900-xtx-angle-1260x709.png?itok=Zg037U1j'
  },
  // CPUs AMD
  {
    id: 'cpu1',
    name: 'AMD Ryzen 5 7600X',
    type: 'CPU',
    amdChip: 'Ryzen 5 7600X',
    price: 229.00,
    specs: ['6 Núcleos', '12 Hilos', 'Hasta 5.3GHz Boost', 'Socket AM5'],
    // imageUrl: ''
  },
  {
    id: 'cpu2',
    name: 'AMD Ryzen 7 7800X3D',
    type: 'CPU',
    amdChip: 'Ryzen 7 7800X3D',
    price: 449.00,
    specs: ['8 Núcleos', '16 Hilos', 'AMD 3D V-Cache™', 'Optimizado para Gaming'],
    // imageUrl: ''
  },
  {
    id: 'cpu3',
    name: 'AMD Ryzen 9 7950X',
    type: 'CPU',
    amdChip: 'Ryzen 9 7950X',
    price: 549.00,
    specs: ['16 Núcleos', '32 Hilos', 'Hasta 5.7GHz Boost', 'Productividad Extrema'],
    // imageUrl: ''
  },
];