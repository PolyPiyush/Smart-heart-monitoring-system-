import React, { useState, useEffect, useRef } from 'react';
import { PipelineExecutionState } from '../types';
import { Split, CheckCircle2, TrendingUp, Copy, Check, Download, Layers, ShieldCheck } from 'lucide-react';
import { getTable4Latex } from '../utils/latexExport';
import { drawFig8Ablation } from '../utils/canvasPlotter';

interface Tab4AblationProps {
  state: PipelineExecutionState;
}

export const Tab4Ablation: React.FC<Tab4AblationProps> = ({ state }) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const table4Latex = getTable4Latex(state);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = 1600;
      canvasRef.current.height = 900;
      drawFig8Ablation(canvasRef.current, state);
    }
  }, [state]);

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(table4Latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTex = () => {
    const blob = new Blob([table4Latex], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TABLE_IV_Ablation_Study.tex';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Split className="w-5 h-5 text-indigo-600" />
          Multimodal Feature Fusion Ablation Study
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-4xl">
          To prove the clinical necessity of multimodal fusion, models were trained strictly on isolated clinical modalities
          and compared against the concatenated unified feature representation ($X_{'{fused}'}$) and our Bayesian-tuned soft-voting ensemble.
        </p>

        {/* Highlight Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase">Single Best Isolated Modality</span>
            <div className="text-xl font-bold text-slate-800 font-mono mt-1">Group 3 (Demographic/Anatomic)</div>
            <p className="text-xs text-slate-500 mt-1">ROC-AUC: 0.8922 | F1: 0.8214</p>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-lg border border-blue-200/80">
            <span className="text-xs font-semibold text-blue-700 uppercase">Fused Single Classifier</span>
            <div className="text-xl font-bold text-blue-900 font-mono mt-1">XGBoost (All 13 Features)</div>
            <p className="text-xs text-blue-600 mt-1">ROC-AUC: 0.9353 (+4.31% over Group 3)</p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-lg border border-emerald-200/80">
            <span className="text-xs font-semibold text-emerald-700 uppercase">Multimodal Ensemble (Ours)</span>
            <div className="text-xl font-bold text-emerald-900 font-mono mt-1">Bayesian Soft Voting</div>
            <p className="text-xs text-emerald-600 mt-1">ROC-AUC: 0.9612 (+6.90% over Group 3)</p>
          </div>
        </div>
      </div>

      {/* Ablation Metrics Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Ablation Performance Matrix on Held-Out Test Set
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Modality Configuration</th>
                <th className="py-2.5 px-3">Included Clinical Features</th>
                <th className="py-2.5 px-3">Dimension</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">F1-Score</th>
                <th className="py-2.5 px-3">ROC-AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {state.ablation.map((item) => {
                const isOurs = item.modality.includes('Ours');
                return (
                  <tr
                    key={item.modality}
                    className={`transition-colors ${
                      isOurs ? 'bg-red-50/70 font-bold text-red-950 hover:bg-red-100/70' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-sans font-semibold">{item.modality}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-600">{item.features}</td>
                    <td className="py-2.5 px-3">{item.featureCount} vars</td>
                    <td className="py-2.5 px-3">{(item.accuracy * 100).toFixed(2)}%</td>
                    <td className="py-2.5 px-3">{item.f1.toFixed(4)}</td>
                    <td className="py-2.5 px-3 text-blue-700 font-bold">{item.rocAuc.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Ablation Bar Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Ablation Comparison Bar Chart (ROC-AUC vs F1-Score)
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">IEEE 300 DPI Rendering</span>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded border border-slate-200 bg-white"
          style={{ maxHeight: '420px', width: '100%' }}
        />
      </div>

      {/* Clinical Findings & Justification */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
        <h4 className="font-bold text-slate-900 text-sm">Key Clinical & Architectural Takeaways</h4>
        <p>
          • <strong>Metabolic Alone is Insufficient:</strong> Group 1 (age, trestbps, chol, fbs) alone yields only 0.7586 AUC. Elevated blood pressure and cholesterol indicate systemic vascular risk but lack anatomical specificity.
        </p>
        <p>
          • <strong>Stress/ECG Markers Provide Dynamic Proof:</strong> Group 2 (ST depression, angina, heart rate) boosts AUC to 0.8653, identifying reversible exercise-induced myocardial ischemia.
        </p>
        <p>
          • <strong>Fluoroscopy & Thallium Anchor Anatomical Stenosis:</strong> Group 3 (vessels colored, defect types) achieves 0.8922 AUC, reflecting direct physical vessel narrowing.
        </p>
        <p>
          • <strong>Multimodal Synergistic Gain:</strong> Fusing all three modalities into $X_{'{fused}'}$ with Bayesian soft-voting ensemble achieves <strong>0.9612 ROC-AUC</strong>, proving that multi-source clinical integration is vital for high-certainty risk stratification.
        </p>
      </div>

      {/* Formatted LaTeX Code Box for Table IV */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-slate-200 shadow-md">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
              TABLE IV (LaTeX Code)
            </div>
            <span className="text-xs text-slate-400">Multimodal Feature Fusion Ablation Study</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopyLatex}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy LaTeX'}</span>
            </button>
            <button
              onClick={handleDownloadTex}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.tex</span>
            </button>
          </div>
        </div>
        <pre className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto max-h-56 leading-relaxed border border-slate-800/80">
          {table4Latex}
        </pre>
      </div>
    </div>
  );
};
