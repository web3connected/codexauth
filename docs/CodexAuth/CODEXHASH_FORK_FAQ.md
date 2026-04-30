# CodexHash FAQ — Fork Detection & Recovery

## Q: What's a fork in CodexHash and why should I care?

**A:**

**Fork:** A point where a single event history splits into two (or more) valid but different chains.

**Why it happens:**
- Backup restore overwrites recent changes
- Two systems write concurrently to the same chain
- Attacker creates alternative history
- Timestamp reset causes time reversal
- Multiple sources of truth claim authority

**Example:**
```
Shared starting point:  Event_1 (2024-01-01) → HASH_001

Branch A (Main):       Event_2_A → Event_3_A → Event_4_A
                       Hash_002_A → Hash_003_A → Hash_004_A

Branch B (Fork):       Event_2_B → Event_3_B → Event_4_B
                       Hash_002_B → Hash_003_B → Hash_004_B

Both branches are cryptographically valid.
But they represent different realities.
```

**Why care:**
- Forks mean conflicting versions of truth
- You need a policy to resolve them
- CodexHash detects them; you decide on recovery

---

## Q: How do I detect a fork?

**A:**

**Method 1: Compare hash sequences**

```python
def detect_fork(chain_a, chain_b):
    """Find where two chains diverge."""
    
    for i in range(min(len(chain_a), len(chain_b))):
        if chain_a.hash[i] != chain_b.hash[i]:
            return i  # Fork point
    
    # One chain is a prefix of the other
    if len(chain_a) != len(chain_b):
        return min(len(chain_a), len(chain_b))  # Divergence point
    
    return None  # Chains are identical
```

**Method 2: Verify independent chains**

```python
chain_a_valid = verify_chain(chain_a)  # ✅ or ❌
chain_b_valid = verify_chain(chain_b)  # ✅ or ❌

if chain_a_valid and chain_b_valid and chain_a != chain_b:
    print("Fork detected: Two valid chains with same origin")
```

**Method 3: Check for temporal anomalies**

```python
for i, event in enumerate(chain):
    if event.tiu <= chain[i-1].tiu:
        print(f"Time anomaly at position {i}")
        # This might indicate fork boundary
```

---

## Q: What do I do when I detect a fork?

**A:**

You have options depending on your policy:

| Policy | Action | Use Case |
|--------|--------|----------|
| **Last-Write-Wins** | Accept the latest chain | Streaming logs, non-critical data |
| **First-Write-Wins** | Accept the first chain | Financial transactions |
| **Strongest-Evidence** | Verify which branch has more evidence | Audit trails |
| **Fail-Safe** | Reject both chains | Cryptographic verification |
| **Manual Resolution** | Flag for human review | Business-critical decisions |

**Example: Last-Write-Wins**
```python
def resolve_fork(chain_a, chain_b):
    """Accept the more recent chain."""
    time_a = chain_a[-1].timestamp
    time_b = chain_b[-1].timestamp
    
    if time_a > time_b:
        return chain_a  # Newer chain wins
    else:
        return chain_b
```

**Example: Strongest-Evidence**
```python
def resolve_fork(chain_a, chain_b):
    """Accept chain with more supporting evidence."""
    evidence_a = audit_log_matches(chain_a)
    evidence_b = audit_log_matches(chain_b)
    
    if evidence_a > evidence_b:
        return chain_a
    elif evidence_b > evidence_a:
        return chain_b
    else:
        raise ForkUnresolvableError("Chains equally supported")
```

**Example: Fail-Safe**
```python
def resolve_fork(chain_a, chain_b):
    """Reject both chains if fork detected."""
    if chain_a != chain_b:
        raise ForkDetectedError("Chains diverged, no auto-recovery")
    return chain_a
```

---

## Q: Can I prevent forks from happening?

**A:**

Partially. You can reduce fork likelihood, but not eliminate it.

**Prevention strategies:**

1. **Single writer** (strong prevention)
   - Only one system writes to the chain
   - All others read-only
   - Eliminates concurrent write conflicts

2. **Serialization** (medium prevention)
   - Chain writes go through a single gatekeeper
   - Queue or lock prevents concurrent modifications
   - Slower, but prevents most forks

3. **Strong time anchoring** (medium prevention)
   - Validate TIU before acceptance
   - Reject events with reversed time
   - Requires external time authority

4. **Consensus** (reduces forks but adds complexity)
   - Quorum of writers must agree
   - Majority vote on fork resolution
   - Adds Byzantine fault tolerance

**CodexHash doesn't enforce prevention.** It detects after the fact and lets you implement your policy.

---

## Q: What if one chain is provably corrupted and the other is clean?

**A:**

**Scenario:**
```
Chain_A: Valid, all hashes match
Chain_B: Invalid, Hash_3 doesn't match recomputed value

Fork detected at position 3 in Chain_B.
```

**Action:**
```python
if not verify_chain(chain_b):
    print(f"Chain_B is corrupted at position {find_corruption_point(chain_b)}")
    return chain_a  # Use clean chain
else:
    # Both chains are valid, need policy
    return resolve_fork(chain_a, chain_b)
```

**This is easier:** Corruption is detectable. Invalid chains fail verification.

Clean chains are harder—they're both cryptographically valid, so you need business logic to choose.

---

## Q: How long does fork recovery take?

**A:**

Depends on:

1. **Detection time:** How fast you realize chains diverged
   - Real-time monitoring: milliseconds
   - Batch verification: hours/days
   
2. **Recovery time:** How fast you apply policy
   - Automatic policy: immediate
   - Manual review: dependent on business process

**Example timeline:**
```
T=0:     Fork occurs (two systems write concurrently)
T=1s:    Monitoring detects inconsistent hashes
T=5s:    Alert generated, teams notified
T=1h:    Manual review of fork point
T=2h:    Policy applied (chain_a chosen, chain_b discarded)
T=2h+:   Audit log updated, recovery complete
```

**Critical systems:** Implement real-time fork detection + automatic policy.
**Non-critical systems:** Batch detection is acceptable.

---

## Q: Can I recover a forked chain by merging the branches?

**A:**

No. CodexHash chains are append-only. Merging changes history.

**Why merging fails:**
```
If you merge Branch_A and Branch_B:
New_chain = Event_1 → Event_2_A → Event_3_A → Event_2_B → Event_3_B

But then:
Hash at position 3 changed (was Hash_3_A, now points to different event)
All downstream hashes become invalid
Chain is now corrupted

Verification would fail.
```

**Instead of merging:**
1. Choose which fork to accept (policy decision)
2. Discard the other
3. Document the fork in audit trail
4. Continue from accepted chain

---

## Q: What if both forks have the same number of valid events?

**A:**

Then your policy needs a tiebreaker:

| Tiebreaker | Criteria |
|-----------|----------|
| Timestamp | Most recent wins |
| Hash value | Numerically lower wins (arbitrary but deterministic) |
| Authority | Author's identity / signature |
| Evidence | Cross-check with external sources |
| Manual | Human decision |

**Example with timestamp tiebreaker:**
```python
def tiebreak_forks(chain_a, chain_b):
    """Choose fork with most recent timestamp."""
    if len(chain_a) == len(chain_b):
        time_a = chain_a[-1].timestamp
        time_b = chain_b[-1].timestamp
        return chain_a if time_a > time_b else chain_b
    else:
        return chain_a if len(chain_a) > len(chain_b) else chain_b
```

**Best practice:** Choose tiebreaker upfront, document it, use it consistently.

---

## Q: Can forks happen if I'm using a single-writer model?

**A:**

Forks are rare but possible even with single writer:

**Scenario 1: Backup restore**
```
Writer creates: Event_1 → Event_2 → Event_3 → Hash_3
System failure.
Restore from backup: Event_1 → Event_2 → Hash_2
Writer continues: Event_2 → Event_3' → Hash_3'

Now: Hash_3 ≠ Hash_3' (fork)
```

**Scenario 2: Replication lag**
```
Primary: Event_1 → Hash_1 → Event_2 → Hash_2
Replica: Event_1 → Hash_1 (hasn't replicated yet)

If primary fails, replica is behind. Reading from replica shows different chain length.
```

**Scenario 3: Clock skew**
```
Primary writes: Event_1 at TIU=100 → Hash_1
Power loss, restart.
Clock incorrect: Event_2 written at TIU=50 → Hash_2'

TIU went backwards. Fork detected by anomaly.
```

**Mitigation:**
- Regular backups with version metadata
- Replica validation before failover
- NTP for time synchronization
- Single writer + reader verification

---

## Q: How do I document a fork in the audit trail?

**A:**

**Suggested audit entry:**

```json
{
  "event_type": "FORK_DETECTED",
  "timestamp": "2026-01-20T15:30:45Z",
  "fork_point": {
    "position": 5,
    "hash_a": "abc123...",
    "hash_b": "xyz789...",
    "events_in_branch_a": 10,
    "events_in_branch_b": 8
  },
  "resolution": {
    "policy_applied": "FIRST_WRITE_WINS",
    "branch_accepted": "A",
    "branch_rejected": "B",
    "resolved_at": "2026-01-20T16:15:00Z",
    "resolved_by": "system_admin"
  },
  "evidence": {
    "chain_a_verified": true,
    "chain_b_verified": true,
    "tiebreaker_used": "timestamp"
  }
}
```

**Store this in immutable log** so you have record of:
- When fork was detected
- How it was resolved
- Why that decision was made
- Who authorized it

---

## Q: What if I can't decide which fork to accept?

**A:**

Then don't. Keep both as valid branches and:

1. **Document the fork** in audit trail
2. **Alert stakeholders** that there's ambiguity
3. **Mark data as disputed** in downstream systems
4. **Escalate to decision-maker** (human or authority)
5. **Record the decision** when made
6. **Resume from accepted branch**

**Example:**
```python
if fork_unresolvable(chain_a, chain_b):
    audit_log("FORK_AMBIGUOUS", chains=[chain_a, chain_b])
    alert_team("Fork detected, manual resolution required")
    request_decision("Choose between chain_a and chain_b")
    
    # Wait for decision
    chosen = await user_decision()
    
    audit_log("FORK_RESOLVED", chosen=chosen, reason=user_reason)
    continue_from(chosen)
```

This is slower but safe. Better to pause than guess wrong on financial data.

---

## Why This FAQ Matters

This FAQ:

- Distinguishes between fork detection and fork prevention
- Provides concrete recovery policies
- Shows forks are detectable and manageable
- Positions CodexHash as a detection tool
- Emphasizes that policy is your responsibility

---

## Cross-Reference

- See **[CODEXHASH_FAQ.md](CODEXHASH_FAQ.md)** for chaining basics
- See **[CODEXHASH_REPLAY_FAQ.md](CODEXHASH_REPLAY_FAQ.md)** for replay attacks and chain integrity

---

**Last updated:** January 20, 2026  
**Status:** Ready for public documentation
