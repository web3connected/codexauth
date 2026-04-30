import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

interface CreateEventRequest {
  data: string;
  mode: 'quick' | 'codex';
  algo: string;
  context?: Record<string, any>;
}

/**
 * POST /api/codex-event
 * Creates a new CodexHash event with tamper-evident chaining
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateEventRequest = await request.json();
    const { data, mode, algo, context = {} } = body;

    // Validate input
    if (!data || !mode || !algo) {
      return NextResponse.json(
        { error: 'Missing required fields: data, mode, algo' },
        { status: 400 }
      );
    }

    if (!['quick', 'codex'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "quick" or "codex"' },
        { status: 400 }
      );
    }

    // Step 1: Compute payload_hash (hash of the raw input data)
    const payload_hash = crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');

    // Step 2: Fetch the latest event to get prev_event_hash
    const latestEventResult = await query(
      'SELECT event_hash FROM codexhash_events ORDER BY created_at DESC LIMIT 1'
    );
    
    const prev_event_hash = latestEventResult.length > 0 
      ? latestEventResult[0].event_hash 
      : '';

    // Step 3: Compute event_hash using the chaining rule
    // event_hash = SHA256(payload_hash + prev_event_hash + JSON.stringify(context))
    const chainInput = payload_hash + prev_event_hash + JSON.stringify(context);
    const event_hash = crypto
      .createHash('sha256')
      .update(chainInput)
      .digest('hex');

    // Step 4: Insert the new event into the database
    const insertResult = await query(
      `INSERT INTO codexhash_events 
       (id, mode, algo, payload_hash, prev_event_hash, event_hash, context) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6) 
       RETURNING id, created_at, payload_hash, prev_event_hash, event_hash`,
      [mode, algo, payload_hash, prev_event_hash || null, event_hash, JSON.stringify(context)]
    );

    const newEvent = insertResult[0] as {
      id: string;
      created_at: string;
      payload_hash: string;
      prev_event_hash: string | null;
      event_hash: string;
    };

    return NextResponse.json({
      id: newEvent.id,
      created_at: newEvent.created_at,
      payload_hash: newEvent.payload_hash,
      prev_event_hash: newEvent.prev_event_hash,
      event_hash: newEvent.event_hash,
      mode,
      algo,
      context,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating codex event:', error);
    return NextResponse.json(
      { error: 'Failed to create codex event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
