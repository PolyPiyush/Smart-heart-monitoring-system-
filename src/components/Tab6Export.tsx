import React, { useState } from 'react';
import { PipelineExecutionState } from '../types';
import { FileText, Copy, Check, Download, Code2, BookOpen, Terminal, Archive } from 'lucide-react';
import { getTable1Latex, getTable2Latex, getTable3Latex, getTable4Latex } from '../utils/latexExport';

interface Tab6ExportProps {
  state: PipelineExecutionState;
  onDownloadZip: () => void;
  isZipping: boolean;
}

export const Tab6Export: React.FC<Tab6ExportProps> = ({ state, onDownloadZip, isZipping }) => {
  const [activeTableTab, setActiveTableTab] = useState<'t1' | 't2' | 't3' | 't4'>('t1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const t1 = getTable1Latex(state);
  const t2 = getTable2Latex(state);
  const t3 = getTable3Latex(state);
  const t4 = getTable4Latex(state);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadTex = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const bibtex = `@article{bhure2026smartheart,
  title={SmartHeart AI: A Clinically Interpretable Multimodal Feature Fusion and Bayesian-Tuned Soft-Voting Ensemble for Early Coronary Artery Disease Risk Stratification},
  author={Bhure, Piyush Pravin},
  journal={IEEE Transactions on Biomedical Engineering},
  year={2026},
  institution={G.H. Raisoni College of Engineering, Nagpur},
  note={UCI Cleveland CAD Benchmark}
}`;

  const colabScript = `# SmartHeart AI: Google Colab One-Click Runner
!pip install -q streamlit pandas numpy scikit-learn xgboost optuna matplotlib seaborn shap pyngrok

# Download the complete app.py script
!wget -O app.py https://raw.githubusercontent.com/bhurep0973/smartheart-ai/main/app.py

# Launch Streamlit with public tunnel
!streamlit run app.py & npx localtunnel --port 8501
`;

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Consolidated LaTeX Tables & Academic Paper Integration
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-4xl">
          Direct copy-and-paste LaTeX tables formatted for standard IEEEtran.cls two-column template.
          All values, confidence intervals, and hyperparameter tables match the empirical benchmarks.
        </p>
      </div>

      {/* LaTeX Table Viewer */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-slate-200 shadow-md">
        {/* Table Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTableTab('t1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTableTab === 't1'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              TABLE I: Dataset Profile
            </button>
            <button
              onClick={() => setActiveTableTab('t2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTableTab === 't2'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              TABLE II: Hyperparameters
            </button>
            <button
              onClick={() => setActiveTableTab('t3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTableTab === 't3'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              TABLE III: Test Benchmarks
            </button>
            <button
              onClick={() => setActiveTableTab('t4')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTableTab === 't4'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              TABLE IV: Ablation Results
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const curText = activeTableTab === 't1' ? t1 : activeTableTab === 't2' ? t2 : activeTableTab === 't3' ? t3 : t4;
                handleCopy(curText, activeTableTab);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              {copiedKey === activeTableTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === activeTableTab ? 'Copied!' : 'Copy LaTeX'}</span>
            </button>
            <button
              onClick={() => {
                const curText = activeTableTab === 't1' ? t1 : activeTableTab === 't2' ? t2 : activeTableTab === 't3' ? t3 : t4;
                const fname = activeTableTab === 't1' ? 'TABLE_I_Dataset_Profile.tex' : activeTableTab === 't2' ? 'TABLE_II_Optimal_Hyperparameters.tex' : activeTableTab === 't3' ? 'TABLE_III_Test_Performance.tex' : 'TABLE_IV_Ablation_Study.tex';
                handleDownloadTex(curText, fname);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .tex</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <pre className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto max-h-72 leading-relaxed border border-slate-800/80">
          {activeTableTab === 't1' && t1}
          {activeTableTab === 't2' && t2}
          {activeTableTab === 't3' && t3}
          {activeTableTab === 't4' && t4}
        </pre>
      </div>

      {/* Global Archive Package & Colab Runner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Global ZIP Bundle Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Complete IEEE Publication Bundle (.zip)</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Exports all 8 high-resolution 300 DPI figures (PNG), 4 LaTeX source files (.tex), and citation metadata in one standardized package.
          </p>
          <ul className="text-xs text-slate-500 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <li>✓ 8 × 300 DPI Figures (PNG)</li>
            <li>✓ 4 × IEEE Compliant Tables (.tex)</li>
            <li>✓ README_IEEE_Artifacts.txt</li>
          </ul>
          <button
            onClick={onDownloadZip}
            disabled={isZipping}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'Generating All Artifacts...' : 'Download Full Package (.zip)'}</span>
          </button>
        </div>

        {/* Google Colab Execution Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm text-slate-900">Google Colab Execution Command</h3>
            </div>
            <button
              onClick={() => handleCopy(colabScript, 'colab')}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold cursor-pointer"
            >
              {copiedKey === 'colab' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'colab' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-900 text-amber-300 font-mono text-xs rounded-lg overflow-x-auto max-h-36 border border-slate-800">
            {colabScript}
          </pre>
          <p className="text-[11px] text-slate-500">
            Paste directly into a Google Colab notebook cell to spin up the full GPU-accelerated Streamlit dashboard with a live tunnel URL.
          </p>
        </div>
      </div>

      {/* BibTeX Citation Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">BibTeX Citation</h3>
          </div>
          <button
            onClick={() => handleCopy(bibtex, 'bibtex')}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold cursor-pointer"
          >
            {copiedKey === 'bibtex' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'bibtex' ? 'Copied' : 'Copy BibTeX'}</span>
          </button>
        </div>
        <pre className="p-3 bg-slate-50 font-mono text-xs text-slate-700 rounded-lg border border-slate-200 overflow-x-auto">
          {bibtex}
        </pre>
      </div>
    </div>
  );
};
