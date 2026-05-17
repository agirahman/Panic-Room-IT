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
import { sounds } from './lib/soundService';
import { AlertCircle, CheckCircle2, Play, RefreshCcw } from 'lucide-react';

const GameContent = () => {
  const { state, dispatch } = useGame();
  const lang = state.currentLanguage;
  const t = UI_STRINGS[lang];

  React.useEffect(() => {
    if (state.gameStarted && !state.isGameOver && !state.isPaused) {
      sounds.startBGM();
    } else {
      sounds.stopBGM();
    }

    if (state.isGameOver) {
      if (state.victory) {
        sounds.playVictory();
      } else {
        sounds.playGameOver();
      }
    }
  }, [state.isGameOver, state.victory, state.gameStarted, state.isPaused]);

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
          className="max-w-4xl w-full flex flex-col md:flex-row gap-8 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative z-10"
        >
          <div className="flex-1 text-center md:text-left flex flex-col justify-center">
            <div className="inline-block p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-8 mx-auto md:mx-0 w-fit">
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
            
            <div className="flex flex-col items-center md:items-start gap-4">
               <button 
                 onClick={() => { sounds.playClick(); dispatch({ type: 'START_GAME' }); }}
                 className="group relative flex items-center gap-3 px-10 py-5 bg-white text-black font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all transform hover:scale-105"
               >
                 <Play fill="currentColor" /> {t.start}
               </button>
               
               <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => { sounds.playClick(); dispatch({ type: 'SET_LANGUAGE', payload: 'id' }); }}
                    className={`px-4 py-2 rounded-xl transition-all ${lang === 'id' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Bahasa Indonesia
                  </button>
                  <button 
                    onClick={() => { sounds.playClick(); dispatch({ type: 'SET_LANGUAGE', payload: 'en' }); }}
                    className={`px-4 py-2 rounded-xl transition-all ${lang === 'en' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    English (US)
                  </button>
               </div>
            </div>
          </div>

          <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-6 text-left">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-500" /> {t.howToPlayTitle}
            </h2>
            <div className="space-y-4">
              {t.howToPlayGuide.map((step: string, i: number) => (
                <div key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                  <span className="text-blue-500 font-mono font-bold">{i + 1}.</span>
                  {step}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 text-[10px] text-gray-600 uppercase tracking-widest text-center">
              System Ready for Initialisation
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen flex flex-col bg-[#050505] text-gray-100 overflow-hidden"
      onClick={() => sounds.resumeContext()} // Global interaction to resume audio context
    >
      <GlobalHeader />
      
      <main className="flex-1 flex overflow-hidden relative">
        {/* Panic Overlay - Pulses red only when an incident is active */}
        <motion.div 
          animate={{ opacity: state.activeIncidentId && !state.isGameOver && !state.isPaused ? [0, 0.2, 0] : 0 }}
          transition={{ repeat: state.activeIncidentId && !state.isGameOver && !state.isPaused ? Infinity : 0, duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 bg-red-500 pointer-events-none z-30"
        />

        <motion.div 
          className="flex-1 flex overflow-hidden" 
          initial={{ x: 0, y: 0 }}
          animate={state.activeIncidentId && !state.isGameOver && !state.isPaused 
            ? { x: [-2, 2, -2, 0], y: [-1, 1, -1, 0] } 
            : { x: 0, y: 0 }
          }
          transition={{ repeat: state.activeIncidentId && !state.isGameOver && !state.isPaused ? Infinity : 0, duration: 0.1 }}
        >
          {/* Left Column: Slack-IT (40%) */}
          <div className="w-[40%] h-full">
            <SlackIT />
          </div>
          
          {/* Right Column: DevOps Dashboard (60%) */}
          <div className="w-[60%] h-full">
            <DevOpsDashboard />
          </div>
        </motion.div>

        {/* Pause Overlay */}
        <AnimatePresence>
          {state.isPaused && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center"
              >
                <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-8">{t.pause}</h2>
                <button 
                  onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
                  className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Play fill="currentColor" size={20} /> {t.resume}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
                onClick={() => { sounds.stopEffects(); sounds.playClick(); dispatch({ type: 'RESTART_GAME' }); }}
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
