export type StoreCategory = 'pharmacy' | 'veggies';

export interface Store {
    id: string;
    name: string;
    nameAr: string;
    category: StoreCategory;
    image: string;
    rating: number;
    reviewCount: number;
    distance: number;
    deliveryTime: string;
    deliveryFee: number;
    isOpen: boolean;
    address: string;
}

export interface Product {
    id: string;
    storeId: string;
    name: string;
    nameAr: string;
    category: string;
    price: number;
    unit: string;
    image: string;
    inStock: boolean;
    description?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
    note?: string;
}

export type OrderStatus =
    | 'pending'
    | 'accepted'
    | 'preparing'
    | 'picked_up'
    | 'on_the_way'
    | 'delivered'
    | 'cancelled';

export interface Order {
    id: string;
    store: Store;
    items: CartItem[];
    status: OrderStatus;
    total: number;
    deliveryFee: number;
    createdAt: string;
    estimatedDelivery: string;
    note?: string;
    addressId?: string;
    driverName?: string;
    driverPhone?: string;
}

export interface Address {
    id: string;
    label: string;
    address: string;
    isDefault: boolean;
}
