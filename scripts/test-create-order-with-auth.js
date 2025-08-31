#!/usr/bin/env node

// Test script for order creation with authentication
async function testAuthenticatedOrderCreation() {
    try {
        console.log('🔐 First, let\'s check if we can access the orders endpoint...');

        // First try to get existing orders (this will show if auth is working)
        const getResponse = await fetch('http://localhost:5173/api/orders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('📥 GET /api/orders status:', getResponse.status);
        const getText = await getResponse.text();
        console.log('📥 GET response:', getText);

        if (getResponse.status === 401) {
            console.log('❌ Authentication required. Please log in first through the web interface.');
            console.log('🔗 Open http://localhost:5173/login in your browser and log in.');
            console.log('📋 Then copy the session cookie from browser dev tools.');
            return;
        }

        // If we get here, try creating an order
        console.log('\n📝 Now trying to create an order...');

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

        const createResponse = await fetch('http://localhost:5173/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testOrderData)
        });

        console.log('📥 POST /api/orders status:', createResponse.status);
        const createText = await createResponse.text();
        console.log('📥 POST response:', createText);

        if (createResponse.ok) {
            console.log('✅ Order created successfully!');
        } else {
            console.log('❌ Order creation failed!');
        }

    } catch (error) {
        console.error('❌ Network error:', error.message);
    }
}

testAuthenticatedOrderCreation();
