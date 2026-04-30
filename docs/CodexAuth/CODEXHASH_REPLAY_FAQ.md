# CodexHash FAQ — Replay Attacks & Prevention

## Q: What's a replay attack and can CodexHash prevent it?

**A:**

**Replay attack:** An attacker captures a valid hash and reuses it in a different context to trick the system into accepting invalid data.

**Example:**
```
Legitimate:
Event:   "Alice approves $100 transfer"
TIU:     100
Hash:    HASH_001

Attack:
Reuse HASH_001 in different context:
Event:   "Bob approves $100 transfer"
TIU:     100
Hash:    HASH_001 (same, reused)

Result:  System thinks Bob approved something Alice approved
```

**Can CodexHash prevent this?** 

Yes, if you include the right context in the hash.

CodexHash doesn't prevent replay by itself—it detects it if properly configured.

---

## Q: How do I prevent hash reuse?

**A:**

Include these elements in the hash input:

1. **Event data** (required)
2. **TIU / time anchor** (required)
3. **Previous hash** (required for chaining)
4. **Domain context** (required for prevention)
5. **Actor / identity** (recommended)

**Domain context examples:**
```
"CONTEXT|transfer|USD|"      ← Operation type + currency
"CONTEXT|bank_123|account_456|"  ← Institution + account
"CONTEXT|user_alice|action_login|"  ← User + action
"CONTEXT|environment_prod|"  ← Deployment environment
```

**Each of these is embedded in CodexHash computation:**
```python
hash = SHA3-512(
    domain_tag +        # CODEXHASH|GOVERNMENT| (tier)
    context_tag +       # CONTEXT|transfer|USD|
    previous_hash +     # Links to prior event
    event_data +        # The actual payload
    tiu                 # Time integrity unit
)
```

**Reuse fails because:**
```
Original context: "CONTEXT|transfer|USD|"
Replay context:   "CONTEXT|transfer|JPY|"  ← Different currency

Same hash? No. Hashes don't match.
Detection: ✅ Replay prevented
```

---

## Q: What if someone replays a hash in the same context but different time?

**A:**

**Scenario:**
```
T=100: Event with TIU=100, Hash_A computed
T=200: Attacker inserts same event with same TIU=100, tries to reuse Hash_A

Verification:
Recompute hash with TIU=100 from T=200
Result:  Hash_B (different from stored Hash_A)

Why different?
- TIU is part of input ✅
- But the previous hash in the chain changed
- Event appears out of order

Detection: ✅ Tampering detected
```

**The chain structure prevents this.**

---

## Q: Can I replay a hash within a single chain?

**A:**

No, because each hash depends on the previous hash.

**Scenario:**
```
Chain position 1:  prev_hash = 0, data = "Event_A", TIU = 100 → Hash_1
Chain position 2:  prev_hash = Hash_1, data = "Event_B", TIU = 101 → Hash_2
Chain position 3:  prev_hash = Hash_2, data = "Event_C", TIU = 102 → Hash_3

Attacker tries to replay Hash_1 at position 3:
Chain position 3:  prev_hash = Hash_2, stored_hash = Hash_1 (wrong)

Verification:
Recompute: SHA3(Hash_2 + event_data + TIU)
Result:    Hash_3' ≠ Hash_1

Detection: ✅ Mismatch detected, chain is bad
```

The hash chain is strictly sequential. Reordering breaks it.

---

## Q: What if the attacker inserts the same event twice in a row?

**A:**

**Scenario:**
```
Position 1: prev=0, data="Payment_100", TIU=100 → Hash_1
Position 2: prev=Hash_1, data="Payment_100", TIU=101 → Hash_2
Position 3: prev=Hash_2, data="Payment_100", TIU=101 → Hash_3 (duplicate event)
```

**During verification:**
- Hash_1 and Hash_2 are valid (TIU increased)
- At position 3: TIU didn't increase (still 101)
- Same event (Payment_100) occurs twice

**Detection:**
- Application logic detects duplicate event (idempotency check)
- CodexHash detects TIU stagnation (anomaly flag)
- Combined: duplicates are detectable

**CodexHash flags the anomaly. You decide if duplicates are allowed.**

---

## Q: Can I detect a replay attack by looking at hashes alone?

**A:**

Partially. You can detect:

✅ **Hashes that don't match recomputed values** (tampering)
✅ **TIU values out of order** (temporal anomaly)
✅ **Hashes that appear in multiple chains** (fork detection)

❌ **Intent** (did they mean to do this?)
❌ **Authorization** (are they allowed?)
❌ **Semantic validity** (is the event correct?)

**Example:**
```
Stored hash: HASH_ABC
Your recompute: HASH_XYZ

Mismatch = ✅ You know something changed

But you don't know if it's a replay, modification, or clock drift
without additional context.
```

Use CodexHash + application logic:
- CodexHash detects structural tampering
- Your app logic validates semantic correctness

---

## Q: What's the difference between replay and fork?

**A:**

| Attack | What Happens | Detection |
|--------|--------------|-----------|
| **Replay** | Valid hash reused in wrong context | Hash matches two different events |
| **Fork** | Chain branches into two valid histories | Two chains with same starting point |
| **Replay + Fork** | Replayed hash in forked chain | Hash validity but inconsistent lineage |

**Replay example:**
```
Context A: Event_1 + HASH_123 → Event_2 uses HASH_123 ✅
Context B: Event_1' + HASH_123 → Different semantics but same hash
Detection: Hash mismatch (HASH_123 ≠ recomputed hash for Context B)
```

**Fork example:**
```
Main:     Event_1 → Hash_1 → Event_2 → Hash_2
Branch:   Event_1 → Hash_1 → Event_2' → Hash_2' (different from Hash_2)

Both chains are valid independently.
But they can't both be true simultaneously.
```

---

## Q: How do I prevent forks?

**A:**

You don't prevent them. You detect them and decide policy.

**Detection:**
```python
chain_a_hash_n = compute_hash(events_a)
chain_b_hash_n = compute_hash(events_b)

if chain_a_hash_n != chain_b_hash_n:
    # Chains diverged
    # Now what?
```

**Policy options:**

1. **Last-write-wins:** Accept the latest chain, reject the old one
2. **Strict consistency:** Reject both chains, flag as invalid
3. **Branching allowed:** Keep both as valid branches, require manual resolution
4. **Merkle verification:** Verify which branch has stronger evidence

**CodexHash doesn't enforce policy. It detects forks and lets you decide.**

---

## Q: What if I'm verifying a chain but detect a fork mid-stream?

**A:**

**Scenario:**
```
Chain: Event_1 → Event_2 → Event_3 → Event_4
       Hash_1 → Hash_2 → Hash_3 → Hash_4

Verification:
Hash_1: ✅ Valid
Hash_2: ✅ Valid
Hash_3: ❌ MISMATCH
Hash_4: (not reachable, chain is broken)
```

**Interpretation:**
- Event_3 was altered, or
- Event_2's output changed, or
- A fork occurred at position 2

**Action:**
- Stop verification
- Flag the chain as invalid at Hash_3
- Investigate Event_2 and Event_3

You can't know if it's accidental corruption or intentional tampering without additional evidence.

---

## Q: Can I verify a forked chain without the original?

**A:**

Yes. You can verify each fork independently.

**Example:**
```
You have Chain_B (fork):
Event_1 → Event_2' → Event_3' → Event_4'

Verification:
Recompute Hash_1, Hash_2', Hash_3', Hash_4'
Result: All match ✅

Conclusion:
Chain_B is internally consistent.
(But you can't verify it against Chain_A without having Chain_A)
```

**To detect the fork:**
You need both Chain_A and Chain_B. Then you compare:
- Same Event_1?
- Same Hash_1?
- Different Hash_2? ← Fork point

Without access to both, you can only verify self-consistency, not detect forks.

---

## Q: What happens if someone modifies a hash in the middle of a chain?

**A:**

All subsequent hashes become invalid.

**Scenario:**
```
Original:  E₁ → E₂ → E₃ → E₄
           H₁ → H₂ → H₃ → H₄

Attacker modifies H₂ to H₂':
Modified:  E₁ → E₂ → E₃ → E₄
           H₁ → H₂' → H₃ → H₄

Verification:
H₁: ✅ Valid (recomputed matches)
H₂': ❌ Invalid (H₂' ≠ recomputed H₂)
H₃: ❌ Invalid (depends on wrong H₂')
H₄: ❌ Invalid (depends on wrong H₃)

Detection: ✅ Entire chain invalid from H₂' onward
```

**Cascading failure:** Modifying one hash breaks the entire chain downstream. This is intentional—it prevents silent tampering.

---

## Q: How do I protect against time-based replay attacks?

**A:**

Use time validation PLUS hash verification:

**Example (Preventing duplicate payment):**
```python
def verify_payment(event, stored_hash):
    # Check 1: Hash integrity
    if compute_hash(event) != stored_hash:
        return False  # Tampering detected
    
    # Check 2: Time progression
    if event.tiu <= previous_event.tiu:
        return False  # Time didn't advance
    
    # Check 3: Idempotency
    if event.id in processed_ids:
        return False  # Already processed
    
    # Check 4: Business logic
    if event.amount > user_limit:
        return False  # Amount exceeds limit
    
    return True  # All checks passed
```

CodexHash handles checks 1–2 (hash + time).
Your app handles checks 3–4 (business logic).

---

## Q: Can CodexHash be used to detect insider threats?

**A:**

Yes, but with limitations.

**What CodexHash detects:**
- Hash tampering (someone modified records)
- Time anomalies (events out of order)
- Chain forks (conflicting histories)

**What CodexHash doesn't detect:**
- Authorization violation (did they have permission?)
- Malicious intent (did they mean to do this?)
- Collusion (did they work with someone else?)

**Example:**
```
Insider deletes a payment record:
CodexHash:   ✅ Detects hole in chain (missing hash sequence)
CodexHash:   ✅ Shows who had access at that time
CodexHash:   ❌ Doesn't determine if they acted alone or with help

Next step: Audit logs, access controls, interviews
```

Use CodexHash as evidence, not verdict.

---

## Why This FAQ Matters

This FAQ:

- Clarifies that replay prevention requires context, not just hashing
- Shows hash chaining prevents reuse within a chain
- Explains fork detection vs. fork prevention
- Positions CodexHash as detection, not prevention
- Provides practical patterns for security checks

---

## Cross-Reference

- See **[CODEXHASH_FAQ.md](CODEXHASH_FAQ.md)** for chaining basics
- See **[CODEXHASH_TIME_FAQ.md](CODEXHASH_TIME_FAQ.md)** for TIU and time-based attacks

---

**Last updated:** January 20, 2026  
**Status:** Ready for public documentation
