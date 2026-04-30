#!/usr/bin/env node

/**
 * Setup script for prelaunch_signups table
 * Safely creates the table if it doesn't exist
 */

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

async function setupTable() {
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
        console.log('🔍 Checking database connection...');
        const testResult = await pool.query('SELECT NOW()');
        console.log('✅ Database connected successfully at:', testResult.rows[0].now);

        console.log('\n📋 Checking if prelaunch_signups table exists...');
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'prelaunch_signups'
            );
        `);

        const tableExists = tableCheck.rows[0].exists;

        if (tableExists) {
            console.log('✅ Table already exists. Checking structure...');
            
            const columnsCheck = await pool.query(`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'prelaunch_signups'
                ORDER BY ordinal_position;
            `);

            console.log('\n📊 Current table structure:');
            columnsCheck.rows.forEach(col => {
                console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
            });

            // Check if table has required columns
            const requiredColumns = ['email', 'source', 'referrer', 'user_agent', 'ip_address', 'status'];
            const existingColumns = columnsCheck.rows.map(row => row.column_name);
            const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

            if (missingColumns.length > 0) {
                console.log('\n⚠️  Missing columns:', missingColumns.join(', '));
                console.log('🔧 Adding missing columns...');

                for (const column of missingColumns) {
                    let columnDef = '';
                    switch (column) {
                        case 'email':
                            columnDef = 'VARCHAR(255) NOT NULL UNIQUE';
                            break;
                        case 'source':
                            columnDef = "VARCHAR(100) DEFAULT 'landing_page'";
                            break;
                        case 'referrer':
                            columnDef = 'VARCHAR(500)';
                            break;
                        case 'user_agent':
                            columnDef = 'TEXT';
                            break;
                        case 'ip_address':
                            columnDef = 'VARCHAR(45)';
                            break;
                        case 'status':
                            columnDef = "VARCHAR(50) DEFAULT 'pending'";
                            break;
                    }

                    try {
                        await pool.query(`ALTER TABLE prelaunch_signups ADD COLUMN IF NOT EXISTS ${column} ${columnDef};`);
                        console.log(`  ✅ Added column: ${column}`);
                    } catch (err) {
                        console.log(`  ⚠️  Could not add ${column}:`, err.message);
                    }
                }
            } else {
                console.log('\n✅ All required columns exist!');
            }

        } else {
            console.log('❌ Table does not exist. Creating it now...');
            
            const createTableSQL = `
                CREATE TABLE IF NOT EXISTS prelaunch_signups (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    source VARCHAR(100) DEFAULT 'landing_page',
                    referrer VARCHAR(500),
                    user_agent TEXT,
                    ip_address VARCHAR(45),
                    status VARCHAR(50) DEFAULT 'pending',
                    notes TEXT,
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE INDEX IF NOT EXISTS idx_prelaunch_email ON prelaunch_signups(email);
                CREATE INDEX IF NOT EXISTS idx_prelaunch_status ON prelaunch_signups(status);
                CREATE INDEX IF NOT EXISTS idx_prelaunch_date ON prelaunch_signups(signup_date);

                COMMENT ON TABLE prelaunch_signups IS 'Stores email addresses from CodexAuth pre-launch campaign';
            `;

            await pool.query(createTableSQL);
            console.log('✅ Table created successfully!');
        }

        // Test a sample query
        console.log('\n🧪 Testing table access...');
        const testQuery = await pool.query('SELECT COUNT(*) as count FROM prelaunch_signups;');
        console.log(`✅ Table accessible. Current signups: ${testQuery.rows[0].count}`);

        console.log('\n✅ Setup complete! The prelaunch_signups table is ready.');

    } catch (error) {
        console.error('\n❌ Error during setup:', error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
        if (error.detail) {
            console.error('Detail:', error.detail);
        }
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run the setup
setupTable();
