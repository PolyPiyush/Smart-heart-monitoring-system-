import React, { useState, useEffect, useRef } from 'react';
import { PipelineExecutionState } from '../types';
import { BarChart3, Award, Copy, Check, Download, Layers, ShieldAlert, CheckCircle } from 'lucide-react';
import { getTable3Latex } from '../utils/latexExport';
import { drawFig4Roc, drawFig5Pr, drawFig6ConfusionMatrix } from '../utils/canvasPlotter';

interface Tab3BenchmarkingProps {
  state: PipelineExecutionState;
}

export const Tab3Benchmarking: React.FC<Tab3BenchmarkingProps> = ({ state }) => {
  const [copied, setCopied] = useState(false);
  const rocCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const prCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cmCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const table3Latex = getTable3Latex(state);

  useEffect(() => {
    if (rocCanvasRef.current) {
      rocCanvasRef.current.width = 1600;
      rocCanvasRef.current.height = 1100;
      drawFig4Roc(rocCanvasRef.current, state);
    }
    if (prCanvasRef.current) {
      prCanvasRef.current.width = 1600;
      prCanvasRef.current.height = 1100;
      drawFig5Pr(prCanvasRef.current, state);
    }
    if (cmCanvasRef.current) {
      cmCanvasRef.current.width = 1400;
      cmCanvasRef.current.height = 1000;
      drawFig6ConfusionMatrix(cmCanvasRef.current, state);
    }
  }, [state]);

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(table3Latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTex = () => {
    const blob = new Blob([table3Latex], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TABLE_III_Test_Performance.tex';
    link.click();
    URL.revokeObjectURL(url);
  };

  const modelsList = [
    state.models.lr,
    state.models.rf,
    state.models.svc,
    state.models.xgb,
    state.models.ensemble
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Independent Test-Set Benchmarking (Held-out N = {state.testSamples})
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Rigorous, blinded evaluation on the isolated test cohort. Zero overlap with training folds or feature scalers.
            </p>
          </div>
          <div className="bg-red-50 text-red-800 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            Ensemble AUC: {state.models.ensemble.rocAuc.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Main Benchmarking Metrics Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          Comprehensive Performance Evaluation Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Model Architecture</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Precision</th>
                <th className="py-2.5 px-3">Sensitivity (Recall)</th>
                <th className="py-2.5 px-3">Specificity</th>
                <th className="py-2.5 px-3">F1-Score</th>
                <th className="py-2.5 px-3">ROC-AUC</th>
                <th className="py-2.5 px-3">PR-AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {modelsList.map((m) => {
                const isEnsemble = m.name.includes('Ensemble');
                return (
                  <tr
                    key={m.name}
                    className={`transition-colors ${
                      isEnsemble
                        ? 'bg-red-50/70 font-bold text-red-950 hover:bg-red-100/70'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-sans font-semibold flex items-center gap-1.5">
                      {isEnsemble && <Award className="w-3.5 h-3.5 text-red-600 fill-red-600" />}
                      {m.name}
                    </td>
                    <td className="py-2.5 px-3">{(m.accuracy * 100).toFixed(2)}%</td>
                    <td className="py-2.5 px-3">{(m.precision * 100).toFixed(2)}%</td>
                    <td className="py-2.5 px-3">{(m.recall * 100).toFixed(2)}%</td>
                    <td className="py-2.5 px-3">{(m.specificity * 100).toFixed(2)}%</td>
                    <td className="py-2.5 px-3">{m.f1.toFixed(4)}</td>
                    <td className="py-2.5 px-3 text-blue-700 font-bold">{m.rocAuc.toFixed(4)}</td>
                    <td className="py-2.5 px-3 text-purple-700 font-bold">{m.prAuc.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual ROC and PR Curves Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-900">Receiver Operating Characteristic (ROC)</h3>
            <span className="text-[11px] text-slate-500 font-mono">IEEE 300 DPI Rendering</span>
          </div>
          <canvas
            ref={rocCanvasRef}
            className="w-full h-auto rounded border border-slate-200 bg-white"
            style={{ maxHeight: '360px', width: '100%' }}
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-900">Precision-Recall Curves (PR-AUC)</h3>
            <span className="text-[11px] text-slate-500 font-mono">Positive Predictive Value</span>
          </div>
          <canvas
            ref={prCanvasRef}
            className="w-full h-auto rounded border border-slate-200 bg-white"
            style={{ maxHeight: '360px', width: '100%' }}
          />
        </div>
      </div>

      {/* Confusion Matrix Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Rendered Heatmap */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Soft-Voting Ensemble Confusion Matrix Heatmap (N={state.testSamples})
          </h3>
          <canvas
            ref={cmCanvasRef}
            className="w-full h-auto rounded border border-slate-200 bg-white"
            style={{ maxHeight: '340px', width: '100%' }}
          />
        </div>

        {/* Detailed Breakdown Cards */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Exact Numerical Breakdown</h3>
            <p className="text-xs text-slate-500 mb-4">
              Clinical stratification across binary coronary categories:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-200">
                <span className="text-[11px] font-semibold text-blue-700 uppercase">True Negative</span>
                <div className="text-xl font-bold font-mono text-blue-900 mt-0.5">{state.models.ensemble.tn}</div>
                <p className="text-[10px] text-blue-600">Normal correctly diagnosed</p>
              </div>

              <div className="p-3 bg-red-50/80 rounded-lg border border-red-200">
                <span className="text-[11px] font-semibold text-red-700 uppercase">False Positive</span>
                <div className="text-xl font-bold font-mono text-red-900 mt-0.5">{state.models.ensemble.fp}</div>
                <p className="text-[10px] text-red-600">Type I Error (False Alarm)</p>
              </div>

              <div className="p-3 bg-rose-50/80 rounded-lg border border-rose-200">
                <span className="text-[11px] font-semibold text-rose-700 uppercase">False Negative</span>
                <div className="text-xl font-bold font-mono text-rose-900 mt-0.5">{state.models.ensemble.fn}</div>
                <p className="text-[10px] text-rose-600">Type II Error (Missed CAD)</p>
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-lg border border-emerald-200">
                <span className="text-[11px] font-semibold text-emerald-700 uppercase">True Positive</span>
                <div className="text-xl font-bold font-mono text-emerald-900 mt-0.5">{state.models.ensemble.tp}</div>
                <p className="text-[10px] text-emerald-600">CAD correctly detected</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Sensitivity (Recall):</span>
              <strong className="text-slate-900 font-mono">{(state.models.ensemble.recall * 100).toFixed(2)}%</strong>
            </div>
            <div className="flex justify-between">
              <span>Specificity:</span>
              <strong className="text-slate-900 font-mono">{(state.models.ensemble.specificity * 100).toFixed(2)}%</strong>
            </div>
            <div className="flex justify-between">
              <span>Overall Accuracy:</span>
              <strong className="text-slate-900 font-mono">{(state.models.ensemble.accuracy * 100).toFixed(2)}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Formatted LaTeX Code Box for Table III */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-slate-200 shadow-md">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
              TABLE III (LaTeX Code)
            </div>
            <span className="text-xs text-slate-400">Test Performance Benchmarks Across Models</span>
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
          {table3Latex}
        </pre>
      </div>
    </div>
  );
};
