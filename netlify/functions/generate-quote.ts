import { GoogleGenAI } from "@google/genai";

const FALLBACK_QUOTES = [
  "When you are an original and walk in your purpose, you shine like a star in the firmament.",
  "Discipline is choosing between what you want now and what you want most.",
  "Your dedication today builds the foundation for tomorrow's extraordinary victories.",
  "Faith doesn't make things easy; it makes them possible. Keep pushing forward.",
  "Do not wait for extraordinary opportunities. Seize common occasions and make them great.",
  "Great leadership is not about being in charge. It is about taking care of those in your charge.",
  "The secret of getting ahead is getting started with courage and unwavering focus.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts."
];

export const handler = async (event: any) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "OK" })
    };
  }

  try {
    let body: any = {};
    if (event.body) {
      try {
        body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      } catch {
        body = {};
      }
    }

    const { theme } = body;
    const selectedTheme = theme || "General Motivation";
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;

    if (!apiKey) {
      const quote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          quote,
          source: "fallback",
          note: "Set GEMINI_API_KEY in Netlify Environment Variables for custom AI generations."
        })
      };
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt = `Generate ONE powerful, original, uplifting, social-media-friendly motivational quote focused on the theme of "${selectedTheme}". 
Guidelines:
- It should be inspiring, memorable, concise (1-2 sentences, max 35 words).
- Do not use copyrighted quotes. Make it completely fresh and original.
- Do not enclose in quotation marks in the output.
- Avoid generic SaaS or buzzword fluff. Focus on deep human resilience, purpose, courage, character, and faith/hope.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.9,
      },
    });

    const generatedText = response.text
      ? response.text.trim().replace(/^["']|["']$/g, '')
      : FALLBACK_QUOTES[0];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ quote: generatedText })
    };
  } catch (error: any) {
    console.error("Netlify function error:", error);
    const quote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ quote, note: "Used fallback due to service latency." })
    };
  }
};
