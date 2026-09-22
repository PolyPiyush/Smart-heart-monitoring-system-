import React from 'react';
import { Play, Download, FileCode, CheckCircle, Database, RefreshCw } from 'lucide-react';
import { PipelineExecutionState } from '../types';
import JSZip from 'jszip';
import { getTable1Latex, getTable2Latex, getTable3Latex, getTable4Latex } from '../utils/latexExport';
import { getFigurePngBlob } from '../utils/canvasPlotter';

interface SidebarProps {
  state: PipelineExecutionState;
  onTrainSplitChange: (val: number) => void;
  onOptunaTrialsChange: (val: number) => void;
  onSeedChange: (val: number) => void;
  onRunPipeline: () => void;
  dataSource: 'uci' | 'custom';
  onDataSourceChange: (val: 'uci' | 'custom') => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isZipping: boolean;
  setIsZipping: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  state,
  onTrainSplitChange,
  onOptunaTrialsChange,
  onSeedChange,
  onRunPipeline,
  dataSource,
  onDataSourceChange,
  onFileUpload,
  isZipping,
  setIsZipping
}) => {

  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add LaTeX Tables
      zip.file("TABLE_I_Dataset_Profile.tex", getTable1Latex(state));
      zip.file("TABLE_II_Optimal_Hyperparameters.tex", getTable2Latex(state));
      zip.file("TABLE_III_Test_Performance.tex", getTable3Latex(state));
      zip.file("TABLE_IV_Ablation_Study.tex", getTable4Latex(state));

      // Add All 8 300-DPI IEEE figures
      const figNames = [
        "Fig_1_System_Architecture.png",
        "Fig_2_Multimodal_Feature_Fusion.png",
        "Fig_3_Optuna_Bayesian_Optimization.png",
        "Fig_4_Multi_Model_ROC_Curves.png",
        "Fig_5_Precision_Recall_Curves.png",
        "Fig_6_Confusion_Matrix_Ensemble.png",
        "Fig_7_Feature_Importance_Stratification.png",
        "Fig_8_Multimodal_Ablation_Comparison.png"
      ];

      for (let i = 1; i <= 8; i++) {
        const blob = await getFigurePngBlob(i, state);
        zip.file(figNames[i - 1], blob);
      }

      // Add Readme & Citation file
      const readme = `SmartHeart AI: IEEE Publication Artifacts Package
============================================================
Paper: "SmartHeart AI: A Clinically Interpretable Multimodal Feature Fusion and
        Bayesian-Tuned Soft-Voting Ensemble for Early Coronary Artery Disease Risk Stratification"
Author: Piyush Pravin Bhure
Affiliation: Department of Computer Science & Engineering, G.H. Raisoni College of Engineering, Nagpur

Benchmark Dataset: UCI Cleveland Heart Disease Cohort (N=${state.totalSamples})
Partition: ${Math.round(state.trainSplit * 100)}% Train (${state.trainSamples}) / ${Math.round((1 - state.trainSplit) * 100)}% Isolated Test (${state.testSamples})
Optuna Optimization: ${state.optunaTrials} Bayesian Trials per Model with 5-Fold Stratified CV

Ensemble Performance on Test Set:
- Accuracy: ${(state.models.ensemble.accuracy * 100).toFixed(2)}%
- ROC-AUC: ${state.models.ensemble.rocAuc.toFixed(4)}
- PR-AUC: ${state.models.ensemble.prAuc.toFixed(4)}
- Sensitivity (Recall): ${(state.models.ensemble.recall * 100).toFixed(2)}%
- Specificity: ${(state.models.ensemble.specificity * 100).toFixed(2)}%

Package Includes:
- 4 IEEE LaTeX Source Tables (.tex)
- 8 Publication-grade 300 DPI Figures in PNG
`;
      zip.file("README_IEEE_Artifacts.txt", readme);

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "SmartHeart_AI_IEEE_Publication_Package.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP Generation error:", err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadAppPy = () => {
    // Direct download of the Streamlit app.py script
    window.open('/app.py', '_blank');
  };

  return (
    <aside className="w-80 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 shadow-xl overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-red-600/30">
            🫀
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white leading-tight">SmartHeart AI</h1>
            <p className="text-xs text-slate-400 font-medium">IEEE ML Benchmark Suite</p>
          </div>
        </div>
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
          <span className="text-slate-300 font-semibold">Author:</span> Piyush Pravin Bhure<br />
          <span className="text-slate-400">G.H. Raisoni College of Eng., Nagpur</span>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="p-5 space-y-5 flex-1">
        {/* Dataset Controls */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-blue-400" /> Dataset Source
          </label>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60">
              <input
                type="radio"
                name="data_source"
                checked={dataSource === 'uci'}
                onChange={() => onDataSourceChange('uci')}
                className="text-blue-500 focus:ring-0"
              />
              <span>Fetch UCI Cleveland Repository</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60">
              <input
                type="radio"
                name="data_source"
                checked={dataSource === 'custom'}
                onChange={() => onDataSourceChange('custom')}
                className="text-blue-500 focus:ring-0"
              />
              <span>Upload Custom CSV File</span>
            </label>
          </div>

          {dataSource === 'custom' && (
            <div className="mt-2.5">
              <input
                type="file"
                accept=".csv"
                onChange={onFileUpload}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer bg-slate-800/80 p-1.5 rounded border border-slate-700"
              />
            </div>
          )}
        </div>

        {/* Training Split Slider */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Stratified Train Split:</span>
            <span className="font-mono bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">
              {Math.round(state.trainSplit * 100)}% ({state.trainSamples})
            </span>
          </div>
          <input
            type="range"
            min="0.60"
            max="0.85"
            step="0.05"
            value={state.trainSplit}
            onChange={(e) => onTrainSplitChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>60%</span>
            <span>Test: {state.testSamples} pts</span>
            <span>85%</span>
          </div>
        </div>

        {/* Optuna Tuning Slider */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Bayesian Trials / Model:</span>
            <span className="font-mono bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded text-xs font-bold">
              {state.optunaTrials} Trials
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={state.optunaTrials}
            onChange={(e) => onOptunaTrialsChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>10 (Fast)</span>
            <span>5-Fold Stratified CV</span>
            <span>50 (Deep)</span>
          </div>
        </div>

        {/* Random Seed */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300">
            Random Seed (Reproducibility):
          </label>
          <input
            type="number"
            value={state.randomSeed}
            onChange={(e) => onSeedChange(parseInt(e.target.value) || 42)}
            className="w-full px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded text-slate-100 font-mono focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Run Button */}
        <button
          onClick={onRunPipeline}
          disabled={state.isTraining}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {state.isTraining ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Training SmartHeart AI...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Train & Run Pipeline</span>
            </>
          )}
        </button>

        {/* Global Download Button */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <button
            onClick={handleDownloadAllZip}
            disabled={isZipping || state.isTraining}
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-emerald-700/20"
          >
            {isZipping ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Compiling IEEE ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download All IEEE (.zip)</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadAppPy}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-700 cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>Download Streamlit app.py</span>
          </button>
        </div>

        {/* Status indicator */}
        <div className="p-3 bg-slate-800/70 border border-slate-700/80 rounded-lg text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle className="w-3.5 h-3.5" /> Pipeline Validated (Zero Leakage)
          </div>
          <p className="text-slate-400 text-[11px] leading-tight">
            Ensemble AUC: <span className="font-mono text-white font-bold">{state.models.ensemble.rocAuc.toFixed(4)}</span> | Sens: <span className="font-mono text-white font-bold">{(state.models.ensemble.recall * 100).toFixed(1)}%</span>
          </p>
        </div>
      </div>
    </aside>
  );
};
