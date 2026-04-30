# CodexHash FAQ — Chaining & Validity

## Q: How does a CodexHash chain link together if hashes aren't shared or agreed on?

**A:**

CodexHash chains link by embedding the previous hash directly into the next hash's input.
Each link is cryptographically bound to the one before it.

There is no sharing, voting, or agreement step.

**Chain structure:**
```
Event 1 → Hash 1
Event 2 + Hash 1 → Hash 2
Event 3 + Hash 2 → Hash 3
...
```

The hash from each event becomes part of the input for the next event. This creates an unbroken chain where altering any previous hash immediately breaks all subsequent hashes.

---

## Q: What determines a "bad link" in the chain?

**A:**

A link is bad if, during verification, recomputing the hash does not reproduce the stored value.

A mismatch means:

- the previous hash was altered or incorrect
- the event data was changed
- the order was violated
- the time anchor was reused or reversed
- the domain context was wrong

**The system doesn't decide a link is bad — it detects inconsistency.**

You run the same computation. If you get a different result, something changed. It's deterministic, not subjective.

---

## Q: If hashes don't validate anything themselves, what do they do?

**A:**

Hashes expose tampering.

They don't judge correctness, intent, or truth.
They make unauthorized change mathematically impossible to hide.

**What hashes do:**
- Lock in the state at a point in time
- Prove nothing was inserted between two events
- Detect alteration of data, order, or time
- Create accountability through verifiability

**What hashes don't do:**
- Decide if data is truthful
- Choose which fork to follow
- Require consensus
- Guarantee intent

Use CodexHash when you need **integrity verification**, not when you need **truth arbitration**.

---

## Q: How is this different from blockchain hash chains?

**A:**

Blockchains use hash chains plus consensus to decide which history to accept.

CodexHash uses a hash chain plus deterministic verification rules to detect alteration.

| Aspect | Blockchain | CodexHash |
|--------|-----------|-----------|
| Linking | Hash chains | Hash chains |
| Consensus | Yes (required) | No (deterministic) |
| Forks | Possible | Not possible |
| Authority | Distributed ledger | Verification rules |
| Use case | Distributed agreement | Integrity verification |
| Model | Social + cryptographic | Cryptographic + deterministic |

**The key difference:**

Blockchains answer: "Which history do we all agree on?"

CodexHash answers: "Has this history been altered?"

---

## Q: Can someone copy a valid hash and reuse it?

**A:**

No. Each hash is scoped to:

- its previous hash
- its time anchor
- its domain context

Reusing it elsewhere immediately fails verification.

**Example of failed reuse:**

```
Event A + Hash(A-1) → Hash A (valid in chain A)

Try to use Hash A in different context:
Event B + Hash(B-1) → Hash B
  ↳ But this won't produce Hash A
  ↳ Hash A fails verification in context B

Why? Because Hash A was computed with different inputs
(different event, different previous hash, different domain)
```

Each hash is a fingerprint of its entire context, not a portable credential.

---

## Q: What if someone claims their hash chain is valid but mine contradicts it?

**A:**

That's not a CodexHash problem to solve.

CodexHash tells you:
- Your chain is internally consistent (or not)
- Their chain is internally consistent (or not)

CodexHash does NOT tell you:
- Which chain is "true"
- Whose version should be trusted
- How to resolve competing histories

**This is intentional.**

You're responsible for:
- Choosing which source to trust
- Deciding conflict resolution policy
- Auditing for tampering
- Establishing your own verification rules

CodexHash provides the tool. You provide the judgment.

---

## Q: Can I verify a CodexHash chain without the original source?

**A:**

You need:

1. The chain (all hashes and events in order)
2. The configuration (tier, salt, TIU settings)
3. The previous hash (to verify the next one)

You do NOT need:

- The authority that created it
- Permission from any server
- Real-time network access
- Third-party verification service

**Verification is purely local:**

You run the hash function on the data you have and compare to the stored hash. If they match, the chain hasn't been altered (locally). If they don't match, something changed.

---

## Q: What's the TIU and why does it matter?

**A:**

**TIU = Time Integrity Unit**

It's a time anchor embedded in the hash to detect:

- Events processed out of order
- Time values reused (replay attacks)
- Events back-dated or forward-dated without justification

Each hash includes the TIU, so:
- Event at time T₁ → Hash₁ includes T₁
- Event at time T₂ → Hash₂ includes T₂
- If T₂ ≤ T₁, the chain is suspicious (time didn't advance)
- If T₂ is wildly different from expected, it's detectable

**The TIU is NOT your timestamp.** It's a value you provide that becomes part of the hash. You decide what it represents (seconds, logical clocks, sequence numbers, etc.).

---

## Q: Can CodexHash prevent someone from lying about what happened?

**A:**

No.

CodexHash can prove:
- The data hasn't changed
- The order hasn't changed
- The time anchor was included
- Nothing was inserted in between

CodexHash cannot prove:
- The original data was truthful
- The person reporting it had good intent
- The time anchor reflects "real time"
- The event actually happened

**If someone puts false data into the chain at T=0, CodexHash will faithfully verify it forever.**

Your integrity tool is not your truth tool.

---

## Q: Why do I need CodexHash if I trust my source?

**A:**

You might trust your source, but:

- Their server gets hacked
- Their logs are accidentally modified
- A database restore overwrites recent changes
- A junior employee deletes something by mistake
- A third party intercepts and modifies the data

CodexHash detects all of these.

**Trust + verification = safety**

Trust your source. Use CodexHash to verify they haven't been compromised.

---

## Why This FAQ Matters

This FAQ:

- Stops blockchain comparisons early
- Removes "shared hash" confusion
- Frames CodexHash as continuity verification, not consensus
- Positions CodexHash as infrastructure, not crypto
- Sets expectations about what CodexHash does and doesn't do

---

## Recommended Next FAQs (To Be Created)

1. **Time & Ordering** — How TIU works, clock skew, reordering attacks
2. **Replay Attacks** — Hash reuse, time repetition, context hijacking
3. **Fork & Branch Detection** — Detecting divergent chains, recovery
4. **Identity Binding** — Tying hashes to identifiers, multi-party chains
5. **Performance & Scale** — Hash tier selection, bulk verification, storage

**Deploy strategy:** 
Release this FAQ now. Add 1–2 more before the webinar. Reference them during the event instead of re-explaining on the fly.

---

**Last updated:** January 20, 2026  
**Status:** Ready for public documentation
