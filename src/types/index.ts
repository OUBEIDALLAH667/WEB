// AB.TECHNILOGIE — Types partagés

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  is_admin: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  category_id: string | null;
  image_url: string;
  is_active: boolean;
  created_at: string;
  category?: Category;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_hours: number;
  is_active: boolean;
  created_at: string;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: OrderStatus;
  stripe_session_id: string | null;
  shipping_address: string;
  notes: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  service_id: string | null;
  name: string;
  price: number;
  quantity: number;
  item_type: 'product' | 'service';
  created_at: string;
}

export type DiagnosticStatus = 'new' | 'contacted' | 'resolved';

export interface Diagnostic {
  id: string;
  customer_name: string;
  phone: string;
  device_type: string;
  brand: string;
  problem_description: string;
  status: DiagnosticStatus;
  created_at: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  user_id: string | null;
  service_id: string | null;
  customer_name: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  status: AppointmentStatus;
  created_at: string;
  service?: Service;
}

export interface CartItem {
  id: string;
  type: 'product' | 'service';
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  reference_id: string;
}
