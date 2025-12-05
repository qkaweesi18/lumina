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
  category: string;
  reviews: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  customer: {
    name: string;
    email: string;
    address: string;
  };
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'newest';