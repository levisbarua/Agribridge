import { Product, TransportRequest, StorageFacility, Order } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper to normalize MongoDB _id to id
const mapId = (item: any) => {
    if (item && item._id) {
        item.id = item._id.toString();
    }
    return item;
};

// --- Products ---
export const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.map(mapId);
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return mapId(await response.json());
};

// --- Logistics (Transport Requests) ---
export const fetchTransportRequests = async (): Promise<TransportRequest[]> => {
    const response = await fetch(`${API_BASE_URL}/transport-requests`);
    if (!response.ok) throw new Error('Failed to fetch transport requests');
    const data = await response.json();
    return data.map(mapId);
};

export const createTransportRequest = async (requestData: Partial<TransportRequest>): Promise<TransportRequest> => {
    const response = await fetch(`${API_BASE_URL}/transport-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('Failed to create transport request');
    return mapId(await response.json());
};

export const updateTransportRequestStatus = async (id: string, updateData: Partial<TransportRequest>): Promise<TransportRequest> => {
    const response = await fetch(`${API_BASE_URL}/transport-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update transport request');
    return mapId(await response.json());
};

// --- Storage Facilities ---
export const fetchStorageFacilities = async (): Promise<StorageFacility[]> => {
    const response = await fetch(`${API_BASE_URL}/storage`);
    if (!response.ok) throw new Error('Failed to fetch storage facilities');
    const data = await response.json();
    return data.map(mapId);
};

export const createStorageFacility = async (facilityData: Partial<StorageFacility>): Promise<StorageFacility> => {
    const response = await fetch(`${API_BASE_URL}/storage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facilityData),
    });
    if (!response.ok) throw new Error('Failed to create storage facility');
    return mapId(await response.json());
};

export const updateStorageFacilityCapacity = async (id: string, availableKg: number): Promise<StorageFacility> => {
    const response = await fetch(`${API_BASE_URL}/storage/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availableKg }),
    });
    if (!response.ok) throw new Error('Failed to update storage facility limit');
    return mapId(await response.json());
};

// --- Orders ---
export const fetchOrders = async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    return data.map(mapId);
};

export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return mapId(await response.json());
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return mapId(await response.json());
};
