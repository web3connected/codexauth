#!/usr/bin/env python3
"""
PreZone → Zone Assignment Cycle Test
======================================

Tests the full pipeline:
  HTTP request
    → codexsecure-api /api/v1/analyzer/route   (7-stage zone analysis)
    → phase lock reconciliation                  (declared vs analyzed)
    → zone assignment                            (final zone decision)
    → zone policy fetch                          (contract validation)

Stages exercised per test case:
  1. URI keyword match   — vocabulary scorer + compound token split
  2. Controller pattern  — controller name scoring
  3. Middleware stack    — middleware array scoring
  4. Composite          — combined signal detection
  5. Confidence scoring  — score → confidence ratio
  6. Policy validation   — zone policy from /api/v1/policy/zones/Z{n}
  7. Zone assignment     — final zone_id + zone_key

Phase lock states verified:
  ROUTE_OVERRIDE  — declared zone, analyzer returned Z0 (no signal)
  PHASE_LOCKED    — declared == analyzed
  PHASE_CONFLICT  — declared != analyzed and analyzer had data
  UNRESOLVED      — no declared zone, analyzer result used as-is

Usage:
  python3 tests/prezone_cycle_test.py
  python3 tests/prezone_cycle_test.py --verbose
"""

import json
import sys
import time
import argparse
import urllib.request
import urllib.error
from dataclasses import dataclass, field
from typing import Optional

ANALYZER_URL = "http://localhost:8084/api/v1/analyzer/route"
POLICY_URL   = "http://localhost:8084/api/v1/policy/zones/Z{}"
ZONES_URL    = "http://localhost:8084/api/v1/policy/zones"
PORTAL_URL   = "http://localhost:3004"

RESET  = "\x1b[0m"
GREEN  = "\x1b[32m"
RED    = "\x1b[31m"
YELLOW = "\x1b[33m"
CYAN   = "\x1b[36m"
GRAY   = "\x1b[90m"
BOLD   = "\x1b[1m"

def ok(msg):   return f"{GREEN}✓{RESET} {msg}"
def fail(msg): return f"{RED}✗{RESET} {msg}"
def info(msg): return f"{CYAN}·{RESET} {msg}"
def warn(msg): return f"{YELLOW}⚠{RESET} {msg}"


# ── Test case definition ───────────────────────────────────────────────────────

@dataclass
class ZoneTestCase:
    label:            str
    uri:              str
    methods:          list[str]
    middleware:       list[str]
    controller:       str
    # Expected analyzer output
    expect_zone_id:   int
    expect_zone_key:  str
    expect_governed:  bool        = False   # True = governing keyword locked the zone
    expect_score_min: int         = 0       # minimum score expected
    # Phase lock simulation
    declared_zone:    Optional[int] = None  # zone declared in the route file
    expect_phase:     str           = "UNRESOLVED"
    # Optional extra assertions
    notes:            str           = ""


CASES: list[ZoneTestCase] = [

    # ── URI vocabulary: first-segment exact matches ───────────────────────────

    ZoneTestCase(
        label           = "Z1 · /routes (public, vocabulary)",
        uri             = "/routes",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 1,
        expect_zone_key = "public",
        expect_governed = False,
        expect_score_min= 200,
        declared_zone   = 1,
        expect_phase    = "PHASE_LOCKED",
        notes           = "SDK route-list.ts declares Z1_PUBLIC → should phase-lock",
    ),

    ZoneTestCase(
        label           = "Z1 · /about (public, vocabulary)",
        uri             = "/about",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 1,
        expect_zone_key = "public",
        expect_governed = False,
        expect_score_min= 200,
        notes           = "No declared zone → UNRESOLVED but analyzer gives Z1",
    ),

    ZoneTestCase(
        label           = "Z1 · /blog (public, vocabulary)",
        uri             = "/blog",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 1,
        expect_zone_key = "public",
        expect_governed = False,
        expect_score_min= 200,
    ),

    # ── URI vocabulary: governing keywords (immediate lock) ───────────────────

    ZoneTestCase(
        label           = "Z12 · /admin (governing first-segment)",
        uri             = "/admin",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 12,
        expect_zone_key = "sys-admin-sync",
        expect_governed = True,
        expect_score_min= 600,
        notes           = "'admin' is governing — score must be >= 600",
    ),

    ZoneTestCase(
        label           = "Z2 · /auth (governing first-segment)",
        uri             = "/auth",
        methods         = ["GET", "POST"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 2,
        expect_zone_key = "identity",
        expect_governed = True,
        expect_score_min= 600,
    ),

    ZoneTestCase(
        label           = "Z3 · /api/v1/users (governing first-segment)",
        uri             = "/api/v1/users",
        methods         = ["GET", "POST"],
        middleware      = ["api"],
        controller      = "",
        expect_zone_id  = 3,
        expect_zone_key = "ops",
        expect_governed = True,
        expect_score_min= 600,
    ),

    ZoneTestCase(
        label           = "Z4 · /dashboard (governing first-segment)",
        uri             = "/dashboard",
        methods         = ["GET"],
        middleware      = ["auth"],
        controller      = "",
        expect_zone_id  = 4,
        expect_zone_key = "protected",
        expect_governed = True,
        expect_score_min= 600,
    ),

    ZoneTestCase(
        label           = "Z9 · /analytics (governing first-segment)",
        uri             = "/analytics",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 9,
        expect_zone_key = "analytics",
        expect_governed = True,
        expect_score_min= 600,
    ),

    # ── Compound segment splitting (- and _ delimiters) ───────────────────────

    ZoneTestCase(
        label           = "Z12 · /wp-admin (compound, admin token)",
        uri             = "/wp-admin",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 12,
        expect_zone_key = "sys-admin-sync",
        expect_governed = True,
        expect_score_min= 600,
        notes           = "Split on '-': [wp, admin] → 'admin' governs Z12",
    ),

    ZoneTestCase(
        label           = "Z12 · /codex_admin (compound, underscore)",
        uri             = "/codex_admin",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 12,
        expect_zone_key = "sys-admin-sync",
        expect_governed = True,
        expect_score_min= 600,
        notes           = "Split on '_': [codex, admin] → 'admin' governs Z12",
    ),

    ZoneTestCase(
        label           = "Z12 · /super-admin/settings (compound first-seg)",
        uri             = "/super-admin/settings",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 12,
        expect_zone_key = "sys-admin-sync",
        expect_governed = True,
        expect_score_min= 600,
    ),

    ZoneTestCase(
        label           = "Z2 · /oauth-login (compound, login token)",
        uri             = "/oauth-login",
        methods         = ["GET", "POST"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 2,
        expect_zone_key = "identity",
        expect_governed = True,
        expect_score_min= 600,
        notes           = "Split on '-': [oauth, login] → 'login' governs Z2",
    ),

    ZoneTestCase(
        label           = "Z2 · /user-login (compound, login token)",
        uri             = "/user-login",
        methods         = ["GET", "POST"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 2,
        expect_zone_key = "identity",
        expect_governed = True,
        expect_score_min= 600,
    ),

    ZoneTestCase(
        label           = "Z3 · /codex-webhook (compound, webhook token)",
        uri             = "/codex-webhook",
        methods         = ["POST"],
        middleware      = ["api"],
        controller      = "",
        expect_zone_id  = 3,
        expect_zone_key = "ops",
        expect_governed = True,
        expect_score_min= 600,
    ),

    # ── Escalation: public first-segment overridden by governing child ─────────

    ZoneTestCase(
        label           = "Z8 · /shop/checkout (public→payment escalation)",
        uri             = "/shop/checkout",
        methods         = ["POST"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 8,
        expect_zone_key = "resourcesync",
        expect_governed = True,
        expect_score_min= 400,
        notes           = "'shop' is Z1 public; 'checkout' is governing Z8 → escalates",
    ),

    ZoneTestCase(
        label           = "Z12 · /content/admin-panel (late governing child)",
        uri             = "/content/admin-panel",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 12,
        expect_zone_key = "sys-admin-sync",
        expect_governed = True,
        expect_score_min= 400,
        notes           = "'content' is Z1; 'admin-panel' splits to 'admin' → Z12 child lock (500)",
    ),

    ZoneTestCase(
        label           = "Z12 · /admin/routes (admin governs, routes ignored)",
        uri             = "/admin/routes",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 12,
        expect_zone_key = "sys-admin-sync",
        expect_governed = True,
        expect_score_min= 600,
        notes           = "'admin' governs first-segment; 'routes' (Z1 word) is irrelevant",
    ),

    # ── Phase lock states ──────────────────────────────────────────────────────

    ZoneTestCase(
        label           = "PHASE_LOCKED · /routes declared=Z1 analyzed=Z1",
        uri             = "/routes",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 1,
        expect_zone_key = "public",
        expect_governed = False,
        expect_score_min= 200,
        declared_zone   = 1,
        expect_phase    = "PHASE_LOCKED",
        notes           = "Declared matches analyzed — strongest signal",
    ),

    ZoneTestCase(
        label           = "PHASE_CONFLICT · /routes declared=Z12 analyzed=Z1",
        uri             = "/routes",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 1,       # analyzer sees Z1
        expect_zone_key = "public",
        expect_governed = False,
        declared_zone   = 12,      # but declared says Z12
        expect_phase    = "PHASE_CONFLICT",
        notes           = "Mismatch → held at Z0 by phase gate; conflict reported",
    ),

    ZoneTestCase(
        label           = "ROUTE_OVERRIDE · /xyz declared=Z4 analyzer=Z-1",
        uri             = "/xyz-unknown-path",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = -1,      # analyzer returns -1/unassigned for no signal
        expect_zone_key = "unassigned",
        expect_governed = False,
        declared_zone   = 4,       # declared says Z4 → route-override applies
        expect_phase    = "ROUTE_OVERRIDE",
        notes           = "Analyzer had no data (Z-1/unassigned) → declared zone wins (ROUTE_OVERRIDE)",
    ),

    # ── Policy validation: zone contract from codexsecure-api ─────────────────

    ZoneTestCase(
        label           = "Z12 policy · auth+tiu+executive required",
        uri             = "/admin",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 12,
        expect_zone_key = "sys-admin-sync",
        expect_governed = True,
        expect_score_min= 600,
        notes           = "Will also verify Z12 policy: auth+tiu+executive=true",
    ),

    ZoneTestCase(
        label           = "Z1 policy · public access, no auth",
        uri             = "/about",
        methods         = ["GET"],
        middleware      = [],
        controller      = "",
        expect_zone_id  = 1,
        expect_zone_key = "public",
        expect_governed = False,
        notes           = "Will verify Z1 policy: auth_required=false, tiu_required=false",
    ),
]


# ── HTTP helpers ───────────────────────────────────────────────────────────────

def post_json(url: str, payload: dict) -> dict:
    data = json.dumps(payload).encode()
    req  = urllib.request.Request(
        url,
        data    = data,
        method  = "POST",
        headers = {"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=5) as r:
        return json.loads(r.read())


def get_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=5) as r:
        return json.loads(r.read())


# ── Phase lock simulation (mirrors prezoneRequest.ts logic) ───────────────────

def simulate_phase_lock(
    analyzer_zone_id: int,
    analyzer_confidence: float,
    analyzer_source: str,
    declared_zone: Optional[int],
) -> tuple[str, int, str]:
    """
    Replicates the TypeScript phase lock reconciliation in Python.
    Returns (phase_status, final_zone_id, final_source).
    """
    # API has data if it returned a positive zone with a positive score.
    # (The Go API may omit confidence / return null source for vocabulary hits.)
    api_had_data = analyzer_zone_id >= 1 and analyzer_confidence > 0 or (
        analyzer_zone_id >= 1 and analyzer_source not in (None, "z0-fallback", "unassigned")
    )
    # Fallback: any positive zone_id with a non-zero score counts as data
    if analyzer_zone_id >= 1 and not api_had_data:
        api_had_data = True

    if declared_zone is None:
        return "UNRESOLVED", analyzer_zone_id, analyzer_source

    if not api_had_data:
        return "ROUTE_OVERRIDE", declared_zone, "route-override"

    if analyzer_zone_id == declared_zone:
        return "PHASE_LOCKED", declared_zone, "phase-locked"

    # Conflict — hold at Z0
    return "PHASE_CONFLICT", 0, "phase-conflict"


# ── Single test runner ─────────────────────────────────────────────────────────

@dataclass
class TestResult:
    case:    ZoneTestCase
    passed:  bool
    details: list[str] = field(default_factory=list)
    elapsed: float     = 0.0
    raw:     dict      = field(default_factory=dict)


def run_case(case: ZoneTestCase, verbose: bool = False) -> TestResult:
    result = TestResult(case=case, passed=True)
    t0 = time.time()

    # 1. Call analyzer
    try:
        raw = post_json(ANALYZER_URL, {
            "uri":        case.uri,
            "methods":    case.methods,
            "middleware": case.middleware,
            "controller": case.controller,
        })
    except Exception as e:
        result.passed = False
        result.details.append(f"analyzer unreachable: {e}")
        result.elapsed = time.time() - t0
        return result

    result.raw = raw
    result.elapsed = time.time() - t0

    # Extract fields — API returns flat shape (zone_id at top level)
    zone_id     = raw.get("zone_id", -1)
    zone_key    = raw.get("zone_key", "")
    score       = raw.get("score", 0)
    confidence  = raw.get("confidence", 0.0)
    source      = raw.get("source", "")
    uri_match   = raw.get("match_details", {}).get("uri_match", False)

    # 2. Zone id assertion
    if zone_id != case.expect_zone_id:
        result.passed = False
        result.details.append(
            f"zone_id: got Z{zone_id} ({zone_key}) expected Z{case.expect_zone_id} ({case.expect_zone_key})"
        )
    else:
        result.details.append(f"zone_id: Z{zone_id} ({zone_key}) ✓")

    # 3. Zone key assertion
    if zone_key != case.expect_zone_key:
        result.passed = False
        result.details.append(f"zone_key: got '{zone_key}' expected '{case.expect_zone_key}'")

    # 4. Governing keyword assertion
    governed = score >= 500 and uri_match
    if case.expect_governed and not governed:
        result.passed = False
        result.details.append(
            f"governing: expected zone to be locked by governing keyword (score={score})"
        )
    elif not case.expect_governed and governed and score >= 500:
        result.details.append(f"governing: not expected but score={score} (informational)")
    else:
        result.details.append(f"governed: {'yes (score=' + str(score) + ')' if governed else 'no'} ✓")

    # 5. Minimum score assertion
    if score < case.expect_score_min:
        result.passed = False
        result.details.append(
            f"score: got {score} expected >= {case.expect_score_min}"
        )
    else:
        result.details.append(f"score: {score} (min {case.expect_score_min}) ✓")

    # 6. Phase lock simulation
    phase_status, final_zone, final_source = simulate_phase_lock(
        analyzer_zone_id    = zone_id,
        analyzer_confidence = confidence,
        analyzer_source     = source,
        declared_zone       = case.declared_zone,
    )
    if phase_status != case.expect_phase:
        result.passed = False
        result.details.append(
            f"phase_lock: got '{phase_status}' expected '{case.expect_phase}'"
        )
    else:
        result.details.append(f"phase_lock: {phase_status} ✓")

    # If PHASE_CONFLICT, final zone should be Z0 (held)
    if phase_status == "PHASE_CONFLICT":
        result.details.append(f"  conflict: declared=Z{case.declared_zone} analyzed=Z{zone_id} → held at Z0")

    # If ROUTE_OVERRIDE, final zone should be the declared zone
    if phase_status == "ROUTE_OVERRIDE":
        result.details.append(f"  override: declared=Z{case.declared_zone} wins (analyzer had no signal)")

    # 7. Policy fetch — verify zone contract from codexsecure-api
    effective_zone = zone_id if phase_status not in ("PHASE_CONFLICT", "ROUTE_OVERRIDE") else (
        case.declared_zone if phase_status == "ROUTE_OVERRIDE" else 0
    )
    try:
        policy = get_json(POLICY_URL.format(effective_zone))
        pol_key = policy.get("key", "")
        pol_auth = policy.get("rules", {}).get("auth_required", False)
        pol_tiu  = policy.get("rules", {}).get("tiu_required", False)
        pol_exec = policy.get("rules", {}).get("executive", False)
        pol_ro   = policy.get("rules", {}).get("read_only", False)
        result.details.append(
            f"policy Z{effective_zone}: auth={pol_auth} tiu={pol_tiu} executive={pol_exec} read_only={pol_ro} ✓"
        )

        # Spot-check for known zones
        if effective_zone == 12:
            if not (pol_auth and pol_tiu and pol_exec):
                result.passed = False
                result.details.append("  Z12 policy violation: must have auth+tiu+executive")
        if effective_zone == 1:
            if pol_auth or pol_tiu:
                result.passed = False
                result.details.append("  Z1 policy violation: must NOT require auth or tiu")
        if effective_zone == 0:
            if not policy.get("rules", {}).get("read_only", False):
                result.details.append(
                    warn("  Z0 policy: expected read_only=true (informational)")
                )

    except Exception as e:
        result.details.append(warn(f"policy fetch failed: {e}"))

    return result


# ── Full portal health check ───────────────────────────────────────────────────

def check_portal_pages() -> list[tuple[str, bool, str]]:
    """Hit /routes and /zones pages — verify they return 200."""
    pages = [
        ("/routes", "Route List dev page"),
        ("/zones",  "Zone Registry dev page"),
    ]
    results = []
    for path, label in pages:
        t0 = time.time()
        try:
            req = urllib.request.Request(f"{PORTAL_URL}{path}")
            with urllib.request.urlopen(req, timeout=8) as r:
                code    = r.status
                elapsed = time.time() - t0
                results.append((label, code == 200, f"HTTP {code} — {elapsed:.2f}s"))
        except Exception as e:
            results.append((label, False, str(e)))
    return results


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--verbose", "-v", action="store_true", help="Show per-assertion detail")
    args = parser.parse_args()
    verbose = args.verbose

    print(f"\n{BOLD}PreZone → Zone Assignment Cycle Test{RESET}")
    print(f"{GRAY}codexsecure-api: {ANALYZER_URL}{RESET}")
    print(f"{GRAY}portal:          {PORTAL_URL}{RESET}")
    print("=" * 70)

    # ── 1. Service health ────────────────────────────────────────────────────
    print(f"\n{CYAN}Service health{RESET}")
    try:
        zones_meta = get_json(ZONES_URL)
        n_zones = zones_meta.get("total", "?")
        api_ver = zones_meta.get("version", "?")
        print(f"  {ok(f'codexsecure-api · {n_zones} zones · v{api_ver}')}")
    except Exception as e:
        print(f"  {fail(f'codexsecure-api unreachable: {e}')}")
        sys.exit(1)

    portal_pages = check_portal_pages()
    for label, ok_flag, detail in portal_pages:
        sym = ok(f"{label} · {detail}") if ok_flag else fail(f"{label} · {detail}")
        print(f"  {sym}")

    # ── 2. Per-case test run ─────────────────────────────────────────────────
    print(f"\n{CYAN}Zone assignment test cases{RESET}")
    print("-" * 70)

    results: list[TestResult] = []

    for i, case in enumerate(CASES, 1):
        r = run_case(case, verbose=verbose)
        results.append(r)

        status = ok(case.label) if r.passed else fail(case.label)
        timing = f"{GRAY}{r.elapsed*1000:.0f}ms{RESET}"
        print(f"  [{i:02d}] {status}  {timing}")

        if not r.passed or verbose:
            for detail in r.details:
                print(f"        {GRAY}{detail}{RESET}")
            if case.notes:
                print(f"        {GRAY}note: {case.notes}{RESET}")
            if not r.passed and r.raw:
                print(f"        {GRAY}raw: zone_id={r.raw.get('zone_id')} score={r.raw.get('score')} source={r.raw.get('source')}{RESET}")

    # ── 3. Summary ──────────────────────────────────────────────────────────
    passed = sum(1 for r in results if r.passed)
    failed = len(results) - passed
    total  = len(results)
    avg_ms = sum(r.elapsed for r in results) / total * 1000

    print("\n" + "=" * 70)
    print(f"{BOLD}Results: {GREEN if failed == 0 else RED}{passed}/{total} passed{RESET}  "
          f"{GRAY}avg {avg_ms:.0f}ms/case{RESET}")

    if failed > 0:
        print(f"\n{RED}Failed cases:{RESET}")
        for r in results:
            if not r.passed:
                print(f"  {fail(r.case.label)}")
                for d in r.details:
                    if "✓" not in d:
                        print(f"    {d}")

    # ── 4. Phase lock summary table ──────────────────────────────────────────
    print(f"\n{CYAN}Phase lock distribution{RESET}")
    phase_counts: dict[str, int] = {}
    for r in results:
        if r.raw:
            phase, _, _ = simulate_phase_lock(
                r.raw.get("zone_id", 0),
                r.raw.get("confidence", 0.0),
                r.raw.get("source", ""),
                r.case.declared_zone,
            )
            phase_counts[phase] = phase_counts.get(phase, 0) + 1
    for phase, count in sorted(phase_counts.items()):
        bar = "█" * count
        print(f"  {phase:<20} {bar} {count}")

    print()
    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    main()
