# CodexHash FAQ — Time & Ordering

## Q: What exactly is the TIU and how do I generate it?

**A:**

**TIU = Time Integrity Unit**

It's a value you provide that encodes temporal information and becomes part of the hash computation. It's NOT automatically generated—you decide what it represents and provide it.

**Common TIU strategies:**

1. **Unix timestamp (seconds)**
   ```
   tiu = int(time.time())  # 1705748400
   ```
   Detects: time reversals, future-dating
   
2. **Logical sequence numbers**
   ```
   tiu = event_counter  # 1, 2, 3, 4...
   ```
   Detects: out-of-order events, skipped sequence numbers
   
3. **Millisecond precision**
   ```
   tiu = int(time.time() * 1000)  # 1705748400123
   ```
   Detects: rapid reordering, microsecond manipulation
   
4. **Hybrid (timestamp + counter)**
   ```
   tiu = (timestamp << 32) | counter
   ```
   Detects: both temporal and sequence anomalies

**The TIU is embedded in the hash, so it becomes immutable once computed.**

---

## Q: What happens if I set the TIU out of order?

**A:**

CodexHash will compute a valid hash, but the chain becomes suspicious.

**Example:**
```
Event 1: TIU = 100 → Hash 1
Event 2: TIU = 50  → Hash 2
Event 3: TIU = 150 → Hash 3
```

All hashes are cryptographically valid, but during verification you'll notice:
- TIU went backwards (100 → 50)
- TIU jumped forward (50 → 150)

**CodexHash doesn't prevent this.** You must:

1. **Detect** the anomaly during verification
2. **Decide** if it's acceptable (maybe time was corrected)
3. **Flag** it in your audit trail

This is intentional. CodexHash doesn't judge your data—it records it faithfully and lets you verify it.

---

## Q: What if my clock is wrong?

**A:**

If your clock is consistently wrong, your TIU will be consistently wrong, but your chain will still be internally consistent.

**Example: Your clock is 1 hour ahead**

```
Real time:      10:00    11:00    12:00
Your TIU:       11:00    12:00    13:00
Your hash:      Valid    Valid    Valid
Chain:          Consistent
```

**During verification:**
- Your chain looks fine
- External observers see timestamps 1 hour in future
- They detect drift by comparing to their clock

**During cross-chain verification:**
- Someone else's timestamp = 10:00
- Your timestamp = 11:00
- You detect 1 hour drift

**CodexHash detects clock skew by comparison, not by magic.**

The solution: use external time sources (NTP, blockchain timestamp, atomic clock) and validate against them.

---

## Q: Can I detect if someone tampered with the TIU?

**A:**

Yes. Tampering with the TIU changes the hash.

**Example:**
```
Original event:     data = "Alice pays Bob $10", TIU = 100
Original hash:      Hash₁ = SHA3(prev_hash + data + 100)

Tampered event:     data = "Alice pays Bob $10", TIU = 200 (altered)
Tampered hash:      Hash₁' = SHA3(prev_hash + data + 200)

Comparison:
Hash₁ ≠ Hash₁'

Detection: ✅ Tampering detected
```

You catch it during verification when the stored hash doesn't match your recomputed hash.

---

## Q: What if events happen faster than my TIU resolution?

**A:**

If multiple events occur at the same timestamp:

**With Unix seconds (1 second resolution):**
```
Event 1: data = "login", TIU = 100 → Hash 1
Event 2: data = "query", TIU = 100 → Hash 2 (same TIU!)
Event 3: data = "logout", TIU = 100 → Hash 3 (same TIU!)
```

All hashes are valid. During verification, you notice the TIU didn't advance. This is detectable but not an error.

**Solution: Use higher resolution**
```
Event 1: data = "login", TIU = 100000 (milliseconds) → Hash 1
Event 2: data = "query", TIU = 100001 → Hash 2
Event 3: data = "logout", TIU = 100002 → Hash 3
```

Or use a hybrid approach:
```
Event 1: TIU = (100000, counter=0) → Hash 1
Event 2: TIU = (100000, counter=1) → Hash 2
Event 3: TIU = (100001, counter=0) → Hash 3
```

---

## Q: Can I use CodexHash for real-time event logging?

**A:**

Yes, but understand the tradeoffs:

| Use Case | Best TIU | Notes |
|----------|----------|-------|
| Audit logs (post-hoc) | Unix seconds | Good resolution, easy verification |
| Financial transactions | Milliseconds | Prevents rapid reordering |
| Real-time streams | Nanoseconds or counters | Detects microsecond manipulation |
| Batch processing | Logical sequence | No time dependency, pure ordering |

**Latency consideration:**

Computing CodexHash adds ~1-5ms per event (varies by tier). For real-time systems processing 1000s/sec, you may batch and hash in intervals.

---

## Q: What if I need to retroactively add an event?

**A:**

You can't. CodexHash is append-only.

**If you need to insert at position N:**
```
Chain before:  E₁ → E₂ → E₃ (3 hashes)
Insert E₂.₅ at position 2.5?

Option 1: Reject it (chain stays intact)
Option 2: Append E₂.₅ to end (chain continues, but E₂.₅ is out of order)
Option 3: Create a new branch (old chain invalid, new chain with E₂.₅ included)
```

CodexHash detects all of these. The question is your policy:
- Accept the new event as appended?
- Accept it out of order?
- Reject the whole chain?

This is your business logic, not CodexHash's.

---

## Q: How do I handle daylight saving time or leap seconds?

**A:**

Use UTC and atomic time standards. Don't use local time.

**Leap seconds:**
- UTC includes leap seconds (sometimes 61 seconds in a minute)
- Unix timestamps sometimes skip or repeat a second
- Solution: Use TAI (International Atomic Time) or synchronize after-the-fact

**Daylight saving time:**
- Never matters if you use UTC
- If you use local time, your TIU will jump backwards during DST transition
- Solution: Always use UTC for auditable timestamps

**Example of DST problem:**
```
2:00 AM (spring forward) → 3:00 AM
Event at 2:30 AM → doesn't exist
Event at 1:59 AM → Event at 3:00 AM
Time went backwards locally, detection needed
```

**Best practice:** UTC timestamps in seconds, validated externally.

---

## Q: What's the difference between TIU and the timestamp in my data?

**A:**

**TIU:** Part of the CodexHash computation. Immutable once hashed. Used for ordering verification.

**Data timestamp:** Part of the event payload. May or may not be trusted. Can be verified independently.

**Example:**
```
Event: {
  "id": "tx_001",
  "timestamp": "2026-01-20T10:30:45Z",  ← Data timestamp (part of payload)
  "amount": 100,
  "tiu": 1705748445                     ← CodexHash TIU (part of hash input)
}

Hash = SHA3-512(prev_hash + event_json + tiu)
```

**During verification:**
- Verify the timestamp in the data matches reality (independent check)
- Verify the TIU is monotonic (increases or stays stable)
- Verify the hash matches (integrity check)

Use both: **TIU for chain integrity, data timestamp for event semantics.**

---

## Q: Can I change the TIU strategy mid-chain?

**A:**

Yes, but it creates a structural break.

**Example:**
```
Events 1-100: TIU = Unix seconds
Event 101:    TIU = Milliseconds
Event 102+:   TIU = Milliseconds (continue)
```

Chain is still valid, but at Event 101 the TIU changes scale. During verification:
- Detect the scale shift
- Decide if it's acceptable (maybe you upgraded)
- Update your verification logic

**Best practice:** Decide on TIU strategy upfront. If you must change, document it clearly and version your schema.

---

## Why This FAQ Matters

This FAQ:

- Explains TIU as a user-controlled parameter, not automatic
- Clarifies that clock drift is detectable but not preventable
- Shows TIU is about detection, not enforcement
- Positions CodexHash as a tool you control, not a system that controls you
- Removes magic thinking about timestamps

---

## Cross-Reference

- See **[CODEXHASH_FAQ.md](CODEXHASH_FAQ.md)** for chaining basics
- See **[CODEXHASH_REPLAY_FAQ.md](CODEXHASH_REPLAY_FAQ.md)** (coming) for replay attacks and reuse prevention

---

**Last updated:** January 20, 2026  
**Status:** Ready for public documentation
