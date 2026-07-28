/**
 * app/api/admin/login-attempts/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * In-memory rate limiter for the admin login page.
 * Blocks an IP after 5 failed attempts within a 15-minute window.
 *
 * GET  /api/admin/login-attempts   → returns { blocked, attemptsLeft }
 * POST /api/admin/login-attempts   → records a failed attempt, returns status
 * DELETE /api/admin/login-attempts → clears attempts on successful login
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextResponse } from 'next/server';

const MAX_ATTEMPTS = 5;
const WINDOW_MS    = 15 * 60 * 1000; // 15 minutes

// Module-level store (persists across hot-reloads in dev, fine for production
// single-instance deployments; replace with Redis for multi-instance setups).
const attempts = new Map(); // ip → { count, firstAttemptAt }

function getIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

function getRecord(ip) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec) return null;
  // Expired window — purge
  if (now - rec.firstAttemptAt > WINDOW_MS) {
    attempts.delete(ip);
    return null;
  }
  return rec;
}

/** GET — check current status for the caller's IP */
export async function GET(request) {
  const ip  = getIP(request);
  const rec = getRecord(ip);

  if (!rec) {
    return NextResponse.json({ blocked: false, attemptsLeft: MAX_ATTEMPTS });
  }

  const blocked      = rec.count >= MAX_ATTEMPTS;
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - rec.count);
  const resetIn      = Math.ceil((WINDOW_MS - (Date.now() - rec.firstAttemptAt)) / 1000);

  return NextResponse.json({ blocked, attemptsLeft, resetIn });
}

/** POST — record a failed login attempt */
export async function POST(request) {
  const ip  = getIP(request);
  const now = Date.now();
  const rec = getRecord(ip);

  if (!rec) {
    attempts.set(ip, { count: 1, firstAttemptAt: now });
  } else {
    rec.count += 1;
  }

  const updated      = attempts.get(ip);
  const blocked      = updated.count >= MAX_ATTEMPTS;
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - updated.count);
  const resetIn      = Math.ceil((WINDOW_MS - (Date.now() - updated.firstAttemptAt)) / 1000);

  return NextResponse.json(
    { blocked, attemptsLeft, resetIn },
    { status: blocked ? 429 : 200 }
  );
}

/** DELETE — clear the record on successful login */
export async function DELETE(request) {
  const ip = getIP(request);
  attempts.delete(ip);
  return NextResponse.json({ cleared: true });
}
