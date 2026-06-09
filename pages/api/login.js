import { setSession } from '../../lib/session';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id, password } = req.body || {};
  if (id === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD) {
    setSession(res, id);
    return res.status(200).json({ ok: true });
  }
  res.status(401).json({ ok: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
}
