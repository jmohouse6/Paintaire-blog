import type { APIRoute } from 'astro';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 2000;

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    if (typeof value !== 'string') {
      return jsonResponse({ error: `Field "${key}" must be a string` }, 400);
    }
    if (value.length > MAX_FIELD_LENGTH) {
      return jsonResponse({ error: `Field "${key}" exceeds maximum length` }, 400);
    }
    fields[key] = value;
  }

  const email = fields.email?.trim();
  if (!email || !EMAIL_RE.test(email)) {
    return jsonResponse({ error: 'A valid email address is required' }, 400);
  }

  const form = fields.form === 'contact' ? 'contact' : 'newsletter';

  const endpoint = import.meta.env.CRM_LEADS_ENDPOINT;
  if (!endpoint) {
    return jsonResponse({ error: 'Lead capture not configured' }, 503);
  }

  const apiKey = import.meta.env.CRM_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: 'Lead capture not configured' }, 503);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
      body: JSON.stringify({
        ...fields,
        email,
        form,
        form_source: 'advertising_brand',
      }),
      signal: controller.signal,
    });

    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
    });
  } catch {
    return jsonResponse({ error: 'Failed to reach lead capture service' }, 502);
  } finally {
    clearTimeout(timeout);
  }
};
