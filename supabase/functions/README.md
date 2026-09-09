# Edge Functions

| Function | Purpose | Secrets |
|---|---|---|
| `reserve` | Validated, rate-limited reservation insert (service role). Phase 1 adds phone OTP + WhatsApp confirmation. | `SUPABASE_SERVICE_ROLE_KEY` |
| `host` | "Selam", the Claude-powered host, grounded on menu / zones / policies / events. | `ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |

Rate limiting uses the `bump_rate_limit(p_key, p_window)` RPC created in `0003_rate_limit.sql`.

```sh
supabase functions deploy reserve
supabase functions deploy host
supabase secrets set ANTHROPIC_API_KEY=sk-ant-... ALLOWED_ORIGIN=https://vardas.et
```
