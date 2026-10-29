import { createHash } from "crypto";
import { query } from "./db";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;
const LOCKOUT_MINUTES = 15;

interface LoginRateLimitRow {
  locked_until: string | null;
}

function hashIdentifier(identifier: string): string {
  return createHash("sha256").update(identifier).digest("hex");
}

export function getLoginRateLimitKeys(email: string, ipAddress: string): string[] {
  return [hashIdentifier(`email:${email}`), hashIdentifier(`ip:${ipAddress}`)];
}

export async function isLoginRateLimited(keys: string[]): Promise<boolean> {
  const result = await query<LoginRateLimitRow>(
    `SELECT locked_until::text
     FROM login_rate_limit
     WHERE identifier_hash = ANY($1::char(64)[])
       AND locked_until > CURRENT_TIMESTAMP
     LIMIT 1;`,
    [keys]
  );
  return result.rows.length > 0;
}

export async function registerLoginFailure(keys: string[]): Promise<void> {
  for (const key of keys) {
    await query(
      `INSERT INTO login_rate_limit (identifier_hash, attempts, window_started_at, locked_until, updated_at)
       VALUES ($1, 1, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP)
       ON CONFLICT (identifier_hash) DO UPDATE
       SET attempts = CASE
             WHEN login_rate_limit.window_started_at < CURRENT_TIMESTAMP - INTERVAL '${WINDOW_MINUTES} minutes' THEN 1
             ELSE login_rate_limit.attempts + 1
           END,
           window_started_at = CASE
             WHEN login_rate_limit.window_started_at < CURRENT_TIMESTAMP - INTERVAL '${WINDOW_MINUTES} minutes' THEN CURRENT_TIMESTAMP
             ELSE login_rate_limit.window_started_at
           END,
           locked_until = CASE
             WHEN login_rate_limit.window_started_at >= CURRENT_TIMESTAMP - INTERVAL '${WINDOW_MINUTES} minutes'
                  AND login_rate_limit.attempts + 1 >= ${MAX_ATTEMPTS}
               THEN CURRENT_TIMESTAMP + INTERVAL '${LOCKOUT_MINUTES} minutes'
             ELSE NULL
           END,
           updated_at = CURRENT_TIMESTAMP;`,
      [key]
    );
  }
}

export async function clearLoginFailures(keys: string[]): Promise<void> {
  await query("DELETE FROM login_rate_limit WHERE identifier_hash = ANY($1::char(64)[]);", [keys]);
}
