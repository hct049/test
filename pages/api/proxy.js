// GAS_URL은 서버에서만 읽힙니다 — 클라이언트에 노출되지 않습니다.
import { getSession } from '../../lib/session';

const WRITE_ACTIONS = new Set(['appendRow', 'deleteLastRow', 'appendRandomRow', 'clearAllData']);

export default async function handler(req, res) {
  const gasUrl = process.env.GAS_URL;
  if (!gasUrl) return res.status(500).json({ status: 'error', message: 'GAS_URL이 설정되지 않았습니다.' });

  const action = req.method === 'GET'
    ? (req.query.action || 'getData')
    : (req.body?.action || 'appendRow');

  // 쓰기 작업은 로그인 필요
  if (WRITE_ACTIONS.has(action) && !getSession(req)) {
    return res.status(401).json({ status: 'error', message: '로그인이 필요합니다.' });
  }

  try {
    let gasRes;
    if (req.method === 'GET') {
      gasRes = await fetch(`${gasUrl}?action=${encodeURIComponent(action)}`);
    } else {
      const params = new URLSearchParams({ ...req.body, action });
      gasRes = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
    }
    const data = await gasRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ status: 'error', message: err.message });
  }
}
