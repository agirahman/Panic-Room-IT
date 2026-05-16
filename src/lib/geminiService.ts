/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { Language, PersonaType } from "../types";

export async function generateChatResponse(
  prompt: string,
  language: Language,
  persona: PersonaType,
  gameState: { systemUptime: number; bossAnxiety: number; serverLoad: number }
) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return "API Key missing. (Please check Secrets in AI Studio)";
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an AI playing a character in a game called "Panic Room IT". 
    Role: ${persona}.
    Current Language: ${language === 'id' ? 'Indonesian/Bahasa Indonesia' : 'English'}.
    Game Context: The production servers are crashing during a flash sale.
    Current Game State: Uptime: ${gameState.systemUptime}%, Boss Anxiety: ${gameState.bossAnxiety}%, Server Load: ${gameState.serverLoad}%.
    
    If language is 'id', use Jaksel slang (mixed with English tech terms). Be expressive and erratic.
    If language is 'en', use Silicon Valley tech-bro panic slang. Be condescending or extremely stressed.
    
    Keep response short (max 2 sentences).
    Persona details:
    - CEO (Pak Budi): You are the BOSS. You are aggressive, impatient, and only care about money. Use ALL CAPS when uptime is below 50%. NEVER say "kak" or "please". You demand results NOW.
    - CS (Siti): You are the Customer Service lead. You are polite but extremely panicked. You use "kak" (in Indonesian) and report that users are deleting the app or trending on Twitter. You are the one pleading for help.
    - DEVOPS (Reza): You are the toxic senior dev. You are arrogant, lazy, and love shifting blame. You think the current outage is beneath you. You use tech jargon to sound superior.
    
    CRITICAL: Strictly adhere to your assigned role. A CEO must never sound like Support. Support must never sound like the CEO.
    Do not use generic assistant phrasing. Be the character.
    DO NOT use any markdown formatting (no asterisks for bold or italic). Plain text only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature: 1.0,
      }
    });

    const cleanText = response.text?.replace(/\*/g, '') || "...";
    return cleanText;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `[AI Error]: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}
