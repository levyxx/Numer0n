import { useState } from 'react';
import './App.css';

const API_BASE = '';

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [guess, setGuess] = useState('');
  const [results, setResults] = useState<{ guess: string, eat: number, bite: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startGame = async () => {
    try {
      const res = await fetch(`${API_BASE}/start`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to start the game');
      const data = await res.json() as { session_id: string };
      setSessionId(data.session_id);
      setResults([]);
      setGuess('');
      setError(null);
    } catch (err) {
      setError('ゲームの開始に失敗しました');
      console.error(err);
    }
  };

  const isValidGuess = (input: string): boolean => {
    return /^[0-9]{3}$/.test(input) && new Set(input).size === 3;
  };

  const makeGuess = async () => {
    if (!sessionId) return;

    if (!isValidGuess(guess)) {
      setError('推測は3桁の数字で、すべて異なる数字で入力してください');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/guess?session_id=${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess })
      });
      if (!res.ok) throw new Error('Failed to submit the guess');
      const data = await res.json() as { guess: string; eat: number; bite: number };
      setResults([...results, data]);
      setGuess('');
      setError(null);
    } catch (err) {
      setError('推測の送信に失敗しました');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>Numer0n</h1>
      <button onClick={startGame}>
        {sessionId ? 'Restart' : 'Game start'}
      </button>
      {sessionId && (
        <div>
          <input
            value={guess}
            onChange={e => setGuess(e.target.value)}
            maxLength={3}
          />
          <button onClick={makeGuess} disabled={!isValidGuess(guess)}>
            Guess!
          </button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
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