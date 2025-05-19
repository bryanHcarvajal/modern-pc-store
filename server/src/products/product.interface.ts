export interface Product {
  id: string;
  name: string;
  type: 'GPU' | 'CPU'; 
  amdChip?: string; 
  price: number;
  specs: string[]; 
  imageUrl?: string;
}