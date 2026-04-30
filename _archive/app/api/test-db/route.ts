import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
    try {
        const pool = getPool();
        const result = await pool.query('SELECT current_database() as db_name, current_user as username, NOW() as current_time');
        
        if (result.rows && result.rows.length > 0) {
            return NextResponse.json({
                success: true,
                message: '✅ Database connection successful',
                database: result.rows[0].db_name,
                user: result.rows[0].username,
                timestamp: result.rows[0].current_time,
                config: {
                    host: process.env.DB_HOST || '172.104.24.82',
                    port: process.env.DB_PORT || '5432',
                    database: process.env.DB_DATABASE || 'codex_main'
                }
            }, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                message: '❌ Database connection failed',
                error: 'No data returned',
                config: {
                    host: process.env.DB_HOST || '172.104.24.82',
                    port: process.env.DB_PORT || '5432',
                    database: process.env.DB_DATABASE || 'codex_main'
                }
            }, { status: 500 });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            success: false,
            message: '❌ Unexpected error',
            error: errorMessage
        }, { status: 500 });
    }
}
