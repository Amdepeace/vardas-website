# Edge Functions

| Function | Purpose | Secrets |
|---|---|---|
| `reserve` | Validated, rate-limited reservation insert (service role). Phase 1 adds phone OTP + WhatsApp confirmation. | `SUPABASE_SERVICE_ROLE_KEY` |
| `enquire` | Private hire, artist and careers/supplier forms → `hire_enquiries`, `artists` (+`artist_bookings`), `applications`. | `SUPABASE_SERVICE_ROLE_KEY` |
| `host` | "Selam", the Claude-powered host, grounded on menu / zones / policies / events. | `ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |

Rate limiting uses the `bump_rate_limit(p_key, p_window)` RPC created in `0003_rate_limit.sql`.

```sh
supabase functions deploy reserve
supabase functions deploy enquire
supabase functions deploy host
supabase secrets set ANTHROPIC_API_KEY=sk-ant-... ALLOWED_ORIGIN=https://vardas.et
```

## Email to the Vardas inbox

`reserve` and `enquire` store every submission, then email it via [Resend](https://resend.com) using `_shared/mail.ts`.

```sh
supabase secrets set RESEND_API_KEY=re_... \
  MAIL_TO=vardasvenue@gmail.com \
  MAIL_FROM="Vardas <bookings@vardasentertainment.com>"   # sender on a domain verified in Resend
```

Without `RESEND_API_KEY` submissions are still stored (visible in the staff console) and no email is sent.
Without Supabase at all, the website's forms open the guest's mail app addressed to vardasvenue@gmail.com.
`enquire` kinds: `hire` (Vardas Venue), `contact`, `newsletter`, `artist`, `application`.
