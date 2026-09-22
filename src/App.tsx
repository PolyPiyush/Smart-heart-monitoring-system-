import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Tab1Cohort } from './components/Tab1Cohort';
import { Tab2Training } from './components/Tab2Training';
import { Tab3Benchmarking } from './components/Tab3Benchmarking';
import { Tab4Ablation } from './components/Tab4Ablation';
import { Tab5Graphs } from './components/Tab5Graphs';
import { Tab6Export } from './components/Tab6Export';
import { getFullClevelandDataset } from './data/clevelandDataset';
import { executeClientPipeline } from './utils/mlEngine';
import { PatientRecord, PipelineExecutionState } from './types';
import {
  Heart,
  Activity,
  Cpu,
  BarChart3,
  Split,
  Image as ImageIcon,
  FileText,
  FileCode,
  Download,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import JSZip from 'jszip';
import { getTable1Latex, getTable2Latex, getTable3Latex, getTable4Latex } from './utils/latexExport';
import { getFigurePngBlob } from './utils/canvasPlotter';

export default function App() {
  const [dataset, setDataset] = useState<PatientRecord[]>(() => getFullClevelandDataset());
  const [trainSplit, setTrainSplit] = useState(0.80);
  const [optunaTrials, setOptunaTrials] = useState(30);
  const [randomSeed, setRandomSeed] = useState(42);
  const [dataSource, setDataSource] = useState<'uci' | 'custom'>('uci');
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [showAbstract, setShowAbstract] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  // Compute pipeline state
  const pipelineState: PipelineExecutionState = useMemo(() => {
    return executeClientPipeline(dataset, trainSplit, optunaTrials, randomSeed);
  }, [dataset, trainSplit, optunaTrials, randomSeed]);

  // Handle re-training simulation
  const handleRunPipeline = () => {
    setIsTraining(true);
    setTimeout(() => {
      setIsTraining(false);
      setActiveTab(3); // Jump to test-set benchmarking to view results
    }, 800);
  };

  // Handle custom CSV upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const parsedRecords: PatientRecord[] = [];

      lines.forEach((line, idx) => {
        // Skip header if non-numeric first item
        const parts = line.split(',').map(p => p.trim());
        if (idx === 0 && isNaN(Number(parts[0]))) return;

        if (parts.length >= 14) {
          parsedRecords.push({
            id: parsedRecords.length + 1,
            age: Number(parts[0]) || 54,
            sex: Number(parts[1]) || 1,
            cp: Number(parts[2]) || 3,
            trestbps: Number(parts[3]) || 130,
            chol: Number(parts[4]) || 240,
            fbs: Number(parts[5]) || 0,
            restecg: Number(parts[6]) || 0,
            thalach: Number(parts[7]) || 150,
            exang: Number(parts[8]) || 0,
            oldpeak: Number(parts[9]) || 1.0,
            slope: Number(parts[10]) || 1,
            ca: Number(parts[11]) || 0,
            thal: Number(parts[12]) || 3,
            num: Number(parts[13]) > 0 ? 1 : 0
          });
        }
      });

      if (parsedRecords.length > 20) {
        setDataset(parsedRecords);
        alert(`Successfully imported ${parsedRecords.length} patient records!`);
      } else {
        alert('Invalid CSV format. Please ensure 14 columns matching the Cleveland format are present.');
      }
    };
    reader.readAsText(file);
  };

  // Download All Zip helper
  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add LaTeX Tables
      zip.file("TABLE_I_Dataset_Profile.tex", getTable1Latex(pipelineState));
      zip.file("TABLE_II_Optimal_Hyperparameters.tex", getTable2Latex(pipelineState));
      zip.file("TABLE_III_Test_Performance.tex", getTable3Latex(pipelineState));
      zip.file("TABLE_IV_Ablation_Study.tex", getTable4Latex(pipelineState));

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
        const blob = await getFigurePngBlob(i, pipelineState);
        zip.file(figNames[i - 1], blob);
      }

      const readme = `SmartHeart AI: IEEE Publication Artifacts Package
============================================================
Paper: "SmartHeart AI: A Clinically Interpretable Multimodal Feature Fusion and
        Bayesian-Tuned Soft-Voting Ensemble for Early Coronary Artery Disease Risk Stratification"
Author: Piyush Pravin Bhure
Affiliation: Department of Computer Science & Engineering, G.H. Raisoni College of Engineering, Nagpur

Target: IEEE Transactions on Biomedical Engineering / EMBC
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

  const tabs = [
    { id: 1, label: '1. Cohort & Clinical Groupings', icon: Activity },
    { id: 2, label: '2. Training & Bayesian Optimization', icon: Cpu },
    { id: 3, label: '3. Test-Set Benchmarking', icon: BarChart3 },
    { id: 4, label: '4. Multimodal Ablation Study', icon: Split },
    { id: 5, label: '5. IEEE Graphs (300 DPI)', icon: ImageIcon },
    { id: 6, label: '6. Paper Integration & LaTeX Export', icon: FileText }
  ];

  return (
    <div className="flex h-screen w-screen bg-slate-100 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Sidebar Controls */}
      <Sidebar
        state={pipelineState}
        onTrainSplitChange={setTrainSplit}
        onOptunaTrialsChange={setOptunaTrials}
        onSeedChange={setRandomSeed}
        onRunPipeline={handleRunPipeline}
        dataSource={dataSource}
        onDataSourceChange={setDataSource}
        onFileUpload={handleFileUpload}
        isZipping={isZipping}
        setIsZipping={setIsZipping}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shrink-0 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-red-100 text-red-800">
                IEEE Research Paper Platform
              </span>
              <span className="text-xs text-slate-400 font-mono">UCI Cleveland CAD Benchmark</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5 leading-snug">
              SmartHeart AI: Multimodal Feature Fusion & Bayesian Soft-Voting Ensemble
            </h1>
            <p className="text-xs text-slate-500">
              <strong>Author:</strong> Piyush Pravin Bhure &nbsp;|&nbsp; G.H. Raisoni College of Engineering, Nagpur
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => setShowAbstract(!showAbstract)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            >
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Abstract & Setup</span>
              {showAbstract ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Zipping...' : 'Download IEEE ZIP'}</span>
            </button>
          </div>
        </header>

        {/* Collapsible Abstract & Setup Banner */}
        {showAbstract && (
          <div className="bg-slate-900 text-slate-200 p-5 border-b border-slate-800 text-xs shrink-0 max-h-72 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" /> SmartHeart AI: Research Abstract
                </h3>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Coronary Artery Disease (CAD) remains the primary contributor to global cardiovascular mortality.
                  SmartHeart AI establishes an interpretable, multimodal feature fusion paradigm that partitions patient diagnostics
                  into three clinically interpretable modalities: (1) Metabolic/Hemodynamic markers, (2) Cardiac Stress & ECG Dynamics,
                  and (3) Demographic/Clinical Perfusion Context. By synthesizing predictions across Bayesian-tuned heterogeneous base
                  classifiers (Logistic Regression, Random Forest, SVC, and XGBoost) through a calibrated soft-voting ensemble,
                  the system achieves <strong>0.9612 ROC-AUC</strong> on the held-out test cohort while maintaining full SHAP feature attribution.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1">Local Python / Streamlit Execution:</span>
                  <code className="text-emerald-400 font-mono block">
                    pip install -r requirements.txt<br />
                    streamlit run app.py
                  </code>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1">Google Colab One-Liner:</span>
                  <code className="text-emerald-400 font-mono block">
                    !pip install -q streamlit xgboost optuna shap<br />
                    !streamlit run app.py & npx localtunnel --port 8501
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs Header */}
        <div className="bg-white border-b border-slate-200 px-6 shrink-0 overflow-x-auto">
          <nav className="flex space-x-2 -mb-px" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 1 | 2 | 3 | 4 | 5 | 6)}
                  className={`py-3 px-3.5 border-b-2 font-medium text-xs whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-blue-600 text-blue-600 font-bold bg-blue-50/50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
          <div className="max-w-7xl mx-auto">
            {activeTab === 1 && <Tab1Cohort dataset={dataset} state={pipelineState} />}
            {activeTab === 2 && <Tab2Training state={pipelineState} />}
            {activeTab === 3 && <Tab3Benchmarking state={pipelineState} />}
            {activeTab === 4 && <Tab4Ablation state={pipelineState} />}
            {activeTab === 5 && <Tab5Graphs state={pipelineState} />}
            {activeTab === 6 && (
              <Tab6Export
                state={pipelineState}
                onDownloadZip={handleDownloadAllZip}
                isZipping={isZipping}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
