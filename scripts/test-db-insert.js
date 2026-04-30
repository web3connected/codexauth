#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length) {
            const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value;
        }
    });
}

async function testInsert() {
    const pool = new Pool({
        host: process.env.DB_HOST || '172.104.24.82',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_DATABASE || 'codex_main',
        user: process.env.DB_USERNAME || 'codex_admin',
        password: process.env.DB_PASSWORD,
        max: 5,
        connectionTimeoutMillis: 5000,
    });

    try {
        console.log('🔍 Testing database connection...');
        const testResult = await pool.query('SELECT NOW()');
        console.log('✅ Connected at:', testResult.rows[0].now);

        // Test the exact query from the API route
        const testEmail = `test-${Date.now()}@example.com`;
        console.log(`\n📧 Testing insert with email: ${testEmail}`);

        const insertResult = await pool.query(
            `INSERT INTO prelaunch_signups 
            (email, source, referrer, user_agent, ip_address, status) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [testEmail, 'landing_page', 'test-script', 'test-agent', '127.0.0.1', 'pending']
        );

        console.log('✅ Insert successful!');
        console.log('Inserted row:', insertResult.rows[0]);

        // Test selecting
        console.log('\n🔍 Testing select...');
        const selectResult = await pool.query(
            'SELECT id, email, status, created_at FROM prelaunch_signups WHERE email = $1',
            [testEmail]
        );

        console.log('✅ Select successful!');
        console.log('Found row:', selectResult.rows[0]);

        // Clean up test data
        console.log('\n🧹 Cleaning up test data...');
        await pool.query('DELETE FROM prelaunch_signups WHERE email = $1', [testEmail]);
        console.log('✅ Cleanup complete!');

        console.log('\n✅ All database operations working correctly!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Code:', error.code);
        if (error.detail) {
            console.error('Detail:', error.detail);
        }
        if (error.stack) {
            console.error('Stack:', error.stack);
        }
        process.exit(1);
    } finally {
        await pool.end();
    }
}

testInsert();
