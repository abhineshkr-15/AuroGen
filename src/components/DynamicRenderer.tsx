import React, { useState, useEffect } from 'react';
import * as Babel from '@babel/standalone';
import * as DesignSystem from './DesignSystem';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertTriangle, RotateCcw, Loader2 } from 'lucide-react';

interface DynamicRendererProps {
  codeString: string;
  source: string;
  targetField: string;
  onReset: () => void;
}

export function DynamicRenderer({ codeString, source, targetField, onReset }: DynamicRendererProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  useEffect(() => {
    if (!codeString) return;

    try {
      setEvalError(null);
      setComponent(null);

      // Transpile JSX using Babel Standalone in the browser
      const transformed = Babel.transform(codeString, {
        presets: ['react', 'env'],
        filename: 'SelfHealedWizard.jsx'
      }).code;

      // Scope keys & values injected into the generated component
      const scopeKeys = [
        'React', 'useState', 'useEffect', 'useMemo', 'useCallback', 'useRef',
        'Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter',
        'Button', 'Input', 'Label', 'Badge', 'Progress', 'Alert', 'Select', 'Textarea',
        ...Object.keys(LucideIcons)
      ];

      const scopeValues = [
        React, React.useState, React.useEffect, React.useMemo, React.useCallback, React.useRef,
        DesignSystem.Card, DesignSystem.CardHeader, DesignSystem.CardTitle,
        DesignSystem.CardDescription, DesignSystem.CardContent, DesignSystem.CardFooter,
        DesignSystem.Button, DesignSystem.Input, DesignSystem.Label, DesignSystem.Badge,
        DesignSystem.Progress, DesignSystem.Alert, DesignSystem.Select, DesignSystem.Textarea,
        ...Object.values(LucideIcons)
      ];

      const evaluationCode = `
        ${transformed}
        return typeof SelfHealedWizard !== 'undefined' ? SelfHealedWizard : null;
      `;

      const fn = new Function(...scopeKeys, evaluationCode);
      const ExtractedComponent = fn(...scopeValues);

      if (ExtractedComponent && typeof ExtractedComponent === 'function') {
        setComponent(() => ExtractedComponent);
      } else {
        setEvalError('No valid SelfHealedWizard component was found in the generated code.');
      }
    } catch (err: any) {
      console.error('[DynamicRenderer] Compilation error:', err);
      setEvalError(`Compilation failed: ${err.message}`);
    }
  }, [codeString]);

  const handleWizardComplete = (resultData: any) => {
    alert(`Application submitted!\n\n${JSON.stringify(resultData, null, 2)}`);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dynamic-renderer"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl mx-auto space-y-3"
      >
        {/* Healed UI notice */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-emerald-300">AI simplified this form for you</p>
              <p className="text-xs text-slate-400 truncate">
                Detected friction on: <span className="text-slate-300">{targetField}</span>
                {source && <> &nbsp;·&nbsp; <span className="text-slate-500 font-mono">{source}</span></>}
              </p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Show original form
          </button>
        </div>

        {/* Component or states */}
        {evalError ? (
          <div className="p-6 bg-rose-950/40 border border-rose-800/50 rounded-2xl text-rose-300 space-y-4">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Failed to render generated component
            </div>
            <pre className="text-xs font-mono bg-slate-950 p-4 rounded-xl overflow-x-auto text-rose-300 border border-slate-800">
              {evalError}
            </pre>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              Go back to original form
            </button>
          </div>
        ) : Component ? (
          <Component onComplete={handleWizardComplete} initialData={{ revenue: '250000', expenses: '70000' }} />
        ) : (
          <div className="py-20 flex flex-col items-center gap-4 text-slate-400 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-200">Compiling AI-generated component…</p>
              <p className="text-xs text-slate-500 mt-1">Running Babel transform in browser</p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
