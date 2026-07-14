/* ALIVEMAEX · Signup-Endpoint (Vercel Serverless)
   Speichert E-Mails in Supabase (Tabelle alivemaex_signups, siehe supabase/schema.sql).
   Env in Vercel: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY — ohne sie antwortet
   der Endpoint ehrlich mit not_configured statt E-Mails zu verlieren. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, reason: "method_not_allowed" });
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    res.status(503).json({ ok: false, reason: "not_configured" });
    return;
  }

  const body = parseBody(req);

  // Honeypot: Menschen füllen das versteckte "website"-Feld nie aus.
  if (body.website) {
    res.status(200).json({ ok: true });
    return;
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) {
    res.status(400).json({ ok: false, reason: "invalid_email" });
    return;
  }

  const insert = await fetch(
    `${url}/rest/v1/alivemaex_signups?on_conflict=email`,
    {
      method: "POST",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        prefer: "resolution=ignore-duplicates",
      },
      body: JSON.stringify({
        email,
        source: typeof body.source === "string" ? body.source.slice(0, 40) : "landing",
        locale: String(req.headers["accept-language"] || "").slice(0, 32) || null,
      }),
    },
  );

  if (!insert.ok && insert.status !== 409) {
    res.status(502).json({ ok: false, reason: "store_failed" });
    return;
  }

  res.status(200).json({ ok: true });
};
