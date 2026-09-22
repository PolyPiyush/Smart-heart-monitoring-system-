import React, { useState, useEffect, useRef } from 'react';
import { PipelineExecutionState } from '../types';
import { Cpu, CheckCircle2, TrendingUp, Copy, Check, Download, Layers, ShieldCheck } from 'lucide-react';
import { getTable2Latex } from '../utils/latexExport';
import { drawFig3Optuna } from '../utils/canvasPlotter';

interface Tab2TrainingProps {
  state: PipelineExecutionState;
}

export const Tab2Training: React.FC<Tab2TrainingProps> = ({ state }) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const table2Latex = getTable2Latex(state);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = 1600;
      canvasRef.current.height = 900;
      drawFig3Optuna(canvasRef.current, state);
    }
  }, [state]);

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(table2Latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTex = () => {
    const blob = new Blob([table2Latex], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TABLE_II_Optimal_Hyperparameters.tex';
    link.click();
    URL.revokeObjectURL(url);
  };

  const { lr, rf, svc, xgb } = state.optimalParams;

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          Model Training & Bayesian Hyperparameter Optimization
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-4xl">
          Four diverse machine learning architectures are systematically tuned on the training split ({state.trainSamples} patients) using
          <strong> Optuna Bayesian Tree-structured Parzen Estimator (TPE)</strong> with <strong>5-fold Stratified Cross-Validation</strong>,
          optimizing the validation ROC-AUC under strict zero-leakage constraints.
        </p>

        {/* Cross Validation AUC Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="bg-blue-50/70 p-4 rounded-lg border border-blue-200/80">
            <div className="flex justify-between items-center text-xs font-semibold text-blue-700">
              <span>Logistic Regression</span>
              <span className="bg-blue-200/80 px-1.5 py-0.5 rounded text-[10px]">TPE Tuned</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 font-mono mt-1">
              {state.trials.lr[state.trials.lr.length - 1]?.bestValue.toFixed(4)}
            </div>
            <p className="text-xs text-blue-600 mt-1">CV ROC-AUC (C={lr.C.toFixed(4)})</p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-lg border border-emerald-200/80">
            <div className="flex justify-between items-center text-xs font-semibold text-emerald-700">
              <span>Random Forest</span>
              <span className="bg-emerald-200/80 px-1.5 py-0.5 rounded text-[10px]">TPE Tuned</span>
            </div>
            <div className="text-2xl font-bold text-emerald-900 font-mono mt-1">
              {state.trials.rf[state.trials.rf.length - 1]?.bestValue.toFixed(4)}
            </div>
            <p className="text-xs text-emerald-600 mt-1">CV ROC-AUC ({rf.nEstimators} trees)</p>
          </div>

          <div className="bg-purple-50/70 p-4 rounded-lg border border-purple-200/80">
            <div className="flex justify-between items-center text-xs font-semibold text-purple-700">
              <span>SVC (RBF Kernel)</span>
              <span className="bg-purple-200/80 px-1.5 py-0.5 rounded text-[10px]">TPE Tuned</span>
            </div>
            <div className="text-2xl font-bold text-purple-900 font-mono mt-1">
              {state.trials.svc[state.trials.svc.length - 1]?.bestValue.toFixed(4)}
            </div>
            <p className="text-xs text-purple-600 mt-1">CV ROC-AUC (C={svc.C.toFixed(4)})</p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-lg border border-amber-200/80">
            <div className="flex justify-between items-center text-xs font-semibold text-amber-700">
              <span>XGBoost Classifier</span>
              <span className="bg-amber-200/80 px-1.5 py-0.5 rounded text-[10px]">TPE Tuned</span>
            </div>
            <div className="text-2xl font-bold text-amber-900 font-mono mt-1">
              {state.trials.xgb[state.trials.xgb.length - 1]?.bestValue.toFixed(4)}
            </div>
            <p className="text-xs text-amber-600 mt-1">CV ROC-AUC (η={xgb.learningRate.toFixed(3)})</p>
          </div>
        </div>
      </div>

      {/* Optuna Convergence Graph Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Optuna Bayesian Optimization History (Trial-by-Trial Convergence)
            </h3>
            <p className="text-xs text-slate-500">
              Tracking best objective metric (Stratified 5-Fold Cross-Validation ROC-AUC) over {state.optunaTrials} trials
            </p>
          </div>
          <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
            5-Fold Stratified CV
          </span>
        </div>

        <div className="w-full bg-slate-50 rounded-lg p-2 border border-slate-200">
          <canvas
            ref={canvasRef}
            className="w-full h-auto rounded border border-slate-200 bg-white"
            style={{ maxHeight: '420px', width: '100%' }}
          />
        </div>
      </div>

      {/* Model Architectures & Soft-Voting Construction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Soft-Voting Construction Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-md border border-indigo-800">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm tracking-wide">Soft-Voting Ensemble Construction</h3>
          </div>
          <p className="text-xs text-indigo-200 leading-relaxed">
            The SmartHeart AI ensemble integrates predictions by computing the calibrated weighted average of class posterior probability distributions:
          </p>
          <div className="my-3 p-3 bg-slate-950/70 rounded-lg font-mono text-xs text-amber-300 border border-indigo-900">
            P(CAD | x) = Σ [ w_k · P_k(CAD | x) ] / Σ w_k
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-indigo-800/60">
            <div>• Logistic Reg: <span className="font-mono text-white font-semibold">w = 1.0</span></div>
            <div>• Random Forest: <span className="font-mono text-white font-semibold">w = 1.2</span></div>
            <div>• SVC (RBF): <span className="font-mono text-white font-semibold">w = 1.1</span></div>
            <div>• XGBoost: <span className="font-mono text-white font-semibold">w = 1.3</span></div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Reduces individual model variance and suppresses isolated false-positive anomalies.
          </div>
        </div>

        {/* Hyperparameter Table Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-3">Identified Optimal Configurations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2 px-2.5">Classifier</th>
                  <th className="py-2 px-2.5">Search Domain</th>
                  <th className="py-2 px-2.5">Optimal Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                <tr>
                  <td className="py-2 px-2.5 font-sans font-semibold text-slate-800">Logistic Reg.</td>
                  <td className="py-2 px-2.5 text-slate-500">C ∈ [1e-3, 10], solver</td>
                  <td className="py-2 px-2.5 text-blue-700 font-bold">C={lr.C.toFixed(4)}, {lr.solver}</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-sans font-semibold text-slate-800">Random Forest</td>
                  <td className="py-2 px-2.5 text-slate-500">n_trees ∈ [50, 300], depth</td>
                  <td className="py-2 px-2.5 text-emerald-700 font-bold">n={rf.nEstimators}, depth={rf.maxDepth}</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-sans font-semibold text-slate-800">SVC (RBF)</td>
                  <td className="py-2 px-2.5 text-slate-500">C ∈ [1e-2, 10], gamma</td>
                  <td className="py-2 px-2.5 text-purple-700 font-bold">C={svc.C.toFixed(4)}, {svc.gamma}</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 font-sans font-semibold text-slate-800">XGBoost</td>
                  <td className="py-2 px-2.5 text-slate-500">lr ∈ [0.01, 0.3], depth</td>
                  <td className="py-2 px-2.5 text-amber-700 font-bold">lr={xgb.learningRate.toFixed(3)}, d={xgb.maxDepth}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Formatted LaTeX Code Box for Table II */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-slate-200 shadow-md">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
              TABLE II (LaTeX Code)
            </div>
            <span className="text-xs text-slate-400">Optimal Hyperparameters Identified via Bayesian TPE</span>
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
          {table2Latex}
        </pre>
      </div>
    </div>
  );
};
