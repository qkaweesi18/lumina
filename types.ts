export interface Review {
  id: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[]; // Additional gallery images
  category: string;
  reviews: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export type PaymentMethod = 'bank-transfer' | 'payfast';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'completed' | 'cancelled';

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  isGuest: boolean;
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'newest';
