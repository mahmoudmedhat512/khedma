import { sampleOrders } from '@/mocks/orders';
import { CartItem, Order, Product, Store } from '@/types';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useMemo, useState } from 'react';

export const [CartProvider, useCart] = createContextHook(() => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [currentStore, setCurrentStore] = useState<Store | null>(null);
    const [orders, setOrders] = useState<Order[]>(sampleOrders);

    const addItem = useCallback((product: Product, store: Store) => {
        setCurrentStore((prev) => {
            if (prev && prev.id !== store.id) {
                // Return prev to prevent silent clearing
                return prev;
            }
            if (!prev) return store;
            return prev;
        });

        setItems((prev) => {
            // Check if store matches current store (or if cart is empty)
            if (currentStore && currentStore.id !== store.id) return prev;

            const existing = prev.find((i) => i.product.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    }, [currentStore]);

    const clearAndAddItem = useCallback((product: Product, store: Store) => {
        setItems([{ product, quantity: 1 }]);
        setCurrentStore(store);
    }, []);

    const reorder = useCallback((order: Order) => {
        setItems([...order.items]);
        setCurrentStore(order.store);
    }, []);

    const removeItem = useCallback((productId: string) => {
        setItems((prev) => {
            const updated = prev.filter((i) => i.product.id !== productId);
            if (updated.length === 0) setCurrentStore(null);
            return updated;
        });
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }
        setItems((prev) =>
            prev.map((i) =>
                i.product.id === productId ? { ...i, quantity } : i
            )
        );
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
        setCurrentStore(null);
    }, []);

    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
        [items]
    );

    const itemCount = useMemo(
        () => items.reduce((sum, i) => sum + i.quantity, 0),
        [items]
    );

    const updateItemNote = useCallback((productId: string, note: string) => {
        setItems((prev) =>
            prev.map((i) =>
                i.product.id === productId ? { ...i, note } : i
            )
        );
    }, []);

    const deliveryFee = useMemo(() => {
        if (!currentStore) return 0;
        // PRD Rule: Base 15 EGP + 2 EGP/km
        const baseFee = 15;
        const distFee = Math.ceil(currentStore.distance * 2);
        return baseFee + distFee;
    }, [currentStore]);

    const total = subtotal + deliveryFee;

    const placeOrder = useCallback((metadata?: { note?: string; addressId?: string }) => {
        if (!currentStore || items.length === 0) return null;
        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            store: currentStore,
            items: [...items],
            status: 'pending',
            total: subtotal + deliveryFee,
            deliveryFee,
            createdAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            note: metadata?.note,
            addressId: metadata?.addressId,
        };
        setOrders((prev) => [newOrder, ...prev]);
        clearCart();
        return newOrder;
    }, [currentStore, items, subtotal, deliveryFee, clearCart]);

    return {
        items,
        currentStore,
        orders,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        itemCount,
        placeOrder,
        clearAndAddItem,
        reorder,
        updateItemNote,
    };
});
