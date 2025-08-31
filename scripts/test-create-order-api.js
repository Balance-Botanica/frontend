#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simulate API request data
const testOrderData = {
    items: [
        {
            productId: 'test-product-1',
            productName: 'Test Product',
            quantity: 1,
            price: 5000, // 50.00 UAH in kopiyky
            total: 5000
        }
    ],
    total: 5000,
    deliveryAddress: {
        name: 'Test User',
        npWarehouse: 'Warehouse #1',
        npCityName: 'Kyiv'
    },
    notes: 'Test order notes'
};

// Test the API endpoint
async function testCreateOrder() {
    try {
        console.log('🔍 Testing order creation API...');
        console.log('📤 Request data:', JSON.stringify(testOrderData, null, 2));

        const response = await fetch('http://localhost:5173/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Note: In a real test, you would need to include authentication cookies
                // 'Cookie': 'session_token=your_session_token_here'
            },
            body: JSON.stringify(testOrderData)
        });

        console.log('📥 Response status:', response.status);
        console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

        const responseText = await response.text();
        console.log('📥 Response body:', responseText);

        if (response.ok) {
            console.log('✅ Order created successfully!');
        } else {
            console.log('❌ Order creation failed!');
        }

    } catch (error) {
        console.error('❌ Network error:', error.message);
    }
}

testCreateOrder();
