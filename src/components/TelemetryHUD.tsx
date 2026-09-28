import React, { useState } from 'react';
import { CognitiveState, PipelineStatus, GeneratedComponentPayload } from '../hooks/useTelemetry';
import {
  Activity, ShieldCheck, Zap, AlertTriangle,
  ChevronDown, ChevronUp, Cpu, Eye, CheckCircle2,
  Terminal, Loader2
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
}: TelemetryHUDProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const { cognitiveLoadScore, status, lastMetrics } = cognitiveState;

  const theme = {
    LOW:           { label: 'Low',    scoreColor: 'text-emerald-400', barColor: 'bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
    MEDIUM:        { label: 'Medium', scoreColor: 'text-amber-400',   barColor: 'bg-amber-400',   badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
    HIGH_FRICTION: { label: 'High',   scoreColor: 'text-rose-400',    barColor: 'bg-rose-500',    badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
  }[status] ?? { label: status, scoreColor: 'text-slate-300', barColor: 'bg-slate-500', badge: 'bg-slate-800 text-slate-300 border-slate-700' };

  const isRunning = !['IDLE', 'READY', 'ERROR'].includes(pipelineStatus.stage);

  const STAGES = [
    { id: 'GENERATING_CODE',      label: 'AI generating',  icon: Cpu },
    { id: 'AST_SAFETY_INSPECTION', label: 'Safety check',  icon: ShieldCheck },
    { id: 'READY',                 label: 'Ready',          icon: CheckCircle2 },
  ];

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
      {/* Always-visible header row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`h-2 w-2 rounded-full shrink-0 ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />

          <span className="text-xs text-slate-400 shrink-0 hidden sm:inline">
            {isConnected ? 'Telemetry live' : 'Disconnected'}
          </span>

          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 ${theme.badge}`}>
            {theme.label} friction
          </span>

          {isRunning && (
            <span className="flex items-center gap-1.5 text-xs text-indigo-300 min-w-0">
              <Loader2 className="w-3 h-3 animate-spin shrink-0" />
              <span className="truncate">{pipelineStatus.message}</span>
            </span>
          )}

          {generatedComponent && !isRunning && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              Healed
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-slate-500 hidden sm:inline">Load</span>
            <span className={`text-lg font-bold font-mono leading-none ${theme.scoreColor}`}>{cognitiveLoadScore}</span>
            <span className="text-xs text-slate-600">/100</span>
          </div>
          {isExpanded
            ? <ChevronUp className="w-4 h-4 text-slate-500" />
            : <ChevronDown className="w-4 h-4 text-slate-500" />
          }
        </div>
      </button>

      {/* Expanded panel */}
      {isExpanded && (
        <div className="border-t border-slate-800 px-4 py-4 space-y-4">

          {/* Score bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Cognitive load score</span>
              <span className={`font-mono font-semibold ${theme.scoreColor}`}>{cognitiveLoadScore}/100</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${theme.barColor}`}
                style={{ width: `${cognitiveLoadScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600">AI healing triggers above 75</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <MetricCard
              label="Cursor speed"
              value={`${Math.round(lastMetrics.cursorVelocity)}`}
              unit="px/s"
              fill={Math.min((lastMetrics.cursorVelocity / 2500) * 100, 100)}
              fillColor="bg-indigo-500"
              icon={<Zap className="w-3.5 h-3.5 text-indigo-400" />}
            />
            <MetricCard
              label="Hesitation"
              value={(lastMetrics.hesitationTimeMs / 1000).toFixed(1)}
              unit="sec"
              fill={Math.min((lastMetrics.hesitationTimeMs / 5000) * 100, 100)}
              fillColor="bg-amber-400"
              icon={<Activity className="w-3.5 h-3.5 text-amber-400" />}
            />
            <MetricCard
              label="Rage clicks"
              value={`${lastMetrics.rageClickCount}`}
              unit="burst"
              fill={Math.min(lastMetrics.rageClickCount * 25, 100)}
              fillColor="bg-rose-500"
              icon={<AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
              highlight={lastMetrics.rageClickCount > 0}
            />
            <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Focused field</span>
                <Eye className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <p className="text-xs font-medium text-slate-300 truncate" title={lastMetrics.targetField}>
                {lastMetrics.targetField || '—'}
              </p>
            </div>
          </div>

          {/* Pipeline stages — only when relevant */}
          {(isRunning || generatedComponent) && (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Pipeline</p>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((stage) => {
                  const Icon = stage.icon;
                  const done = !!generatedComponent;
                  const active = pipelineStatus.stage === stage.id;
                  return (
                    <div
                      key={stage.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        done
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                          : active
                          ? 'bg-indigo-500/15 border-indigo-500/25 text-indigo-200'
                          : 'bg-slate-900/50 border-slate-800 text-slate-600'
                      }`}
                    >
                      {active ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
                      {stage.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AST result when done */}
          {generatedComponent && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  AST safety passed
                </div>
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-400 transition-colors"
                >
                  <Terminal className="w-3 h-3" />
                  {showCode ? 'Hide code' : 'View code'}
                </button>
              </div>

              <div className="flex gap-4 text-xs">
                <span className="text-slate-500">
                  Time: <span className="text-white font-mono">{generatedComponent.astMetrics.totalPipelineTimeMs}ms</span>
                </span>
                <span className="text-slate-500">
                  AST nodes: <span className="text-white font-mono">{generatedComponent.astMetrics.nodesAnalyzed}</span>
                </span>
              </div>

              {showCode && (
                <pre className="text-[11px] font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 text-emerald-300 overflow-x-auto max-h-48 leading-relaxed">
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

function MetricCard({
  label, value, unit, fill, fillColor, icon, highlight = false
}: {
  label: string; value: string; unit: string;
  fill: number; fillColor: string; icon: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 space-y-1.5">
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>{label}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-base font-bold font-mono ${highlight ? 'text-rose-400' : 'text-white'}`}>{value}</span>
        <span className="text-[11px] text-slate-600">{unit}</span>
      </div>
      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${fillColor}`}
          style={{ width: `${fill}%` }}
        />
      </div>
    </div>
  );
}
