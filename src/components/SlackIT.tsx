/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { PERSONAS } from '../locales/dictionary';
import { motion, AnimatePresence } from 'motion/react';
import { Hash, MessageSquare, Send, User } from 'lucide-react';
import { generateChatResponse } from '../lib/geminiService';
import { PersonaType, DialogueChoice } from '../types';

export const SlackIT = () => {
  const { state, dispatch } = useGame();
  const lang = state.currentLanguage;
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatHistory]);

  // Alert when incident happens
  useEffect(() => {
    if (state.activeIncidentId && state.gameStarted) {
      const responsePersona: PersonaType = Math.random() > 0.6 ? 'CEO' : (Math.random() > 0.5 ? 'CS' : 'DEVOPS');
      const personaData = PERSONAS[responsePersona];
      
      const triggerAlert = async () => {
        let msgText = "";
        
        if (state.aiMode) {
          msgText = await generateChatResponse(
            `ALERT: Incident just started: ${state.activeIncidentId}. Shout about it to the team!`,
            lang,
            responsePersona,
            { systemUptime: state.systemUptime, bossAnxiety: state.bossAnxiety, serverLoad: state.serverLoad }
          );
        } else {
          const alertMessages: Record<string, Record<PersonaType, Record<string, string>>> = {
            db: {
              CEO: { id: "WOI DATABASE MATI YA?? RUGI GEDE KITA!", en: "IS THE DATABASE DOWN?? WE'RE LOSING HUGE MONEY!" },
              CS: { id: "Kak, database error terus, user gabisa bayar!", en: "Hey, database keeps failing, users can't pay!" },
              DEVOPS: { id: "Query db lu ampas bgt, koneksi pool penuh tuh.", en: "Your queries are trash, connection pool is exhausted." },
              SYSTEM: { id: "DB Connection failure", en: "DB Connection failure" }
            },
            memory: {
              CEO: { id: "SERVER LEMOT BANGET! BELI RAM BARU SANA!", en: "SERVERS ARE SO SLOW! GO BUY MORE RAM!" },
              CS: { id: "Duh kak, aplikasinya nge-hang terus di user.", en: "Oh no, the app keeps freezing for our users." },
              DEVOPS: { id: "Memory leaking tuh, siapa yg nulis code sampah?", en: "Memory is leaking, who wrote this garbage code?" },
              SYSTEM: { id: "High memory usage", en: "High memory usage" }
            },
            traffic: {
              CEO: { id: "USER PADA KABUR! FIX IN SEKARANG JUGA!", en: "USERS ARE LEAVING! FIX THIS RIGHT NOW!" },
              CS: { id: "Kak, Twitter rame bgt #StartupAmpas trending!", en: "Hey, Twitter is blowing up #StartupAmpas is trending!" },
              DEVOPS: { id: "Traffic spike doang kaget, cemen bgt infra lu.", en: "Just a traffic spike, your infra is so weak." },
              SYSTEM: { id: "Traffic surge detected", en: "Traffic surge detected" }
            },
            deploy: {
              CEO: { id: "SIAPA YANG PUSH CODE ERROR?? PECAT AJA!", en: "WHO PUSHED BROKEN CODE?? FIRE THEM!" },
              CS: { id: "Aplikasi kok makin aneh kak abis update tadi?", en: "Why is the app weirder after the update?" },
              DEVOPS: { id: "Kan udah dibilang jgn deploy Jumat, ngeyel lu.", en: "I told you not to deploy on Friday, you're so stubborn." },
              SYSTEM: { id: "Latence increase after deploy", en: "Latence increase after deploy" }
            }
          };
          msgText = alertMessages[state.activeIncidentId]?.[responsePersona]?.[lang] || "System Alert!";
        }

        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: Math.random().toString(),
            sender: personaData.name,
            text: msgText,
            timestamp: new Date(),
            persona: responsePersona,
          }
        });
      };

      triggerAlert();
    }
  }, [state.activeIncidentId, state.gameStarted]);

  const choices: DialogueChoice[] = [
    { 
      text: { en: "I'm on it! 🫡", id: "Lagi gw benerin! 🫡" },
      effect: { systemUptime: 2, bossAnxiety: -5 }
    },
    { 
      text: { en: "Calm down, it's just a spike.", id: "Santai, cuma spike doang itu." },
      effect: { systemUptime: -2, bossAnxiety: 10 }
    },
    { 
      text: { en: "Which channel is reporting this?", id: "Channel mana yang lapor?" },
      effect: { systemUptime: 0, bossAnxiety: 2 }
    }
  ];

  const handleChoice = async (choice: DialogueChoice) => {
    const userMsg = {
      id: Math.random().toString(),
      sender: 'You',
      text: choice.text[lang],
      timestamp: new Date(),
      persona: 'SYSTEM' as PersonaType,
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
    if (choice.effect) dispatch({ type: 'UPDATE_METRIC', payload: choice.effect });

    setTimeout(async () => {
      const responsePersona: PersonaType = Math.random() > 0.5 ? 'CEO' : (Math.random() > 0.5 ? 'CS' : 'DEVOPS');
      const personaData = PERSONAS[responsePersona];
      
      let responseText = "";
      if (state.aiMode) {
        responseText = await generateChatResponse("Reply to my message: " + choice.text[lang] + ". Current incident: " + state.activeIncidentId, lang, responsePersona, { systemUptime: state.systemUptime, bossAnxiety: state.bossAnxiety, serverLoad: state.serverLoad });
      } else {
         if (responsePersona === 'CEO') {
           responseText = lang === 'id' ? "CEPETAN! GW MAU MEETING SAMA INVESTOR INI!" : "HURRY! I HAVE AN INVESTOR PITCH IN 5 MINUTES!";
         } else if (responsePersona === 'CS') {
           responseText = lang === 'id' ? "Makasih kak, moga cepet bener ya. User udah makin galak." : "Thanks, hope it gets fixed soon. Users are getting aggressive.";
         } else {
           responseText = lang === 'id' ? "Gitu doang heboh. Lu liat tuh repo sebelah, bug-nya lebih parah." : "Always so dramatic. Look at the other repo, their bugs are way worse.";
         }
      }

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Math.random().toString(),
          sender: personaData.name,
          text: responseText,
          timestamp: new Date(),
          persona: responsePersona,
        }
      });
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1D21] border-r border-white/5">
      {/* Sidebar - Desktop Only for density */}
      <div className="hidden md:flex flex-col border-b border-white/5 p-4 shrink-0">
        <div className="font-black text-white flex items-center gap-2 text-lg italic tracking-tight">
          <MessageSquare size={20} className="text-blue-500" /> SLACK-IT
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Nav Sidebar */}
        <div className="w-16 md:w-48 bg-[#121417] border-r border-white/5 flex flex-col py-4 overflow-y-auto">
           <div className="px-4 mb-6">
              <div className="text-[10px] uppercase font-bold text-gray-600 mb-2 hidden md:block">Channels</div>
              <div className="flex flex-col gap-1">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-md flex items-center gap-2 text-xs font-bold ring-1 ring-blue-500/30">
                  <Hash size={14} /> <span className="hidden md:inline">incident-war-room</span>
                </div>
                <div className="p-2 text-gray-500 rounded-md flex items-center gap-2 text-xs hover:bg-white/5 cursor-not-allowed">
                  <Hash size={14} /> <span className="hidden md:inline">general</span>
                </div>
              </div>
           </div>

           <div className="px-4">
              <div className="text-[10px] uppercase font-bold text-gray-600 mb-2 hidden md:block">Direct Messages</div>
              <div className="flex flex-col gap-1">
                {Object.entries(PERSONAS).map(([key, p]) => (
                  <div key={key} className="p-2 text-gray-400 rounded-md flex items-center gap-2 text-xs hover:bg-white/5 cursor-pointer group">
                    <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    <span className="hidden md:inline group-hover:text-white transition-colors">{p.name}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1A1D21]">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <AnimatePresence initial={false}>
              {state.chatHistory.map((msg) => {
                const isUser = msg.sender === 'You';
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: isUser ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={msg.id} 
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${isUser ? 'bg-blue-500/20 border-blue-500/30' : 'bg-white/5 border-white/10'}`}>
                        <User size={16} className={isUser ? 'text-blue-400' : 'text-gray-400'} />
                      </div>
                      
                      <div className={`space-y-1 ${isUser ? 'items-end flex flex-col' : ''}`}>
                        <div className={`flex items-baseline gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                          <span className={`font-bold text-[11px] uppercase tracking-wider ${isUser ? 'text-blue-400' : 'text-gray-300'}`}>
                            {msg.sender}
                          </span>
                          <span className="text-[9px] text-gray-600 font-mono">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          isUser 
                          ? 'bg-blue-600 text-white rounded-tr-none border border-blue-500/50' 
                          : 'bg-[#222529] text-gray-200 rounded-tl-none border border-white/5'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Action choices */}
          <div className="p-4 border-t border-white/5 bg-[#121417]">
            <div className="flex flex-col gap-2">
                <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1 mb-1">Response Options</div>
                <div className="grid grid-cols-1 gap-2">
                  {choices.map((choice, i) => (
                    <button
                      key={i}
                      disabled={state.isGameOver}
                      onClick={() => handleChoice(choice)}
                      className="group relative flex items-center justify-between w-full p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-blue-500/10 hover:border-blue-500/30 text-xs text-gray-400 hover:text-white transition-all text-left"
                    >
                      <span>{choice.text[lang]}</span>
                      <Send size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                    </button>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
