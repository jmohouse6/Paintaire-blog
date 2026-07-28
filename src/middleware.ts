import { defineMiddleware } from 'astro:middleware';

const WWW_HOST = 'www.paintaire.com';
const CANONICAL_ORIGIN = 'https://paintaire.com';

export const onRequest = defineMiddleware((context, next) => {
  const host = context.request.headers.get('host');
  if (host && host.split(':')[0].toLowerCase() === WWW_HOST) {
    const url = new URL(context.request.url);
    return context.redirect(`${CANONICAL_ORIGIN}${url.pathname}${url.search}`, 301);
  }
  return next();
});
