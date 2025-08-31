#!/usr/bin/env node

// Test getting orders from the API
async function testGetOrders() {
    try {
        console.log('🔍 Testing GET /api/orders...');

        const response = await fetch('http://localhost:5173/api/orders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('📥 GET /api/orders status:', response.status);
        const responseText = await response.text();
        console.log('📥 GET response:', responseText);

    } catch (error) {
        console.error('❌ Network error:', error.message);
    }
}

testGetOrders();
