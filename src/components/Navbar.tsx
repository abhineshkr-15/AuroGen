import React from 'react';
import { Sparkles, ShieldCheck, Github } from 'lucide-react';

interface NavbarProps {
  isConnected?: boolean;
}

export function Navbar({ isConnected = false }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 px-4 sm:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-lg tracking-tight">AuraGen</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full font-mono">
              v1.0
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Compliance badge — desktop only */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Babel AST Verified
          </div>

          {/* Connection status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            isConnected
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            {isConnected ? 'Live' : 'Offline'}
          </div>
        </div>
      </div>
    </header>
  );
}
