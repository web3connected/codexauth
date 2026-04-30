import { Pool } from 'pg';

const resolveHost = (rawHost: string | undefined): string => {
    const host = rawHost || '172.104.24.82';
    // If someone copies CodexCore env values (DB_HOST=codex_postgres) into a non-docker Next.js process,
    // that hostname won't resolve. In that case, prefer the production host.
    if (process.env.DOCKER_ENV !== 'true' && /^codex_/.test(host)) {
        return '172.104.24.82';
    }
    return host;
};

const resolvePort = (): number => {
    const raw = process.env.DB_PORT;
    const parsed = raw ? Number(raw) : NaN;
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
    return 5432;
};

const resolveDbName = (): string => {
    return process.env.DB_NAME || process.env.DB_DATABASE || 'codex_main';
};

const resolveDbUser = (): string => {
    return process.env.DB_USER || process.env.DB_USERNAME || 'codex_admin';
};

// Database configuration - Uses env variables; defaults match Codex Admin setup
const dbConfig = {
    host: resolveHost(process.env.DB_HOST),
    port: resolvePort(),
    database: resolveDbName(),
    user: resolveDbUser(),
    password: process.env.DB_PASSWORD || '7yQ4xR8kP9wN2mL5vB6tE3zF1jK0dA9sG7hU4nM8xC2qW6',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: (() => {
        const raw = process.env.DB_CONNECTION_TIMEOUT_MS;
        const parsed = raw ? Number(raw) : NaN;
        if (Number.isFinite(parsed) && parsed > 0) return parsed;
        return process.env.NODE_ENV === 'production' ? 5000 : 1500;
    })(),
};

// Create a pool of connections
const pool = new Pool(dbConfig);

// Test database connection
export async function testDbConnection(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as current_time, current_database() as db_name, current_user as username');
        client.release();
        return {
            success: true,
            message: 'Database connection successful',
            data: result.rows[0]
        };
    } catch (error: any) {
        return {
            success: false,
            message: `Database connection failed: ${error.message}`,
            data: { error: error.message }
        };
    }
}

// Execute a query
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result.rows as T[];
    } finally {
        client.release();
    }
}

// Get a client for transactions
export async function getClient() {
    return await pool.connect();
}

// Close the pool (for graceful shutdown)
export async function closePool() {
    await pool.end();
}

// Export the pool for advanced usage
export { pool };

// Log database configuration (without sensitive data)
console.log('📊 CodexAuth Database Configuration:', {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    password: '***' + dbConfig.password.slice(-4),
    max: dbConfig.max,
    connectionTimeout: dbConfig.connectionTimeoutMillis
});
