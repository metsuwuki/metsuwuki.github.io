# K✦GAMI Cloudflare deployment

The browser remains on GitHub Pages. The API is an independent Cloudflare Worker backed by D1. No Supabase package, key, or runtime call remains.

## 1. Create and configure resources

1. Install dependencies with `npm ci`.
2. Authenticate Wrangler with `npx wrangler login`.
3. Create the database: `npx wrangler d1 create kagami-nexus`.
4. Copy the returned `database_id` into `cloudflare/wrangler.jsonc`.
5. Review `ALLOWED_ORIGINS`; production should list only the real GitHub Pages/custom-domain origins. Keep localhost only for development.
6. Create a Turnstile widget for the production hostname. Never put its secret in Vite variables.
7. Set Worker secrets:

   ```powershell
   npx wrangler secret put HASH_SECRET --config cloudflare/wrangler.jsonc
   npx wrangler secret put TURNSTILE_SECRET_KEY --config cloudflare/wrangler.jsonc
   npx wrangler secret put MODERATION_TOKEN --config cloudflare/wrangler.jsonc
   ```

Use long, independently generated values for `HASH_SECRET` and `MODERATION_TOKEN`.

## 2. Local database and imported data

`npm run cf:import` converts `db/guestbook_rows.sql` and `db/visitors_rows.sql` into the idempotent migration `0002_import_legacy.sql`. Visitor UUIDs are HMAC-hashed before inclusion. Apply locally with `npm run cf:migrate:local`.

The export contains visitor `last_seen` snapshots, not the historical `visitor_events` table. They are preserved as legacy unique visitors, but page views and daily historical unique counts are not fabricated. New page-view history starts after cutover.

For local Worker testing, place non-production values in `cloudflare/.dev.vars` (ignored by Git):

```text
HASH_SECRET=local-development-secret-change-me
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
MODERATION_TOKEN=local-moderator-token
TURNSTILE_BYPASS=true
```

Never enable `TURNSTILE_BYPASS` in production.

### Free-tier capacity (checked 2026-10-15)

- Workers Free: 100,000 requests/day, 10 ms CPU/request, 128 MB memory, and 50 subrequests/request.
- D1 Free: 5 million rows read/day, 100,000 rows written/day, 5 GB total storage; an individual free database is limited to 500 MB and an invocation to 50 read queries.
- Turnstile Free: up to 20 widgets, 10 hostnames per widget, and unlimited challenge/verification requests.

Cloudflare can change plan limits. Recheck the official [Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [D1 limits](https://developers.cloudflare.com/d1/platform/limits/), and [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/) before launch. Since September 2026, D1 rejects new queries after a free account reaches its daily row read/write allowance until midnight UTC.

## 3. Migrate, deploy, and cut over

1. Generate/import the current local exports: `npm run cf:import`.
2. Apply remote migrations: `npx wrangler d1 migrations apply kagami-nexus --remote --config cloudflare/wrangler.jsonc`.
3. Verify counts with `npx wrangler d1 execute kagami-nexus --remote --command "SELECT COUNT(*) FROM guestbook; SELECT COUNT(*) FROM visitors;" --config cloudflare/wrangler.jsonc`.
4. Deploy: `npx wrangler deploy --config cloudflare/wrangler.jsonc`.
5. Check `/api/health`, `/api/guestbook`, and `/api/analytics/summary` on the returned Worker URL.
6. In the GitHub repository Pages environment variables, set:
   - `VITE_API_BASE_URL` to the Worker origin, without a trailing slash.
   - `VITE_TURNSTILE_SITE_KEY` to the public Turnstile site key.
7. Run the GitHub Pages workflow and verify both desktop/mobile guestbook flows.

Do not delete the original Supabase project until record counts, representative timestamps, avatar IDs, guestbook submission, and analytics persistence have been verified in production.

## GitHub Actions deployment

The independent `.github/workflows/deploy-cloudflare.yml` workflow validates the Worker, injects the D1 database ID only inside the runner, applies remote migrations, deploys the Worker, and probes the health, guestbook, and analytics endpoints.

Create a protected GitHub environment named `cloudflare-production` with:

- Environment variable `CLOUDFLARE_D1_DATABASE_ID` — the D1 database UUID returned by `wrangler d1 create`.
- Secret `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account ID.
- Secret `CLOUDFLARE_API_TOKEN` — a narrowly scoped token that can edit Workers and D1 for this account.

The runtime secrets `HASH_SECRET`, `TURNSTILE_SECRET_KEY`, and `MODERATION_TOKEN` must still be stored in Cloudflare with `wrangler secret put`; they are not copied into GitHub or frontend builds. Run the workflow manually for the first cutover, verify its endpoint probes and D1 record counts, and only then rely on path-triggered deployments.

## Moderation

Moderation has no browser-shipped password. Send `Authorization: Bearer <MODERATION_TOKEN>` to:

- `GET /api/admin/guestbook` — review the latest 100 entries.
- `PATCH /api/admin/guestbook/:id` with `{ "status": "hidden" }` or `{ "status": "visible" }`.
- `DELETE /api/admin/guestbook/:id` — permanently remove spam.

Use a trusted local API client or Cloudflare dashboard tooling. Prefer hiding first; delete only confirmed spam.

## Rollback

Restore the previous GitHub Pages artifact or commit and its Supabase build variables. The migration never modifies or deletes Supabase data. D1 can remain online during rollback. Once the old frontend is restored, investigate the Worker independently and repeat the cutover.
