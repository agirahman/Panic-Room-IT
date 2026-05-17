/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { GameState, GameAction, Language } from '../types';

const initialState: GameState = {
  currentLanguage: 'id',
  systemUptime: 30,
  bossAnxiety: 50,
  serverLoad: 80,
  currentLevel: 1,
  chatHistory: [],
  isGameOver: false,
  gameStarted: false,
  isPaused: false,
  victory: false,
  aiMode: false,
  activeIncidentId: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, currentLanguage: action.payload };
    case 'UPDATE_METRIC':
      return {
        ...state,
        systemUptime: Math.min(100, Math.max(0, state.systemUptime + (action.payload.systemUptime || 0))),
        bossAnxiety: Math.min(100, Math.max(0, state.bossAnxiety + (action.payload.bossAnxiety || 0))),
        serverLoad: Math.min(120, Math.max(0, state.serverLoad + (action.payload.serverLoad || 0))),
      };
    case 'ADD_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case 'SET_GAME_OVER':
      return { ...state, isGameOver: true, victory: action.payload.victory };
    case 'RESTART_GAME':
      return { ...initialState, currentLanguage: state.currentLanguage, aiMode: state.aiMode };
    case 'TOGGLE_AI_MODE':
      return { ...state, aiMode: !state.aiMode };
    case 'TOGGLE_PAUSE':
      return { ...state, isPaused: !state.isPaused };
    case 'SET_INCIDENT':
      return { ...state, activeIncidentId: action.payload };
    case 'START_GAME':
      return { ...state, gameStarted: true };
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (state.systemUptime >= 100 && !state.isGameOver) {
      dispatch({ type: 'SET_GAME_OVER', payload: { victory: true } });
    }
    if (state.bossAnxiety >= 100 && !state.isGameOver) {
      dispatch({ type: 'SET_GAME_OVER', payload: { victory: false } });
    }
    if (state.systemUptime <= 0 && !state.isGameOver) {
      dispatch({ type: 'SET_GAME_OVER', payload: { victory: false } });
    }
  }, [state.systemUptime, state.bossAnxiety, state.isGameOver]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
