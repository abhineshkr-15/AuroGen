import React from 'react';
import * as LucideIcons from 'lucide-react';

export function Card({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl shadow-slate-950/50 transition-all ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pb-3 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-xl font-bold text-white tracking-tight ${className}`} {...props}>{children}</h3>;
}

export function CardDescription({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-slate-400 mt-1 ${className}`} {...props}>{children}</p>;
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 ${className}`} {...props}>{children}</div>;
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pt-3 border-t border-slate-800/80 flex items-center ${className}`} {...props}>{children}</div>;
}

export function Button({ className = '', variant = 'default', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'secondary' | 'danger' }) {
  let baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none rounded-xl text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98]";
  
  if (variant === 'default') baseStyle += " bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/30";
  if (variant === 'outline') baseStyle += " border border-slate-700/80 bg-slate-900/50 hover:bg-slate-800 text-slate-200 hover:border-slate-600";
  if (variant === 'secondary') baseStyle += " bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700/50";
  if (variant === 'danger') baseStyle += " bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-600/25 border border-rose-500/30";

  return (
    <button className={`${baseStyle} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all ${className}`}
      {...props}
    />
  );
}

export function Label({ className = '', children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`block text-xs font-semibold text-slate-300 uppercase tracking-wider ${className}`} {...props}>
      {children}
    </label>
  );
}

export function Badge({ className = '', variant = 'default', children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'outline' | 'success' | 'warning' }) {
  let style = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md";
  if (variant === 'default') style += " bg-indigo-500/15 text-indigo-300 border border-indigo-500/30";
  if (variant === 'outline') style += " border border-slate-700 text-slate-300 bg-slate-900/40";
  if (variant === 'success') style += " bg-emerald-500/15 text-emerald-300 border border-emerald-500/30";
  if (variant === 'warning') style += " bg-amber-500/15 text-amber-300 border border-amber-500/30";

  return <span className={`${style} ${className}`} {...props}>{children}</span>;
}

export function Progress({ value = 0, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-slate-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800/80 ${className}`}>
      <div
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-300 rounded-full shadow-sm"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

export function Alert({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-4 rounded-xl border bg-slate-900/90 border-slate-800 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Select({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 ${className}`}
      {...props}
    />
  );
}

// Map Lucide Icons bundle for browser scope
export const ScopeIcons = {
  ...LucideIcons
};

