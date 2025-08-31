#!/usr/bin/env node

/**
 * Security Headers Checker for Development
 * Run: npm run check-security
 */

import fetch from 'node-fetch';

const BASE_URL = process.env.ORIGIN || 'http://localhost:5173';

const SECURITY_HEADERS = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': 'present',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=()',
};

async function checkSecurityHeaders() {
    console.log('🔍 Checking Security Headers...\n');

    try {
        // Check main page
        console.log('📄 Testing main page...');
        const mainResponse = await fetch(BASE_URL);
        const mainHeaders = Object.fromEntries(mainResponse.headers.entries());

        console.log('✅ Main page response status:', mainResponse.status);

        // Check API endpoint
        console.log('\n🔗 Testing API endpoint...');
        const apiResponse = await fetch(`${BASE_URL}/api/user/session-check`, {
            credentials: 'include'
        });
        const apiHeaders = Object.fromEntries(apiResponse.headers.entries());

        console.log('✅ API response status:', apiResponse.status);

        // Check security headers
        console.log('\n🛡️  Security Headers Check:\n');

        let score = 0;
        const totalChecks = Object.keys(SECURITY_HEADERS).length + 2; // + CORS + Cookie

        for (const [header, expected] of Object.entries(SECURITY_HEADERS)) {
            const value = mainHeaders[header.toLowerCase()] || apiHeaders[header.toLowerCase()];
            const status = value ? (expected === 'present' ? '✅' : (value.includes(expected) ? '✅' : '⚠️')) : '❌';

            console.log(`${status} ${header}: ${value || 'MISSING'}`);
            if (status === '✅') score++;
        }

        // Check CORS headers for API
        const corsHeader = apiHeaders['access-control-allow-origin'];
        const corsStatus = corsHeader ? '✅' : '❌';
        console.log(`${corsStatus} CORS: ${corsHeader || 'MISSING'}`);
        if (corsStatus === '✅') score++;

        // Check for secure cookies
        const cookieHeader = mainHeaders['set-cookie'] || apiHeaders['set-cookie'];
        if (cookieHeader) {
            const isSecure = cookieHeader.includes('Secure') && cookieHeader.includes('HttpOnly');
            const cookieStatus = isSecure ? '✅' : '⚠️';
            console.log(`${cookieStatus} Secure Cookies: ${isSecure ? 'Present' : 'Missing Secure/HttpOnly'}`);
            if (isSecure) score++;
        } else {
            console.log('❌ Cookies: No cookies set');
        }

        // Calculate security score
        const percentage = Math.round((score / totalChecks) * 100);
        console.log(`\n📊 Security Score: ${score}/${totalChecks} (${percentage}%)`);

        if (percentage >= 80) {
            console.log('🎉 Excellent! Security headers are well configured.');
        } else if (percentage >= 60) {
            console.log('⚠️ Good, but some improvements needed.');
        } else {
            console.log('🚨 Security headers need attention!');
        }

    } catch (error) {
        console.error('❌ Error checking security headers:', error.message);
        console.log('\n💡 Make sure the development server is running: npm run dev');
    }
}

checkSecurityHeaders();
