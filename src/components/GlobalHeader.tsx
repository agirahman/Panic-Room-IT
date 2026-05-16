/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGame } from '../context/GameContext';
import { UI_STRINGS } from '../locales/dictionary';
import { motion } from 'motion/react';
import { Globe, ShieldAlert, Cpu, UserCircle } from 'lucide-react';

export const GlobalHeader = () => {
  const { state, dispatch } = useGame();
  const lang = state.currentLanguage;
  const t = UI_STRINGS[lang];

  return (
    <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
          <span className="text-red-500 animate-pulse">●</span> {t.title}
        </h1>
        
        <div className="flex items-center gap-6 ml-10 overflow-hidden">
          <div className="flex flex-col gap-1 w-32">
             <div className="flex justify-between text-[10px] uppercase tracking-wider text-gray-400">
               <span>{t.uptime}</span>
               <span>{state.systemUptime}%</span>
             </div>
             <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${state.systemUptime}%` }}
                 className={state.systemUptime < 40 ? "h-full bg-red-500" : "h-full bg-green-500"}
               />
             </div>
          </div>

          <div className="flex flex-col gap-1 w-32">
             <div className="flex justify-between text-[10px] uppercase tracking-wider text-gray-400">
               <span>{t.anxiety}</span>
               <span>{state.bossAnxiety}%</span>
             </div>
             <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${state.bossAnxiety}%` }}
                 className={state.bossAnxiety > 70 ? "h-full bg-red-500" : "h-full bg-yellow-500"}
               />
             </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_AI_MODE' })}
          className={state.aiMode ? "bg-purple-500/20 text-purple-400 border border-purple-500/50 px-3 py-1 rounded text-xs transition-colors" : "bg-white/5 text-gray-400 border border-white/10 px-3 py-1 rounded text-xs transition-colors"}
        >
          {state.aiMode ? t.aiMode : t.mockMode}
        </button>

        <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5">
          <button 
            onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'id' })}
            className={lang === 'id' ? "bg-white/10 px-2 py-1 rounded text-[10px] font-bold" : "px-2 py-1 rounded text-[10px] text-gray-500"}
          >
            ID
          </button>
          <button 
            onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'en' })}
            className={lang === 'en' ? "bg-white/10 px-2 py-1 rounded text-[10px] font-bold" : "px-2 py-1 rounded text-[10px] text-gray-500"}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
};
