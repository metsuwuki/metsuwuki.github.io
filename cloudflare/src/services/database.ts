export async function checkRateLimit(db: D1Database, key: string, action: string, limit: number, windowSeconds: number): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const bucket = now - (now % windowSeconds);
  const row = await db.prepare(
    `INSERT INTO rate_limits (key_hash, action, bucket_start, request_count)
     VALUES (?1, ?2, ?3, 1)
     ON CONFLICT(key_hash, action, bucket_start)
     DO UPDATE SET request_count = request_count + 1
     RETURNING request_count`,
  ).bind(key, action, bucket).first<{ request_count: number }>();
  return Boolean(row && row.request_count <= limit);
}

export function normalizeTimestamp(value: string): string {
  return value.replace(" ", "T").replace(/\+00$/, "Z");
}
