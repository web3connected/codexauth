import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

interface CodexEvent {
  id: string;
  created_at: string;
  payload_hash: string;
  prev_event_hash: string | null;
  event_hash: string;
  context: any;
}

/**
 * GET /api/codex-verify
 * Walks the chain oldest → newest and verifies integrity
 * 
 * For each event:
 * 1. Recompute event_hash = SHA256(payload_hash + prev_event_hash + JSON.stringify(context))
 * 2. Compare to stored event_hash
 * 3. Ensure prev_event_hash matches previous row's event_hash
 * 
 * Returns:
 * - status: "ok" | "broken"
 * - broken_index: null | number (0-based index of first broken event)
 * - total_events: number
 */
export async function GET(_request: NextRequest) {
  try {
    // Fetch all events ordered oldest → newest for chain verification
    const result = await query(
      `SELECT 
        id,
        created_at,
        payload_hash,
        prev_event_hash,
        event_hash,
        context
       FROM codexhash_events 
       ORDER BY created_at ASC`
    );

    const events = result as CodexEvent[];
    const total_events = events.length;

    if (total_events === 0) {
      return NextResponse.json({
        status: 'ok',
        broken_index: null,
        total_events: 0,
        message: 'No events to verify',
      });
    }

    // Walk through the chain and verify each event
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const prevEvent = i > 0 ? events[i - 1] : null;

      // Verification 1: Check if prev_event_hash matches the previous event's event_hash
      if (prevEvent) {
        if (event.prev_event_hash !== prevEvent.event_hash) {
          return NextResponse.json({
            status: 'broken',
            broken_index: i,
            total_events,
            error: `Event ${i} has incorrect prev_event_hash. Expected ${prevEvent.event_hash}, got ${event.prev_event_hash}`,
            event_id: event.id,
          });
        }
      } else {
        // First event should have null or empty prev_event_hash
        if (event.prev_event_hash && event.prev_event_hash !== '') {
          return NextResponse.json({
            status: 'broken',
            broken_index: i,
            total_events,
            error: `First event should have null or empty prev_event_hash, got ${event.prev_event_hash}`,
            event_id: event.id,
          });
        }
      }

      // Verification 2: Recompute event_hash and compare with stored value
      const prev_event_hash = event.prev_event_hash || '';
      const contextString = JSON.stringify(event.context || {});
      const chainInput = event.payload_hash + prev_event_hash + contextString;
      
      const recomputed_event_hash = crypto
        .createHash('sha256')
        .update(chainInput)
        .digest('hex');

      if (recomputed_event_hash !== event.event_hash) {
        return NextResponse.json({
          status: 'broken',
          broken_index: i,
          total_events,
          error: `Event ${i} hash mismatch. Expected ${event.event_hash}, recomputed ${recomputed_event_hash}`,
          event_id: event.id,
        });
      }
    }

    // All events verified successfully
    return NextResponse.json({
      status: 'ok',
      broken_index: null,
      total_events,
      message: 'Chain integrity verified successfully',
    });

  } catch (error) {
    console.error('Error verifying codex chain:', error);
    return NextResponse.json(
      { 
        error: 'Failed to verify codex chain', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
