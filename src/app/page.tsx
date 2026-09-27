'use client';

import React, { useState } from 'react';
import { useTelemetry } from '../hooks/useTelemetry';
import { Navbar } from '../components/Navbar';
import { TelemetryHUD } from '../components/TelemetryHUD';
import { ComplexFinancialForm } from '../components/ComplexFinancialForm';
import { DynamicRenderer } from '../components/DynamicRenderer';
import { Brain, Code2, ShieldCheck, Wand2, ArrowRight, Play, RotateCcw, Zap, MousePointer2, Activity } from 'lucide-react';

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: MousePointer2,
    title: 'Friction Detected',
    desc: 'The app tracks cursor speed, hover hesitation, rage clicks, and error rates in real time.',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
  },
  {
    step: '02',
    icon: Brain,
    title: 'AI Writes New UI',
    desc: 'When cognitive load crosses the threshold, Gemini AI generates a fresh simplified React component.',
    color: 'text-indigo-400',
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
  },
  {
    step: '03',
    icon: ShieldCheck,
    title: 'Safety Check',
    desc: 'Babel AST engine scans the generated code for unsafe patterns before it ever reaches your browser.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
  },
  {
    step: '04',
    icon: Wand2,
    title: 'UI Morphs Live',
    desc: 'The complex form transforms into a friendly step-by-step wizard — no page reload needed.',
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
  },
];

export default function Page() {
  const {
    isConnected,
    cognitiveState,
    pipelineStatus,
    generatedComponent,
    triggerManualHealing,
    resetSession,
    incrementErrorCount
  } = useTelemetry();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-[100px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <Navbar isConnected={isConnected} />

      <main className="flex-1 relative z-10">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Self-Healing Generative UI Engine
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Forms that fix themselves<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              when you get stuck
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg leading-relaxed">
            AuraGen watches how you interact with a form. The moment it detects confusion —
            hesitation, rage clicks, repeated errors — it rewrites the UI on the fly using AI.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Gemini 1.5 Flash
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Babel AST Safety
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm">
              <Activity className="w-4 h-4 text-amber-400" />
              Real-time WebSocket
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className={`relative p-5 rounded-2xl bg-slate-900/60 border ${item.border} backdrop-blur-sm space-y-3 group hover:bg-slate-900 transition-all duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${item.bg} border ${item.border}`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className={`text-3xl font-black font-mono ${item.color} opacity-20 group-hover:opacity-40 transition-opacity`}>
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{item.title}</p>
                    <p className="text-slate-400 text-xs leading-relaxed mt-1">{item.desc}</p>
                  </div>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 z-10" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Live Demo ─────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 space-y-6">
          {/* Demo header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-indigo-400" />
                Live Demo
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Try the form below, or use the buttons to instantly simulate a frustrated user.
              </p>
            </div>

            {/* Quick action buttons — prominent, always visible */}
            <div className="flex flex-wrap items-center gap-3">
              {generatedComponent ? (
                <button
                  onClick={resetSession}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Original Form
                </button>
              ) : (
                <>
                  <button
                    onClick={() => triggerManualHealing('MACRS Asset Depreciation Schedule')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-sm font-semibold transition-all"
                  >
                    <MousePointer2 className="w-4 h-4" />
                    Simulate Hesitation
                  </button>
                  <button
                    onClick={() => triggerManualHealing('EBITDA & Pass-Through Schedule')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    Trigger AI Healing
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Telemetry strip */}
          <TelemetryHUD
            isConnected={isConnected}
            cognitiveState={cognitiveState}
            pipelineStatus={pipelineStatus}
            generatedComponent={generatedComponent}
            onManualTrigger={triggerManualHealing}
            onResetSession={resetSession}
          />

          {/* The form / healed component */}
          <div className="transition-all duration-300">
            {generatedComponent ? (
              <DynamicRenderer
                codeString={generatedComponent.code}
                source={generatedComponent.source}
                targetField={generatedComponent.targetField}
                onReset={resetSession}
              />
            ) : (
              <ComplexFinancialForm
                onSimulateRageClick={() => triggerManualHealing('EBITDA & Pass-Through Schedule')}
                onSimulateHesitation={() => triggerManualHealing('MACRS Asset Depreciation Schedule')}
              />
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-400">AuraGen</span>
            {' '}— Self-Healing Generative UI via Cognitive Load
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              {isConnected ? 'WebSocket connected' : 'WebSocket disconnected'}
            </span>
            <span>Next.js · Node.js · Gemini AI · Babel AST</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
