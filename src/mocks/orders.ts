import { Order } from '@/types';
import { products } from './products';
import { stores } from './stores';

export const sampleOrders: Order[] = [
    {
        id: 'ORD-1001',
        store: stores[0],
        items: [
            { product: products[0], quantity: 2 },
            { product: products[2], quantity: 1 },
        ],
        status: 'delivered',
        total: 175,
        deliveryFee: 17,
        createdAt: '2026-02-28T14:30:00Z',
        estimatedDelivery: '2026-02-28T14:50:00Z',
        driverName: 'Ahmed Mohamed',
        driverPhone: '+201012345678',
    },
    {
        id: 'ORD-1002',
        store: stores[4],
        items: [
            { product: products[10], quantity: 3 },
            { product: products[11], quantity: 2 },
            { product: products[14], quantity: 1 },
        ],
        status: 'on_the_way',
        total: 114,
        deliveryFee: 15,
        createdAt: '2026-03-01T10:15:00Z',
        estimatedDelivery: '2026-03-01T10:30:00Z',
        driverName: 'Mahmoud Ali',
        driverPhone: '+201098765432',
    },
    {
        id: 'ORD-1003',
        store: stores[1],
        items: [
            { product: products[5], quantity: 1 },
            { product: products[6], quantity: 2 },
        ],
        status: 'delivered',
        total: 119,
        deliveryFee: 19,
        createdAt: '2026-02-27T09:00:00Z',
        estimatedDelivery: '2026-02-27T09:25:00Z',
        driverName: 'Hassan Ibrahim',
        driverPhone: '+201055555555',
    },
];
