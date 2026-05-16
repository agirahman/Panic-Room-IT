/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'id' | 'en';

export type PersonaType = 'CEO' | 'CS' | 'DEVOPS' | 'SYSTEM';

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  persona: PersonaType;
  avatar?: string;
}

export interface DialogueChoice {
  text: {
    en: string;
    id: string;
  };
  effect: {
    systemUptime?: number;
    bossAnxiety?: number;
    serverLoad?: number;
  };
  nextStep?: string;
}

export interface GameState {
  currentLanguage: Language;
  systemUptime: number; // 0-100
  bossAnxiety: number; // 0-100
  serverLoad: number; // 0-100
  currentLevel: number;
  chatHistory: ChatMessage[];
  isGameOver: boolean;
  gameStarted: boolean;
  victory: boolean;
  aiMode: boolean;
  activeIncidentId: string | null;
}

export type GameAction =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'UPDATE_METRIC'; payload: Partial<Pick<GameState, 'systemUptime' | 'bossAnxiety' | 'serverLoad'>> }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_GAME_OVER'; payload: { victory: boolean } }
  | { type: 'RESTART_GAME' }
  | { type: 'TOGGLE_AI_MODE' }
  | { type: 'SET_INCIDENT'; payload: string | null }
  | { type: 'START_GAME' };
