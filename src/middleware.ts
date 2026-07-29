import { defineMiddleware } from 'astro:middleware';

const WWW_HOST = 'www.paintaire.com';
const CANONICAL_ORIGIN = 'https://paintaire.com';

const securityHeaders: Record<string, string> = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'SAMEORIGIN',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'content-security-policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://giscus.app",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "frame-src https://www.youtube.com https://giscus.app",
    "connect-src 'self' https://giscus.app",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join('; '),
};

export const onRequest = defineMiddleware(async (context, next) => {
  const host = context.request.headers.get('host');
  if (host && host.split(':')[0].toLowerCase() === WWW_HOST) {
    const url = new URL(context.request.url);
    return context.redirect(`${CANONICAL_ORIGIN}${url.pathname}${url.search}`, 301);
  }

  const response = await next();

  for (const [name, value] of Object.entries(securityHeaders)) {
    response.headers.set(name, value);
  }

  const { pathname } = context.url;
  if (pathname.startsWith('/_astro/') || /\.(jpg|jpeg|png|webp|svg|woff2?)$/.test(pathname)) {
    response.headers.set('cache-control', 'public, max-age=31536000, immutable');
  }

  return response;
});
