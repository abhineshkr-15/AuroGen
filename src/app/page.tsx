'use client';

import React from 'react';
import { useTelemetry } from '../hooks/useTelemetry';
import { Navbar } from '../components/Navbar';
import { TelemetryHUD } from '../components/TelemetryHUD';
import { ComplexFinancialForm } from '../components/ComplexFinancialForm';
import { DynamicRenderer } from '../components/DynamicRenderer';
import { Zap, MousePointer2, RotateCcw } from 'lucide-react';

export default function Page() {
  const {
    isConnected,
    cognitiveState,
    pipelineStatus,
    generatedComponent,
    triggerManualHealing,
    resetSession,
  } = useTelemetry();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar isConnected={isConnected} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Hero — short and clear */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Self-Healing Generative UI
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
            Forms that fix themselves<br />
            <span className="text-indigo-400">when you get stuck.</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
            AuraGen watches cursor speed, hesitation, and rage clicks in real time.
            When it detects frustration, it uses Gemini AI to rewrite the UI into a
            simpler step-by-step wizard — instantly, no reload.
          </p>
        </div>

        {/* Live telemetry strip */}
        <TelemetryHUD
          isConnected={isConnected}
          cognitiveState={cognitiveState}
          pipelineStatus={pipelineStatus}
          generatedComponent={generatedComponent}
          onManualTrigger={triggerManualHealing}
          onResetSession={resetSession}
        />

        {/* Demo controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-400">
            {generatedComponent
              ? 'The AI rewrote the form below. Reset when you want to go back.'
              : 'Try filling the form, or trigger the AI healing manually.'}
          </p>
          <div className="flex items-center gap-2">
            {generatedComponent ? (
              <button
                onClick={resetSession}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to original form
              </button>
            ) : (
              <>
                <button
                  onClick={() => triggerManualHealing('MACRS Asset Depreciation Schedule')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium transition-colors"
                >
                  <MousePointer2 className="w-3.5 h-3.5 text-amber-400" />
                  Simulate hesitation
                </button>
                <button
                  onClick={() => triggerManualHealing('EBITDA & Pass-Through Schedule')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Trigger AI healing
                </button>
              </>
            )}
          </div>
        </div>

        {/* The form or healed component */}
        <div>
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

      </main>

      <footer className="border-t border-slate-900 px-6 py-5 mt-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <span>
            <span className="text-slate-400 font-semibold">AuraGen</span> — Self-Healing Generative UI
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-slate-700'}`} />
              {isConnected ? 'WebSocket connected' : 'WebSocket disconnected'}
            </span>
            <span>Next.js · Gemini AI · Babel AST</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
