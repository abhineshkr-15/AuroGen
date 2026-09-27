import React, { useState } from 'react';
import { CognitiveState, PipelineStatus, GeneratedComponentPayload } from '../hooks/useTelemetry';
import {
  Activity, ShieldCheck, Zap, AlertTriangle, ChevronDown, ChevronUp,
  Cpu, Eye, CheckCircle2, Sparkles, RefreshCw, Terminal, Loader2
} from 'lucide-react';

interface TelemetryHUDProps {
  isConnected: boolean;
  cognitiveState: CognitiveState;
  pipelineStatus: PipelineStatus;
  generatedComponent: GeneratedComponentPayload | null;
  onManualTrigger: (field?: string) => void;
  onResetSession: () => void;
}

export function TelemetryHUD({
  isConnected,
  cognitiveState,
  pipelineStatus,
  generatedComponent,
  onManualTrigger,
  onResetSession
}: TelemetryHUDProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const { cognitiveLoadScore, status, lastMetrics } = cognitiveState;

  // Derive colour theme from friction status
  const theme = {
    LOW: {
      label: 'Low Friction',
      scoreColor: 'text-emerald-400',
      barColor: 'bg-emerald-500',
      badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
      glow: '',
    },
    MEDIUM: {
      label: 'Medium Friction',
      scoreColor: 'text-amber-400',
      barColor: 'bg-amber-400',
      badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
      glow: '',
    },
    HIGH_FRICTION: {
      label: 'High Friction',
      scoreColor: 'text-rose-400',
      barColor: 'bg-rose-500',
      badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/30 animate-pulse',
      glow: 'ring-1 ring-rose-500/20',
    },
  }[status] ?? {
    label: status,
    scoreColor: 'text-slate-300',
    barColor: 'bg-slate-500',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
    glow: '',
  };

  // Pipeline stage display
  const isRunning = pipelineStatus.stage !== 'IDLE' && pipelineStatus.stage !== 'READY' && pipelineStatus.stage !== 'ERROR';

  const STAGES = [
    { id: 'GENERATING_CODE', label: 'AI Generating', icon: Cpu },
    { id: 'AST_SAFETY_INSPECTION', label: 'Safety Check', icon: ShieldCheck },
    { id: 'READY', label: 'Component Ready', icon: CheckCircle2 },
  ];

  return (
    <div className={`w-full bg-slate-900/70 border border-slate-800/80 rounded-2xl backdrop-blur-sm overflow-hidden transition-all ${theme.glow}`}>
      {/* ── Collapsed header — always visible ── */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Live indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              {isConnected ? 'Telemetry Live' : 'Disconnected'}
            </span>
          </div>

          {/* Friction badge */}
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${theme.badgeClass}`}>
            {theme.label}
          </span>

          {/* Active pipeline message */}
          {isRunning && (
            <div className="flex items-center gap-2 text-xs text-indigo-300 min-w-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span className="truncate">{pipelineStatus.message}</span>
            </div>
          )}

          {generatedComponent && !isRunning && (
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Healed component active</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Cognitive score */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Cognitive load</span>
            <span className={`text-xl font-black font-mono ${theme.scoreColor}`}>{cognitiveLoadScore}</span>
            <span className="text-xs text-slate-600">/100</span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {/* ── Expanded body ── */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-slate-800/60 pt-4">
          {/* Score bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Cognitive Load Score</span>
              <span className={`font-bold font-mono ${theme.scoreColor}`}>{cognitiveLoadScore} / 100</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${theme.barColor}`}
                style={{ width: `${cognitiveLoadScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Healing triggers automatically above <span className="text-slate-300 font-semibold">75</span>
            </p>
          </div>

          {/* 4 metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Metric
              label="Cursor Speed"
              value={`${Math.round(lastMetrics.cursorVelocity)}`}
              unit="px/s"
              bar={Math.min((lastMetrics.cursorVelocity / 2500) * 100, 100)}
              barColor="bg-indigo-500"
              icon={<Zap className="w-3.5 h-3.5 text-indigo-400" />}
            />
            <Metric
              label="Hesitation"
              value={(lastMetrics.hesitationTimeMs / 1000).toFixed(1)}
              unit="sec"
              bar={Math.min((lastMetrics.hesitationTimeMs / 5000) * 100, 100)}
              barColor="bg-amber-400"
              icon={<Activity className="w-3.5 h-3.5 text-amber-400" />}
            />
            <Metric
              label="Rage Clicks"
              value={`${lastMetrics.rageClickCount}`}
              unit="burst"
              bar={Math.min(lastMetrics.rageClickCount * 25, 100)}
              barColor="bg-rose-500"
              icon={<AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
              highlight={lastMetrics.rageClickCount > 0}
            />
            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Focused Field</span>
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xs font-semibold text-slate-200 truncate" title={lastMetrics.targetField}>
                {lastMetrics.targetField || 'None'}
              </p>
            </div>
          </div>

          {/* Pipeline stages — only when active or complete */}
          {(isRunning || generatedComponent) && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Pipeline</p>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((stage) => {
                  const StageIcon = stage.icon;
                  const isDone = generatedComponent ||
                    (pipelineStatus.stage === 'READY') ||
                    (pipelineStatus.stage === 'AST_SAFETY_INSPECTION' && stage.id === 'GENERATING_CODE');
                  const isActive = pipelineStatus.stage === stage.id;

                  return (
                    <div
                      key={stage.id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        isDone && generatedComponent
                          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                          : isActive
                          ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-200'
                          : 'bg-slate-900/50 border-slate-800 text-slate-500'
                      }`}
                    >
                      {isActive ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <StageIcon className="w-3.5 h-3.5" />
                      )}
                      {stage.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Generated component info */}
          {generatedComponent && (
            <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  AST Safety: Passed
                </div>
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 font-medium transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  {showCode ? 'Hide code' : 'View generated code'}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900/60 rounded-lg p-2.5 space-y-0.5">
                  <p className="text-slate-500">Pipeline time</p>
                  <p className="text-white font-bold font-mono">{generatedComponent.astMetrics.totalPipelineTimeMs}ms</p>
                </div>
                <div className="bg-slate-900/60 rounded-lg p-2.5 space-y-0.5">
                  <p className="text-slate-500">AST nodes</p>
                  <p className="text-white font-bold font-mono">{generatedComponent.astMetrics.nodesAnalyzed}</p>
                </div>
                <div className="bg-slate-900/60 rounded-lg p-2.5 space-y-0.5">
                  <p className="text-slate-500">Source</p>
                  <p className="text-indigo-300 font-bold truncate text-[11px]">{generatedComponent.source}</p>
                </div>
              </div>
              {showCode && (
                <pre className="text-[11px] font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-emerald-300 overflow-x-auto max-h-56 leading-relaxed">
                  {generatedComponent.code}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Small metric card
function Metric({
  label, value, unit, bar, barColor, icon, highlight = false
}: {
  label: string; value: string; unit: string;
  bar: number; barColor: string; icon: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 space-y-2">
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>{label}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-lg font-black font-mono ${highlight ? 'text-rose-400' : 'text-white'}`}>{value}</span>
        <span className="text-[11px] text-slate-500">{unit}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${bar}%` }}
        />
      </div>
    </div>
  );
}
