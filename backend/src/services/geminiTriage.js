const PRIORITIES = ["Low", "Medium", "High"];
const CATEGORIES = ["Billing", "Bug", "Feature Request", "Other"];

const DEFAULT_MODEL = "gemini-2.5-flash";
const DEFAULT_TIMEOUT_MS = 15000;

const FALLBACK = {
  priority: "Medium",
  category: "Other",
  suggestedReply:
    "Mock reply: Thanks for contacting support. We've received your ticket and a teammate will follow up shortly.",
};

function buildPrompt({ name, email, message }) {
  return `You are a support ticket triage assistant.
Analyze the ticket and respond with ONLY valid JSON (no markdown, no code fences) using this exact shape:
{"priority":"Low|Medium|High","category":"Billing|Bug|Feature Request|Other","suggestedReply":"one short helpful sentence"}

Rules:
- priority: High if urgent/outage/payment blocked; Medium if important but not urgent; Low if minor questions.
- category: pick the best fit from the allowed list.
- suggestedReply: one polite sentence acknowledging the issue; do not invent policy details.

Ticket:
Name: ${name}
Email: ${email}
Message: ${message}`;
}

function extractJson(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini response did not contain JSON");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

function normalizeResult(raw) {
  const priority = PRIORITIES.includes(raw.priority) ? raw.priority : null;
  const category = CATEGORIES.includes(raw.category) ? raw.category : null;
  const suggestedReply =
    typeof raw.suggestedReply === "string" && raw.suggestedReply.trim()
      ? raw.suggestedReply.trim()
      : null;

  if (!priority || !category || !suggestedReply) {
    throw new Error("Gemini returned incomplete or invalid triage fields");
  }

  return { priority, category, suggestedReply };
}

async function triageTicket({ name, email, message }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-gemini-api-key") {
    return {
      ok: false,
      ...FALLBACK,
      error: "GEMINI_API_KEY is not configured",
    };
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: buildPrompt({ name, email, message }) }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Gemini HTTP ${response.status}: ${body.slice(0, 200) || response.statusText}`
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    const parsed = normalizeResult(extractJson(text));
    return { ok: true, ...parsed, error: null };
  } catch (err) {
    const messageText =
      err?.name === "AbortError"
        ? `Gemini timed out after ${timeoutMs}ms`
        : err?.message || "Gemini triage failed";

    console.error("Triage failed:", messageText);

    return {
      ok: false,
      ...FALLBACK,
      error: messageText,
    };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  triageTicket,
  PRIORITIES,
  CATEGORIES,
  FALLBACK,
};
