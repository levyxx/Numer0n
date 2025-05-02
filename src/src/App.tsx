import { useState } from 'react';
import './App.css';

const API_BASE = ''; // 相対URL（Cloudflare Pages）や、開発環境に合わせて設定

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [guess, setGuess] = useState('');
  const [results, setResults] = useState<{ guess: string, eat: number, bite: number }[]>([]);
  const [error, setError] = useState<string | null>(null); // エラーメッセージ用の state

  const startGame = async () => {
    try {
      const res = await fetch(`${API_BASE}/start`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to start the game');
      const data = await res.json();
      setSessionId(data.session_id);
      setResults([]);
      setError(null); // エラーをリセット
    } catch (err) {
      setError('ゲームの開始に失敗しました');
      console.error(err);
    }
  };

  const makeGuess = async () => {
    if (!sessionId || guess.length !== 3) return;
    try {
      const res = await fetch(`${API_BASE}/guess?session_id=${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess })
      });
      if (!res.ok) throw new Error('Failed to submit the guess');
      const data = await res.json();
      setResults([...results, data]);
      setGuess('');
      setError(null); // エラーをリセット
    } catch (err) {
      setError('推測の送信に失敗しました');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>ヌメロン</h1>
      <button onClick={startGame}>ゲーム開始</button>
      {sessionId && (
        <div>
          <input
            value={guess}
            onChange={e => setGuess(e.target.value)}
            maxLength={3}
            disabled={guess.length === 3} // 3文字入力したら入力を無効にする
          />
          <button onClick={makeGuess} disabled={guess.length !== 3}>推測</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* エラーメッセージの表示 */}
      <ul>
        {results.map((r, i) => (
          <li key={i}>
            {r.guess} - {r.eat} EAT / {r.bite} BITE
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;