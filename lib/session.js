import crypto from 'crypto';

const COOKIE = 'session';
const MAX_AGE = 60 * 60 * 24; // 24h

function secret() {
  return process.env.SESSION_SECRET || 'dev-secret-please-change';
}

export function createToken(id) {
  const payload = Buffer.from(JSON.stringify({ id, iat: Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyToken(token) {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
  try {
    const a = Buffer.from(sig.padEnd(expected.length, '0'));
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b) || sig !== expected) return null;
  } catch {
    return null;
  }
  return JSON.parse(Buffer.from(payload, 'base64url').toString());
}

export function setSession(res, id) {
  res.setHeader('Set-Cookie',
    `${COOKIE}=${createToken(id)}; HttpOnly; Path=/; Max-Age=${MAX_AGE}; SameSite=Strict`);
}

export function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`);
}

export function getSession(req) {
  const raw = req.cookies?.[COOKIE] ?? parseCookies(req.headers?.cookie)?.[COOKIE];
  return verifyToken(raw || '');
}

function parseCookies(header) {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map(c => c.trim().split('=').map(s => decodeURIComponent(s.trim())))
  );
}
