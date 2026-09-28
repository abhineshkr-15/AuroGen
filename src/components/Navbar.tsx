import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  isConnected?: boolean;
}

export function Navbar({ isConnected = false }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800/60 px-4 sm:px-8 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-white font-bold text-base tracking-tight">AuraGen</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            AST Safety On
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
            isConnected
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            {isConnected ? 'Live' : 'Offline'}
          </div>
        </div>
      </div>
    </header>
  );
}
