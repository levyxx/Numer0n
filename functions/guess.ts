/// <reference types="@cloudflare/workers-types" />
type Env = {
    GAME_KV: KVNamespace;
};

type GuessRequest = {
    guess: string;
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
        return new Response("Missing session_id", { status: 400 });
    }

    const kv = env.GAME_KV;
    const secret = await kv.get(sessionId);

    if (!secret) {
        return new Response("Invalid session", { status: 400 });
    }

    let body: GuessRequest;
    try {
        body = await request.json() as GuessRequest;
    } catch {
        return new Response("Invalid JSON", { status: 400 });
    }

    const { guess } = body;

    if (!/^\d{3}$/.test(guess)) {
        return new Response("Invalid guess format. Must be 3 digits.", { status: 400 });
    }

    const result = checkGuess(secret, guess);
    return new Response(JSON.stringify({ guess, ...result }), {
        headers: { 'Content-Type': 'application/json' },
    });
};

function checkGuess(secret: string, guess: string): { eat: number; bite: number } {
    let eat = 0, bite = 0;
    for (let i = 0; i < 3; i++) {
        if (guess[i] === secret[i]) {
            eat++;
        } else if (secret.includes(guess[i])) {
            bite++;
        }
    }
    return { eat, bite };
}