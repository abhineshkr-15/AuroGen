import React, { useState } from 'react';
import { AlertCircle, HelpCircle, FileText, Lock, ShieldAlert, ArrowRight, Info } from 'lucide-react';

interface ComplexFinancialFormProps {
  onSimulateRageClick: () => void;
  onSimulateHesitation: () => void;
}

export function ComplexFinancialForm({ onSimulateRageClick, onSimulateHesitation }: ComplexFinancialFormProps) {
  const [formData, setFormData] = useState({
    taxId: '',
    macrsCategory: '',
    section448Test: '',
    ebitdaAdjustment: '',
    passThroughDeduction: '',
    complianceCode: ''
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(
      'Error 9042-B: Invalid MACRS Asset Class schedule for Section 448(c) compliance. Please consult IRS Form 8990 schedule index.'
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800/80 flex flex-wrap items-center gap-4">
        <div className="p-3 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-xl">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-white">Infotact Compliance Schedule C-1099</h2>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/25 rounded-full font-mono">
              High Complexity
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Section 448(c) Corporate Tax Credit &amp; Deferred Liability Reconciliation — Page 1 of 14
          </p>
        </div>
      </div>

      {/* Validation error */}
      {validationError && (
        <div className="mx-6 mt-5 p-4 bg-rose-950/50 border border-rose-800/60 rounded-xl flex items-start gap-3 text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-rose-200">Validation Exception</p>
            <p className="leading-relaxed">{validationError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Section 1 */}
        <fieldset className="space-y-4">
          <legend className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 pb-2 border-b border-slate-800/60 w-full">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Section 1 — Taxpayer Identifier &amp; Asset Depreciation
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wide">
                <span>Taxpayer Identification Number (EIN/SSN)</span>
                <Lock className="w-3 h-3 text-slate-600" />
              </label>
              <input
                type="text"
                name="Tax Identification Schedule"
                placeholder="XX-XXXXXXX"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Info className="w-3 h-3" /> Must match Section 6109 IRS master file index.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wide">
                <span>MACRS Asset Class Schedule</span>
                <HelpCircle className="w-3 h-3 text-amber-400" />
              </label>
              <select
                name="MACRS Category Index"
                value={formData.macrsCategory}
                onChange={(e) => setFormData({ ...formData, macrsCategory: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all"
              >
                <option value="">— Select Asset Depreciation Category —</option>
                <option value="3yr">3-Year Property (Special tools, racehorses &gt;2yrs)</option>
                <option value="5yr">5-Year Property (Automobiles, computers, Qualified Tech Equipment)</option>
                <option value="7yr">7-Year Property (Office furniture, agricultural machinery)</option>
                <option value="15yr">15-Year Property (Qualified Improvement Property §168(e)(6))</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Section 2 */}
        <fieldset className="space-y-4">
          <legend className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 pb-2 border-b border-slate-800/60 w-full">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Section 2 — Gross Receipts &amp; EBITDA Ratio Limitations
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block">
                Section 448(c) Gross Receipts Test Threshold ($)
              </label>
              <input
                type="text"
                name="Section 448 Gross Receipts Test"
                placeholder="e.g. 29,000,000"
                value={formData.section448Test}
                onChange={(e) => setFormData({ ...formData, section448Test: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500">
                Avg annual gross receipts for prior 3 taxable years under Treasury Reg. 1.448-1T.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block">
                EBITDA Schedule Non-Pass-Through Ratio
              </label>
              <input
                type="text"
                name="EBITDA Non-Pass-Through Ratio"
                placeholder="e.g. 0.1634"
                value={formData.ebitdaAdjustment}
                onChange={(e) => setFormData({ ...formData, ebitdaAdjustment: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500">
                Net interest expense limitation under §163(j).
              </p>
            </div>
          </div>
        </fieldset>

        {/* Section 3 */}
        <fieldset className="space-y-4">
          <legend className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 pb-2 border-b border-slate-800/60 w-full">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Section 3 — Pass-Through Deduction &amp; Compliance Code
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block">
                §199A Qualified Business Income Deduction (%)
              </label>
              <input
                type="text"
                name="Pass-Through Deduction Schedule"
                placeholder="e.g. 20"
                value={formData.passThroughDeduction}
                onChange={(e) => setFormData({ ...formData, passThroughDeduction: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block">
                Compliance Reference Code
              </label>
              <input
                type="text"
                name="Compliance Reference Code"
                placeholder="e.g. IRC-C1099-2024-A"
                value={formData.complianceCode}
                onChange={(e) => setFormData({ ...formData, complianceCode: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all"
              />
            </div>
          </div>
        </fieldset>

        {/* Audit disclaimer */}
        <div className="flex items-center gap-3 p-3.5 bg-slate-950/60 border border-slate-800/60 rounded-xl text-xs text-slate-500">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Submitting inaccurate MACRS schedules incurs late interest under Tax Code §6601. Page 1 of 14.</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-sm border border-slate-700 transition-all"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition-all"
          >
            Submit Schedule C Reconciliation
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
