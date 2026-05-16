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
    if (state.activeIncidentId) {
      const responsePersona: PersonaType = Math.random() > 0.6 ? 'CEO' : (Math.random() > 0.5 ? 'CS' : 'DEVOPS');
      const personaData = PERSONAS[responsePersona];
      
      const alertMessages: Record<string, Record<string, string>> = {
        db: {
          id: "WOI DATABASE MATI YA?? ERROR KEBANYAKAN KONEKSI!",
          en: "IS THE DATABASE DOWN?? TOO MANY CONNECTIONS ERROR!"
        },
        memory: {
          id: "Memory server udah 99% nih, dikit lagi meledak kayaknya.",
          en: "Server memory is at 99%, I think it's about to explode."
        },
        traffic: {
          id: "Kak, ini kenapa checkout gagal terus? User udah ngamuk di DM Twitter!",
          en: "Hey, why is checkout failing? Users are literalually screaming in our DMs!"
        },
        deploy: {
          id: "Siapa yang push barusan? Latensinya gila bgt 5 detik!",
          en: "Who just pushed code? Latency is insane, like 5 seconds!"
        }
      };

      const msgText = alertMessages[state.activeIncidentId]?.[lang] || "System Alert!";

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
    }
  }, [state.activeIncidentId]);

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
           responseText = lang === 'id' ? "DITUNGGU! JANGAN LAMA!" : "I'M WAITING! DON'T BE LATE!";
         } else if (responsePersona === 'CS') {
           responseText = lang === 'id' ? "Ok kak, gw kabarin user dulu ya." : "Okay, I'll update the users for now.";
         } else {
           responseText = lang === 'id' ? "Tuh kan, makanya dengerin kata gw." : "See? This is why you should listen to me.";
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
