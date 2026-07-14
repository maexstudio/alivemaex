# alivemaex — landing

Statische Landingpage (HTML/CSS/JS) · Vercel deployt `main` automatisch → https://alivemaex09.vercel.app

## Backend (Vercel Serverless + Supabase)

| Endpoint | Zweck |
|----------|-------|
| `POST /api/subscribe` | Signup-Formular („step inside") → Tabelle `alivemaex_signups` |
| `POST /api/track` | First-Party-Pixel (cookielos, keine IP, keine Drittanbieter) → Tabelle `alivemaex_events` |

### Einmaliges Setup

1. **Supabase:** `supabase/schema.sql` im SQL Editor des Projekts ausführen.
2. **Vercel → Project → Settings → Environment Variables** (Production + Preview):
   - `SUPABASE_URL` — z. B. `https://xyz.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` — Service-Role-Key (Settings → API), niemals committen
3. Redeploy. Ohne Env antwortet `/api/subscribe` ehrlich mit `not_configured` (Formular zeigt einen Hinweis), `/api/track` bleibt stumm.

### Pixel-Events

`pageview` · `listen_click` (Hero-Button + Release-Cover) · `sound_on` · `signup` · `presave_click` (reserviert).
Gespeichert wird nur: Event, Pfad, Referrer-Host, mobile/desktop, Zeitpunkt — **keine Cookies, keine IP, kein Fingerprinting** → kein Consent-Banner nötig.

## Releases pflegen

`assets/app.js` → `RELEASES`-Array (Kommentar „RAUMRISS speist hier ein"). Ein Eintrag pro Release: Titel, Jahr, Stream-Link, Cover, `archived`.
