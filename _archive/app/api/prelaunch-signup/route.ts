import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface SignupRequest {
    email: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: SignupRequest = await request.json();
        const { email } = body;

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json({
                success: false,
                message: 'Invalid email address'
            }, { status: 400 });
        }

        // Get user agent and referrer
        const userAgent = request.headers.get('user-agent') || '';
        const referrer = request.headers.get('referer') || '';
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

        // Check if email already exists
        const existing = await query(
            'SELECT id FROM prelaunch_signups WHERE email = $1',
            [email]
        );

        if (existing && existing.length > 0) {
            return NextResponse.json({
                success: true,
                message: 'You\'re already on the list!',
                alreadyExists: true
            }, { status: 200 });
        }

        // Insert new signup
        await query(
            `INSERT INTO prelaunch_signups 
            (email, source, referrer, user_agent, ip_address, status) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [email, 'landing_page', referrer, userAgent, ip, 'pending']
        );

        return NextResponse.json({
            success: true,
            message: 'Thank you for joining our pre-launch!',
            alreadyExists: false
        }, { status: 201 });

    } catch (error: any) {
        console.error('Pre-launch signup error:', error);
        
        // Check if it's a unique constraint violation
        if (error.code === '23505') {
            return NextResponse.json({
                success: true,
                message: 'You\'re already on the list!',
                alreadyExists: true
            }, { status: 200 });
        }

        return NextResponse.json({
            success: false,
            message: 'Failed to save signup. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

// GET endpoint to retrieve signup stats (optional - for admin use)
export async function GET(request: NextRequest) {
    try {
        const stats = await query(`
            SELECT 
                COUNT(*) as total_signups,
                COUNT(*) FILTER (WHERE signup_date >= NOW() - INTERVAL '24 hours') as signups_today,
                COUNT(*) FILTER (WHERE signup_date >= NOW() - INTERVAL '7 days') as signups_week,
                MIN(signup_date) as first_signup,
                MAX(signup_date) as latest_signup
            FROM prelaunch_signups
        `);

        return NextResponse.json({
            success: true,
            stats: stats && stats.length > 0 ? stats[0] : {}
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Failed to retrieve stats',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
