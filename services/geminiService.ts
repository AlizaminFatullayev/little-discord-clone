import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
// In a real backend scenario, this would be hidden behind a proxy or server-side function.
// For this client-side demo, we use it directly as per instructions.
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateBotResponse = async (
  prompt: string, 
  history: { role: string, parts: { text: string }[] }[] = []
): Promise<string> => {
  if (!ai) {
    return "I'm sorry, my brain (API Key) is missing. Please configure the environment.";
  }

  try {
    const model = ai.models;
    
    // We can use a simpler stateless call for single queries or maintain context manually
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful, witty, and slightly sarcastic Discord moderation bot named 'Gem'. Keep your answers concise and formatted nicely for a chat interface. Use markdown where appropriate.",
      }
    });

    return response.text || "I... I don't know what to say.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Make sure your API key is valid! (Error contacting Gemini)";
  }
};