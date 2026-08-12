import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Routes
app.post("/api/generate-quote", async (req, res) => {
  try {
    const { theme, authorPreference } = req.body || {};
    const selectedTheme = theme || "General Motivation";

    if (!process.env.GEMINI_API_KEY) {
      // Fallback motivational quotes if key is not configured yet
      const fallbackQuotes = [
        "When you are an original and walk in your purpose, you shine like a star in the firmament.",
        "Discipline is choosing between what you want now and what you want most.",
        "Your dedication today builds the foundation for tomorrow's extraordinary victories.",
        "Faith doesn't make things easy; it makes them possible. Keep pushing forward.",
        "Do not wait for extraordinary opportunities. Seize common occasions and make them great.",
        "Great leadership is not about being in charge. It is about taking care of those in your charge.",
        "The secret of getting ahead is getting started with courage and unwavering focus.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts."
      ];
      const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      return res.json({ quote: randomFallback, source: "fallback" });
    }

    if (!ai) {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }

    const prompt = `Generate ONE powerful, original, uplifting, social-media-friendly motivational quote focused on the theme of "${selectedTheme}". 
Guidelines:
- It should be inspiring, memorable, concise (1-2 sentences, max 35 words).
- Do not use copyrighted quotes. Make it completely fresh and original.
- Do not enclose in quotation marks in the output.
- Avoid generic SaaS or buzzword fluff. Focus on deep human resilience, purpose, courage, character, and faith/hope.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.9,
      },
    });

    const generatedText = response.text ? response.text.trim().replace(/^["']|["']$/g, '') : "Your dedication today creates the triumph of tomorrow.";

    return res.json({ quote: generatedText });
  } catch (error: any) {
    console.error("Error generating quote with Gemini:", error);
    // Provide a resilient fallback quote on API error
    const backupQuotes = [
      "Small daily victories accumulate into undeniable lifelong achievements.",
      "Courage is not the absence of fear, but the triumph over it.",
      "Focus on the step in front of you, not the whole staircase.",
      "Your potential is determined by your willingness to persevere through difficulty."
    ];
    const quote = backupQuotes[Math.floor(Math.random() * backupQuotes.length)];
    return res.status(200).json({ quote, note: "Used fallback due to service delay" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
