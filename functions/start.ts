type Env = {
    GAME_KV: KVNamespace;
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
const secret = generateSecret();
const sessionId = crypto.randomUUID();
const kv = context.env.GAME_KV as KVNamespace;
await kv.put(sessionId, secret, { expirationTtl: 3600 });
return new Response(JSON.stringify({ session_id: sessionId }), {
    headers: { 'Content-Type': 'application/json' },
});
};

function generateSecret(): string {
const digits = Array.from({ length: 10 }, (_, i) => i);
for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
}
return digits.slice(0, 3).join('');
}