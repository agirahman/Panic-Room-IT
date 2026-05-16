/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { GlobalHeader } from './components/GlobalHeader';
import { SlackIT } from './components/SlackIT';
import { DevOpsDashboard } from './components/DevOpsDashboard';
import { UI_STRINGS } from './locales/dictionary';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Play, RefreshCcw } from 'lucide-react';

const GameContent = () => {
  const { state, dispatch } = useGame();
  const lang = state.currentLanguage;
  const t = UI_STRINGS[lang];

  if (!state.gameStarted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-950/30 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-xl relative z-10"
        >
          <div className="inline-block p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-8">
            <AlertCircle className="text-red-500 w-12 h-12" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-4 uppercase italic">
            Panic Room IT
          </h1>
          <p className="text-gray-400 mb-10 text-lg leading-relaxed">
            {lang === 'id' 
              ? "Hari pertama jadi Tech Lead dan server langsung jebol pas Flash Sale. Bisa benerin sblm dipecat?" 
              : "First day as Tech Lead and servers are crashing during a Flash Sale. Can you fix it before getting fired?"}
          </p>
          
          <div className="flex flex-col items-center gap-4">
             <button 
               onClick={() => dispatch({ type: 'START_GAME' })}
               className="group relative flex items-center gap-3 px-10 py-5 bg-white text-black font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all transform hover:scale-105"
             >
               <Play fill="currentColor" /> {t.start}
             </button>
             
             <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'id' })}
                  className={`px-4 py-2 rounded-xl transition-all ${lang === 'id' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Bahasa Indonesia
                </button>
                <button 
                  onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'en' })}
                  className={`px-4 py-2 rounded-xl transition-all ${lang === 'en' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  English (US)
                </button>
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-gray-100 overflow-hidden">
      <GlobalHeader />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Column: Slack-IT (40%) */}
        <div className="w-[40%] h-full">
          <SlackIT />
        </div>
        
        {/* Right Column: DevOps Dashboard (60%) */}
        <div className="w-[60%] h-full">
          <DevOpsDashboard />
        </div>
      </main>

      {/* Game Over Overlays */}
      <AnimatePresence>
        {state.isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-10 text-center"
            >
              {state.victory ? (
                <>
                  <div className="inline-block p-4 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                    <CheckCircle2 className="text-green-500 w-16 h-16" />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-4 uppercase italic">
                    {t.victory}
                  </h2>
                  <p className="text-gray-400 mb-8">
                    {lang === 'id' 
                      ? "Gokil! Sistem aman, diskon lancar, bos senyum, bonus cair (mungkin)." 
                      : "Insane! System stable, sale successful, boss is happy, bonus incoming (maybe)."}
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-block p-4 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                    <AlertCircle className="text-red-500 w-16 h-16" />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-4 uppercase italic">
                    {t.fired}
                  </h2>
                  <p className="text-gray-400 mb-8">
                    {lang === 'id' 
                      ? "Yah, server meledak, CEO ngamuk, kamu balik nganggur. Coba lagi kawan." 
                      : "Well, servers exploded, CEO is fuming, and you're unemployed. Try again friend."}
                  </p>
                </>
              )}

              <button 
                onClick={() => dispatch({ type: 'RESTART_GAME' })}
                className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
              >
                <RefreshCcw size={20} /> {t.restart}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
