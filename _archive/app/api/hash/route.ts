import { NextRequest, NextResponse } from 'next/server';

const CODEXHASH_BACKEND_URL = process.env.CODEXHASH_BACKEND_URL || 'http://localhost:9001';

interface CodexHashRequest {
    data: string;
    algorithm?: string;
}

interface CodexHashResponse {
    hash: string;
    algorithm: string;
    quantum_resistance: number;
    processing_time_ms: number;
    security_level: string;
    metadata: {
        [key: string]: any;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body: CodexHashRequest = await request.json();
        const { data, algorithm = 'harmonic' } = body;

        if (!data) {
            return NextResponse.json({
                success: false,
                message: 'Data is required'
            }, { status: 400 });
        }

        // Call CodexHash Python backend
        const response = await fetch(`${CODEXHASH_BACKEND_URL}/hash`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data, algorithm }),
        });

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const hashResult: CodexHashResponse = await response.json();

        return NextResponse.json({
            success: true,
            ...hashResult
        }, { status: 200 });

    } catch (error: any) {
        console.error('CodexHash API error:', error);
        
        return NextResponse.json({
            success: false,
            message: 'Failed to generate hash',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        service: 'CodexHash API',
        version: '1.0.0',
        endpoints: {
            hash: 'POST /api/hash - Generate quantum-resistant hash',
            backend: CODEXHASH_BACKEND_URL
        }
    });
}
