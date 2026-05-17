/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';

export const UI_STRINGS = {
  en: {
    title: 'Panic Room IT 🚨',
    systemHealth: 'System Health',
    bossStress: 'Boss Stress Level',
    serverLoad: 'Current Load',
    flashSaleTimer: 'Flash Sale Pulse',
    uptime: 'Uptime',
    anxiety: 'Anxiety',
    fixProduction: 'Fix Production',
    runbook: 'Emergency Runbook',
    monitoring: 'Monitoring Dashboard',
    latency: 'Latency (ms)',
    errorRate: 'Error Rate (5xx)',
    logs: 'System Logs',
    gameOver: 'Game Over!',
    victory: 'System Stabilized!',
    fired: 'You are Fired!',
    restart: 'Restart Simulation',
    start: 'Initialize System',
    chooseLanguage: 'Select Region',
    aiMode: 'AI Mode (Gemini)',
    mockMode: 'Mock Mode',
    eta: 'ETA for fix?',
    rebooting: 'Rebooting servers...',
    databaseFlush: 'Flushing Redis cache...',
    scaleHorizontal: 'Spinning up new instances...',
    rollback: 'Rolling back last deploy...',
    pause: 'Pause',
    resume: 'Resume',
    howToPlayTitle: 'How to Play',
    howToPlayGuide: [
      '1. Watch the Logs: Red/Critical logs indicate an incident is happening.',
      '2. Fix it Fast: Use the Action Buttons (Reboot, Flush, etc.) that match the log error.',
      '3. Manage Stakeholders: Reply to Slack messages to keep boss stress down.',
      '4. Win Condition: Reach 100% System Health.',
      '5. Lose Condition: Reach 100% Boss Stress or 0% Health.',
    ],
  },
  id: {
    title: 'Panic Room IT 🚨',
    systemHealth: 'Kesehatan Sistem',
    bossStress: 'Level Stress Bos',
    serverLoad: 'Beban Server',
    flashSaleTimer: 'Detak Flash Sale',
    uptime: 'Waktu Aktif',
    anxiety: 'Kegelisahan',
    fixProduction: 'Perbaiki Produksi',
    runbook: 'Buku Panduan Darurat',
    monitoring: 'Dashboard Pemantauan',
    latency: 'Latensi (ms)',
    errorRate: 'Tingkat Error (5xx)',
    logs: 'Log Sistem',
    gameOver: 'Permainan Selesai!',
    victory: 'Sistem Stabil!',
    fired: 'Kamu Dipecat!',
    restart: 'Ulangi Simulasi',
    start: 'Inisialisasi Sistem',
    chooseLanguage: 'Pilih Wilayah',
    aiMode: 'Mode AI (Gemini)',
    mockMode: 'Mode Mock',
    eta: 'Berapa lama lagi benernya?',
    rebooting: 'Memulai ulang server...',
    databaseFlush: 'Membersihkan cache Redis...',
    scaleHorizontal: 'Menambah instance baru...',
    rollback: 'Rollback deploy terakhir...',
    pause: 'Jeda',
    resume: 'Lanjut',
    howToPlayTitle: 'Cara Bermain',
    howToPlayGuide: [
      '1. Pantau Log: Log Merah/Critical menandakan ada insiden.',
      '2. Perbaiki Cepat: Gunakan Tombol Aksi (Reboot, Flush, dll) yang sesuai dengan error di log.',
      '3. Kelola Stakeholder: Balas pesan Slack untuk menjaga tingkat stres bos.',
      '4. Menang: Capai 100% Kesehatan Sistem.',
      '5. Kalah: Stres Bos mencapai 100% atau Kesehatan Sistem 0%.',
    ],
  }
};

export const PERSONAS = {
  CEO: {
    name: 'Pak Budi',
    en: { role: 'CEO', title: 'Boss' },
    id: { role: 'CEO', title: 'Bos' }
  },
  CS: {
    name: 'Siti',
    en: { role: 'Customer Service Lead', title: 'Support' },
    id: { role: 'CS Lead', title: 'Support' }
  },
  DEVOPS: {
    name: 'Reza',
    en: { role: 'Senior Developer', title: 'Colleague' },
    id: { role: 'Senior Dev', title: 'Temen Kerja' }
  },
  SYSTEM: {
    name: 'System',
    en: { role: 'Automated Alert', title: 'Bot' },
    id: { role: 'Peringatan Otomatis', title: 'Bot' }
  }
};
