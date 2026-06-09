import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const [mounted, setMounted]     = useState(false);
  const [rows, setRows]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [loggedIn, setLoggedIn]   = useState(false);
  const [userId, setUserId]       = useState('');
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState({ id: '', password: '' });
  const [loginErr, setLoginErr]   = useState('');
  const [toast, setToast]         = useState(null);
  const [addForm, setAddForm]     = useState({ name: '', email: '', message: '' });
  const [busy, setBusy]           = useState(false);

  // ── 데이터 로드 ──────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/proxy?action=getData');
      const data = await res.json();
      setRows(data.rows || []);
    } catch {
      showToast('error', '데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── 마운트 + 세션 확인 ───────────────────────────────────
  useEffect(() => {
    setMounted(true);
    fetch('/api/me').then(r => r.json()).then(d => {
      setLoggedIn(d.loggedIn);
      setUserId(d.id || '');
    });
    loadData();
  }, [loadData]);

  // ── 로그인 ───────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault();
    setLoginErr('');
    const res  = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.ok) {
      setLoggedIn(true);
      setUserId(form.id);
      setModal(false);
      setForm({ id: '', password: '' });
      showToast('success', '로그인 되었습니다.');
    } else {
      setLoginErr(data.message || '로그인 실패');
    }
  }

  // ── 로그아웃 ─────────────────────────────────────────────
  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    setLoggedIn(false);
    setUserId('');
    showToast('success', '로그아웃 되었습니다.');
  }

  // ── 액션 공통 요청 ────────────────────────────────────────
  async function callAction(action, body = {}) {
    setBusy(true);
    try {
      const res  = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...body }),
      });
      const data = await res.json();
      if (data.status === 'error') {
        showToast('error', data.message);
      } else {
        showToast('success', data.message || '완료');
        await loadData();
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setBusy(false);
    }
  }

  // ── 글 저장 ──────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (!addForm.name || !addForm.email) {
      showToast('error', '이름과 이메일은 필수입니다.');
      return;
    }
    await callAction('appendRow', { ...addForm, timestamp: new Date().toISOString() });
    setAddForm({ name: '', email: '', message: '' });
  }

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }

  function formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return isNaN(d) ? ts : d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  }

  // SSR과 클라이언트 첫 렌더를 일치시켜 hydration 오류 방지
  if (!mounted) return null;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; background: #f4f6f9; color: #1a1a2e; }
        a { color: inherit; text-decoration: none; }

        /* ── 레이아웃 ── */
        .wrap { max-width: 900px; margin: 0 auto; padding: 24px 16px 60px; }

        /* ── 헤더 ── */
        .header { display: flex; align-items: center; justify-content: space-between;
                  margin-bottom: 28px; }
        .header h1 { font-size: 1.4rem; }
        .header-right { display: flex; align-items: center; gap: 10px; }
        .user-label { font-size: 0.85rem; color: #555; }

        /* ── 버튼 ── */
        .btn { padding: 8px 16px; border: none; border-radius: 7px; font-size: 0.88rem;
               cursor: pointer; font-weight: 500; transition: filter .15s; color: #fff; }
        .btn:hover:not(:disabled) { filter: brightness(.88); }
        .btn:disabled { opacity: .5; cursor: not-allowed; }
        .btn-primary  { background: #4f46e5; }
        .btn-cyan     { background: #0891b2; }
        .btn-green    { background: #059669; }
        .btn-orange   { background: #d97706; }
        .btn-red      { background: #dc2626; }
        .btn-ghost    { background: transparent; color: #555; border: 1px solid #ccc; }
        .btn-ghost:hover:not(:disabled) { background: #f0f0f0; filter: none; }

        /* ── 카드 ── */
        .card { background: #fff; border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,.08); padding: 24px; margin-bottom: 20px; }
        .card-title { font-size: 0.8rem; font-weight: 600; text-transform: uppercase;
                      letter-spacing: .05em; color: #888; margin-bottom: 16px; }

        /* ── 폼 ── */
        .field { margin-bottom: 12px; }
        .field label { display: block; font-size: .83rem; color: #555; margin-bottom: 4px; }
        .field input, .field textarea {
          width: 100%; padding: 9px 12px; border: 1px solid #ddd; border-radius: 7px;
          font-size: .93rem; outline: none; transition: border .2s; }
        .field input:focus, .field textarea:focus { border-color: #4f46e5; }
        .field textarea { resize: vertical; min-height: 68px; }

        /* ── 액션 버튼 행 ── */
        .action-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }

        /* ── 테이블 ── */
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: .88rem; }
        thead tr { background: #f8f9fb; }
        th { padding: 10px 12px; text-align: left; font-weight: 600;
             border-bottom: 2px solid #e8eaed; white-space: nowrap; }
        td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0;
             max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fafafa; }
        .empty { text-align: center; padding: 40px; color: #aaa; font-size: .9rem; }

        /* ── 로그인 모달 ── */
        .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.45);
                    display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal { background: #fff; border-radius: 14px; padding: 32px 28px;
                 width: 100%; max-width: 360px; box-shadow: 0 8px 32px rgba(0,0,0,.2); }
        .modal h2 { font-size: 1.15rem; margin-bottom: 20px; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
        .login-err { color: #dc2626; font-size: .82rem; margin-top: 8px; }

        /* ── 토스트 ── */
        .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
                 padding: 10px 20px; border-radius: 8px; font-size: .88rem; z-index: 200;
                 box-shadow: 0 4px 14px rgba(0,0,0,.15); white-space: nowrap; }
        .toast.success { background: #059669; color: #fff; }
        .toast.error   { background: #dc2626; color: #fff; }
      `}</style>

      <div className="wrap">
        {/* ── 헤더 ── */}
        <div className="header">
          <h1>📋 Spreadsheet DB</h1>
          <div className="header-right">
            {loggedIn ? (
              <>
                <span className="user-label">{userId} 님</span>
                <button className="btn btn-ghost" onClick={handleLogout}>로그아웃</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => { setModal(true); setLoginErr(''); }}>
                로그인
              </button>
            )}
          </div>
        </div>

        {/* ── 액션 버튼 (로그인 시만) ── */}
        {loggedIn && (
          <div className="action-bar">
            <button className="btn btn-green"  disabled={busy} onClick={() => callAction('appendRandomRow')}>🎲 랜덤 데이터 입력</button>
            <button className="btn btn-orange" disabled={busy} onClick={() => callAction('deleteLastRow')}>🗑 마지막 행 삭제</button>
            <button className="btn btn-red"    disabled={busy}
              onClick={() => { if (confirm('헤더를 제외한 모든 데이터를 삭제합니다. 계속할까요?')) callAction('clearAllData'); }}>
              ⚠️ 전체 삭제
            </button>
            <button className="btn btn-cyan"   disabled={busy} onClick={loadData}>🔄 새로고침</button>
          </div>
        )}

        {/* ── 글 작성 (로그인 시만) ── */}
        {loggedIn && (
          <div className="card">
            <div className="card-title">새 데이터 입력</div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="field">
                  <label>이름</label>
                  <input value={addForm.name} placeholder="홍길동"
                    onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="field">
                  <label>이메일</label>
                  <input type="email" value={addForm.email} placeholder="example@email.com"
                    onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div className="field">
                <label>메시지</label>
                <textarea value={addForm.message} placeholder="내용을 입력하세요"
                  onChange={e => setAddForm(p => ({ ...p, message: e.target.value }))} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={busy}>💾 저장</button>
            </form>
          </div>
        )}

        {/* ── 데이터 게시판 ── */}
        <div className="card">
          <div className="card-title">데이터 목록 ({rows.length}건)</div>
          {loading ? (
            <p className="empty">불러오는 중...</p>
          ) : rows.length === 0 ? (
            <p className="empty">데이터가 없습니다.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>시간</th>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>메시지</th>
                  </tr>
                </thead>
                <tbody>
                  {[...rows].reverse().map((row, i) => (
                    <tr key={i}>
                      <td style={{ color: '#aaa', width: 40 }}>{rows.length - i}</td>
                      <td style={{ color: '#888', width: 160 }}>{formatDate(row.timestamp)}</td>
                      <td>{row.name}</td>
                      <td>{row.email}</td>
                      <td title={row.message}>{row.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── 로그인 모달 ── */}
      {modal && (
        <div className="backdrop" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal">
            <h2>🔐 로그인</h2>
            <form onSubmit={handleLogin}>
              <div className="field">
                <label>아이디</label>
                <input autoFocus value={form.id} placeholder="아이디 입력"
                  onChange={e => setForm(p => ({ ...p, id: e.target.value }))} />
              </div>
              <div className="field">
                <label>비밀번호</label>
                <input type="password" value={form.password} placeholder="비밀번호 입력"
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              </div>
              {loginErr && <p className="login-err">{loginErr}</p>}
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>취소</button>
                <button type="submit" className="btn btn-primary">로그인</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 토스트 ── */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
