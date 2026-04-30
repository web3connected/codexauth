import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface CodexEvent {
  id: string;
  created_at: string;
  mode: string;
  algo: string;
  payload_hash: string;
  prev_event_hash: string | null;
  event_hash: string;
  context: any;
}

/**
 * GET /api/codex-history
 * Returns the last 50 events ordered newest → oldest
 */
export async function GET(_request: NextRequest) {
  try {
    const result = await query(
      `SELECT 
        id,
        created_at,
        mode,
        algo,
        payload_hash,
        prev_event_hash,
        event_hash,
        context
       FROM codexhash_events 
       ORDER BY created_at DESC 
       LIMIT 50`
    );

    const events = (result as CodexEvent[]).map((event) => ({
      id: event.id,
      created_at: event.created_at,
      mode: event.mode,
      algo: event.algo,
      payload_hash: event.payload_hash,
      prev_event_hash: event.prev_event_hash,
      event_hash: event.event_hash,
      context: event.context,
      // Provide shortened versions for display
      payload_hash_short: event.payload_hash.substring(0, 12) + '...',
      prev_event_hash_short: event.prev_event_hash 
        ? event.prev_event_hash.substring(0, 12) + '...' 
        : null,
      event_hash_short: event.event_hash.substring(0, 12) + '...',
    }));

    return NextResponse.json({
      events,
      count: events.length,
    });

  } catch (error) {
    console.error('Error fetching codex history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch codex history', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
