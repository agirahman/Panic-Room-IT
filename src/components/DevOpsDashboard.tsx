/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { UI_STRINGS } from '../locales/dictionary';
import { motion } from 'motion/react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip, AreaChart, Area } from 'recharts';
import { Activity, Terminal, Database, RefreshCw, Layers, Power } from 'lucide-react';

const mockMetricData = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  latency: Math.floor(Math.random() * 500) + 100,
  errors: Math.floor(Math.random() * 50),
}));

interface Incident {
  id: string;
  log: string;
  solution: string;
}

const INCIDENTS: Incident[] = [
  { id: 'db', log: "FATAL: connection to database failed", solution: 'flush' },
  { id: 'memory', log: "WARN: Memory usage exceeding 90% in cluster-01", solution: 'reboot' },
  { id: 'traffic', log: "CRITICAL: 50% of instances unhealthy", solution: 'scale' },
  { id: 'deploy', log: "ERROR: slow query detected in 'checkout_v3'", solution: 'rollback' },
];

export const DevOpsDashboard = () => {
  const { state, dispatch } = useGame();
  const lang = state.currentLanguage;
  const t = UI_STRINGS[lang];
  const [metrics, setMetrics] = useState(mockMetricData);
  const [logs, setLogs] = useState<string[]>([]);

  const currentIncident = INCIDENTS.find(i => i.id === state.activeIncidentId) || null;

  useEffect(() => {
    const interval = setInterval(() => {
      // Metric simulation
      setMetrics(prev => [
        ...prev.slice(1),
        { 
          time: prev[prev.length - 1].time + 1,
          latency: Math.floor(Math.random() * (state.serverLoad * 10)) + 100,
          errors: Math.floor(Math.random() * (100 - state.systemUptime)),
        }
      ]);

      // Incident generation logic
      if (!state.activeIncidentId && Math.random() > 0.8) {
        const newIncident = INCIDENTS[Math.floor(Math.random() * INCIDENTS.length)];
        dispatch({ type: 'SET_INCIDENT', payload: newIncident.id });
      }

      // Passive penalty if incident is active
      if (currentIncident) {
        dispatch({ 
          type: 'UPDATE_METRIC', 
          payload: { 
            systemUptime: -1.5, 
            bossAnxiety: 1.0, 
            serverLoad: 2.0 
          } 
        });
        
        if (Math.random() > 0.8) {
          setLogs(prev => [`CRITICAL: Unresolved ${currentIncident.id} is causing cascading failures!`, ...prev.slice(0, 15)]);
        }
      }

      // Log streaming
      const randomLogs = [
        "INFO: GET /api/health 200 OK",
        "INFO: New user session established",
        "INFO: Load balancer shifting traffic to us-east-1",
        "DEBUG: Cache hit for key 'product_123'",
      ];

      const logToPush = currentIncident 
        ? currentIncident.log 
        : randomLogs[Math.floor(Math.random() * randomLogs.length)];

      if (Math.random() > 0.5) {
        setLogs(prev => [logToPush, ...prev.slice(0, 15)]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [state.serverLoad, state.systemUptime, currentIncident]);

  const handleAction = (type: string) => {
    if (!currentIncident) {
      // Trying to fix something that isn't broken
      dispatch({ type: 'UPDATE_METRIC', payload: { systemUptime: -2, bossAnxiety: 5 } });
      setLogs(prev => [`WARN: System is healthy. Unnecessary '${type}' action attempted.`, ...prev.slice(0, 15)]);
      return;
    }

    if (currentIncident.solution === type) {
      // Correct solution
      const effects: Record<string, any> = {
        reboot: { systemUptime: 15, bossAnxiety: -10, serverLoad: -10 },
        flush: { systemUptime: 12, bossAnxiety: -5, serverLoad: -15 },
        scale: { systemUptime: 10, bossAnxiety: -5, serverLoad: -30 },
        rollback: { systemUptime: 20, bossAnxiety: -15, serverLoad: 0 },
      };
      dispatch({ type: 'UPDATE_METRIC', payload: effects[type] });
      setLogs(prev => [`SUCCESS: Incident '${currentIncident.id}' resolved via ${type}.`, ...prev.slice(0, 15)]);
      dispatch({ type: 'SET_INCIDENT', payload: null });
    } else {
      // Wrong solution
      dispatch({ type: 'UPDATE_METRIC', payload: { systemUptime: -10, bossAnxiety: 15, serverLoad: 10 } });
      setLogs(prev => [`ERROR: Action '${type}' failed to resolve ${currentIncident.id}. System destabilizing!`, ...prev.slice(0, 15)]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0E11] p-6 space-y-6 overflow-y-auto">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-6 h-64">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
            <Activity size={14} className="text-green-500" /> {t.latency}
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="latency" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLat)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
            <Terminal size={14} className="text-red-500" /> {t.errorRate}
          </div>
          <div className="flex-1 w-full min-h-0">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={metrics}>
                 <Line type="step" dataKey="errors" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
               </LineChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Terminal Section */}
      <div className="flex-1 bg-black border border-white/10 rounded-xl p-4 font-mono text-[10px] overflow-hidden flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2 text-gray-500 border-b border-white/5 pb-2">
           <span>$ tail -f /var/log/syslog</span>
           <span className="animate-pulse text-green-500">LIVE</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {logs.map((log, i) => {
             let color = "text-gray-400";
             if (log.includes('ERROR') || log.includes('FATAL') || log.includes('CRITICAL')) color = "text-red-500 font-bold";
             if (log.includes('SUCCESS')) color = "text-green-400";
             if (log.includes('WARN')) color = "text-yellow-400";
             if (log.includes('INFO')) color = "text-blue-400/70";
             
             return (
               <div key={i} className={color}>
                 <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {log}
               </div>
             );
          })}
          <div className="flex items-center gap-1 text-gray-500">
             <span className="animate-pulse cursor-block w-1 h-3 bg-gray-500" />
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <ActionButton 
          icon={<RefreshCw size={18} />} 
          label={t.rebooting} 
          onClick={() => handleAction('reboot')}
          color="blue"
        />
        <ActionButton 
          icon={<Database size={18} />} 
          label={t.databaseFlush} 
          onClick={() => handleAction('flush')}
          color="yellow"
        />
        <ActionButton 
          icon={<Layers size={18} />} 
          label={t.scaleHorizontal} 
          onClick={() => handleAction('scale')}
          color="green"
        />
        <ActionButton 
          icon={<Power size={18} />} 
          label={t.rollback} 
          onClick={() => handleAction('rollback')}
          color="red"
        />
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label, onClick, color }: { icon: React.ReactNode, label: string, onClick: () => void, color: string }) => {
  const colors: Record<string, string> = {
    blue: "hover:bg-blue-500/20 hover:border-blue-500/50 text-blue-400",
    yellow: "hover:bg-yellow-500/20 hover:border-yellow-500/50 text-yellow-400",
    green: "hover:bg-green-500/20 hover:border-green-500/50 text-green-400",
    red: "hover:bg-red-500/20 hover:border-red-500/50 text-red-400",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl transition-all text-sm font-medium ${colors[color]}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
