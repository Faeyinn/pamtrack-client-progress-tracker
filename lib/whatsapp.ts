export type SendWhatsAppResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; status: number; error: string; data?: unknown };

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function sendWhatsAppFonnte(params: {
  to: string;
  message: string;
}): Promise<SendWhatsAppResult> {
  const apiKey = process.env.FONNTE_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      error: "FONNTE_API_KEY is not configured",
    };
  }

  const url = process.env.FONNTE_API_URL || "https://api.fonnte.com/send";

  const body = new URLSearchParams();
  body.set("target", params.to);
  body.set("message", params.message);

  const abortController = new AbortController();
  const timeoutMs = Number(process.env.FONNTE_TIMEOUT_MS || 15000);
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      signal: abortController.signal,
    });

    const raw = await response.text();
    const data = safeJsonParse(raw);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: "Fonnte request failed",
        data,
      };
    }

    return { ok: true, status: response.status, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown WhatsApp error";
    return { ok: false, status: 0, error: message };
  } finally {
    clearTimeout(timeoutId);
  }
}
