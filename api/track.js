/* ALIVEMAEX · First-Party-Pixel (Vercel Serverless)
   Cookieloses, eigenes Tracking: keine Cookies, keine IP-Speicherung,
   keine Drittanbieter — nur Ereignis, Seite, Referrer-Host, grobes Gerät.
   Tabelle alivemaex_events, siehe supabase/schema.sql. */

const EVENTS = new Set(["pageview", "listen_click", "signup", "sound_on", "presave_click"]);

function parseBody(req) {
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  return body && typeof body === "object" ? body : {};
}

function refHost(raw) {
  if (typeof raw !== "string" || !raw) return null;
  try {
    const host = new URL(raw).hostname;
    return host && host !== "alivemaex09.vercel.app" && host !== "www.alivemaex.com"
      ? host.slice(0, 100)
      : null;
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    // Pixel darf die Seite nie stören — leise ok, auch unkonfiguriert.
    res.status(200).json({ ok: true, stored: false });
    return;
  }

  const body = parseBody(req);
  const event = String(body.event || "");
  if (!EVENTS.has(event)) {
    res.status(200).json({ ok: true, stored: false });
    return;
  }

  const ua = String(req.headers["user-agent"] || "");
  const device = /mobile|iphone|android/i.test(ua) ? "mobile" : "desktop";

  await fetch(`${url}/rest/v1/alivemaex_events`, {
    method: "POST",
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify({
      event,
      path: typeof body.path === "string" ? body.path.slice(0, 200) : null,
      referrer_host: refHost(body.referrer),
      device,
    }),
  }).catch(() => {});

  res.status(200).json({ ok: true, stored: true });
};
