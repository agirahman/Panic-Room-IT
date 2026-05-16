/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { Language, PersonaType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateChatResponse(
  prompt: string,
  language: Language,
  persona: PersonaType,
  gameState: { systemUptime: number; bossAnxiety: number; serverLoad: number }
) {
  if (!process.env.GEMINI_API_KEY) {
    return "API Key missing. (Mock Mode recommended)";
  }

  const systemInstruction = `
    You are an AI playing a character in a game called "Panic Room IT". 
    Role: ${persona}.
    Current Language: ${language === 'id' ? 'Indonesian/Bahasa Indonesia' : 'English'}.
    Game Context: The production servers are crashing during a flash sale.
    Current Game State: Uptime: ${gameState.systemUptime}%, Boss Anxiety: ${gameState.bossAnxiety}%, Server Load: ${gameState.serverLoad}%.
    
    If language is 'id', use Jaksel slang (mixed with English tech terms).
    If language is 'en', use Silicon Valley tech-bro panic slang.
    
    Keep response short (max 2 sentences).
    Persona details:
    - CEO (Pak Budi): Demanding, caps lock, money-obsessed.
    - CS (Siti): Panicked, reporting user complaints from Twitter.
    - DEVOPS (Reza): Toxic, blame-shifting, lazy.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.9,
      }
    });

    return response.text || "...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to Gemini.";
  }
}
