import { getSession } from '../../lib/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!getSession(req)) return res.status(401).json({ ok: false, message: '로그인이 필요합니다.' });

  const token = process.env.GITHUB_TOKEN;
  const repo  = process.env.GITHUB_REPO; // 예: jtrg0044/test

  if (!token || !repo) {
    return res.status(500).json({ ok: false, message: 'GITHUB_TOKEN 또는 GITHUB_REPO가 설정되지 않았습니다.' });
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/merge-upstream`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ branch: 'main' }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ ok: true, message: data.message || '동기화 완료', detail: data });
    } else {
      return res.status(200).json({ ok: false, message: data.message || '동기화 실패', detail: data });
    }
  } catch (err) {
    res.status(502).json({ ok: false, message: err.message });
  }
}
