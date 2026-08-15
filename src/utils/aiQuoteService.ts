import { GoogleGenAI } from '@google/genai';

const FALLBACK_QUOTES: Record<string, string[]> = {
  'General Motivation': [
    'When you are an original and walk in your purpose, you shine like a star in the firmament.',
    'Discipline is choosing between what you want now and what you want most.',
    'Your dedication today builds the foundation for tomorrow\'s extraordinary victories.',
    'Small daily victories accumulate into undeniable lifelong achievements.'
  ],
  'Business & Career': [
    'Success is the sum of small efforts, repeated day in and day out with relentless focus.',
    'Opportunities don\'t happen by chance; you engineer them through preparation and action.',
    'The market rewards those who create undeniable value before seeking recognition.'
  ],
  'Fitness & Health': [
    'Strength does not come from what you can do. It comes from overcoming the things you once thought you couldn\'t.',
    'Your body can stand almost anything; it\'s your mind that you have to convince.',
    'Consistency in discipline produces mastery in vitality.'
  ],
  'Creativity & Art': [
    'Creativity is intelligence having fun, turning blank space into resonant emotion.',
    'Do not wait for inspiration. Start creating, and inspiration will meet you at work.'
  ],
  'Spiritual & Faith': [
    'Faith doesn\'t make things easy; it makes them possible. Keep pushing forward.',
    'Peace comes when you trust that your steps are guided and your purpose is certain.'
  ],
  'Minimal & Stoic': [
    'You have power over your mind, not outside events. Realize this, and you will find strength.',
    'He who is brave is free. Master yourself before seeking to conquer the world.'
  ]
};

export async function fetchAiQuote(theme: string, authorPreference?: string): Promise<string> {
  const selectedTheme = theme || 'General Motivation';

  // 1. Try server endpoint first (/api/generate-quote routes to Express or Netlify Functions)
  try {
    const res = await fetch('/api/generate-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: selectedTheme, authorPreference })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.quote && typeof data.quote === 'string') {
        return data.quote.trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch (err) {
    console.warn('Backend API request skipped or failed, trying direct client environment fallback:', err);
  }

  // 2. Client-side fallback if VITE_GEMINI_API_KEY is configured directly in Netlify site environment
  const clientApiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;
  if (clientApiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: clientApiKey });
      const prompt = `Generate ONE powerful, original, uplifting motivational quote focused on the theme of "${selectedTheme}". Concise (1-2 sentences, max 30 words), no quotes.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      if (response.text) {
        return response.text.trim().replace(/^["']|["']$/g, '');
      }
    } catch (clientErr) {
      console.warn('Direct client Gemini call error:', clientErr);
    }
  }

  // 3. Resilient curated fallback list
  const themePool = FALLBACK_QUOTES[selectedTheme] || FALLBACK_QUOTES['General Motivation'];
  return themePool[Math.floor(Math.random() * themePool.length)];
}
