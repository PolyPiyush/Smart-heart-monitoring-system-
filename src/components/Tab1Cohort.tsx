import React, { useState } from 'react';
import { PatientRecord, PipelineExecutionState } from '../types';
import { Copy, Check, Download, Info, Activity, Heart, ShieldAlert, Search } from 'lucide-react';
import { getTable1Latex } from '../utils/latexExport';

interface Tab1CohortProps {
  dataset: PatientRecord[];
  state: PipelineExecutionState;
}

export const Tab1Cohort: React.FC<Tab1CohortProps> = ({ dataset, state }) => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const totalPatients = dataset.length;
  const cadPositive = dataset.filter(d => d.num === 1).length;
  const cadNegative = totalPatients - cadPositive;

  const filteredData = dataset.filter(d => {
    return (
      d.id.toString().includes(searchTerm) ||
      d.age.toString().includes(searchTerm) ||
      (d.sex === 1 ? 'male' : 'female').includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentRows = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const table1Latex = getTable1Latex(state);

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(table1Latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTex = () => {
    const blob = new Blob([table1Latex], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TABLE_I_Dataset_Profile.tex';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-600" />
          Cohort Overview & Multimodal Clinical Groupings
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-4xl">
          The benchmark utilizes the benchmark <strong>UCI Cleveland Coronary Artery Disease (CAD)</strong> repository (N={totalPatients}),
          hierarchically categorized into three clinically distinct physiological modalities to mimic hospital diagnostic flows.
        </p>

        {/* High-level metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Total Cohort Size</span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{totalPatients} Patients</div>
            <p className="text-xs text-slate-500 mt-1">13 Clinical Attributes + CAD Diagnosis</p>
          </div>

          <div className="bg-red-50/60 p-4 rounded-lg border border-red-200/80">
            <span className="text-xs font-semibold uppercase text-red-700 tracking-wider flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> CAD Positive (≥50% Stenosis)
            </span>
            <div className="text-2xl font-bold text-red-900 font-mono mt-1">
              {cadPositive} <span className="text-sm font-normal text-red-700 font-sans">({((cadPositive / totalPatients) * 100).toFixed(1)}%)</span>
            </div>
            <p className="text-xs text-red-600 mt-1">Fluoroscopy-confirmed diameter narrowing</p>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-lg border border-emerald-200/80">
            <span className="text-xs font-semibold uppercase text-emerald-700 tracking-wider">Normal / Non-CAD (&lt;50%)</span>
            <div className="text-2xl font-bold text-emerald-900 font-mono mt-1">
              {cadNegative} <span className="text-sm font-normal text-emerald-700 font-sans">({((cadNegative / totalPatients) * 100).toFixed(1)}%)</span>
            </div>
            <p className="text-xs text-emerald-600 mt-1">Healthy baseline control group</p>
          </div>

          <div className="bg-blue-50/60 p-4 rounded-lg border border-blue-200/80">
            <span className="text-xs font-semibold uppercase text-blue-700 tracking-wider">Clinical Modalities</span>
            <div className="text-2xl font-bold text-blue-900 font-mono mt-1">3 Modalities</div>
            <p className="text-xs text-blue-600 mt-1">Metabolic + Stress/ECG + Demographic</p>
          </div>
        </div>
      </div>

      {/* 3 Clinical Modality Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Group 1 */}
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              G1
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Metabolic & Hemodynamic</h3>
              <p className="text-xs text-blue-600 font-medium">4 Continuous / Binary Features</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 mt-3 border-t border-slate-100 pt-3">
            <li className="flex justify-between">
              <span className="font-mono font-semibold text-slate-800">age:</span>
              <span className="text-slate-500">Chronological age (years)</span>
            </li>
            <li className="flex justify-between">
              <span className="font-mono font-semibold text-slate-800">trestbps:</span>
              <span className="text-slate-500">Resting blood pressure (mmHg)</span>
            </li>
            <li className="flex justify-between">
              <span className="font-mono font-semibold text-slate-800">chol:</span>
              <span className="text-slate-500">Serum cholesterol (mg/dl)</span>
            </li>
            <li className="flex justify-between">
              <span className="font-mono font-semibold text-slate-800">fbs:</span>
              <span className="text-slate-500">Fasting blood sugar &gt; 120 mg/dl</span>
            </li>
          </ul>
          <div className="mt-4 p-2 bg-blue-50/60 rounded text-[11px] text-blue-800">
            <strong>Clinical Role:</strong> Encodes baseline vascular workload and metabolic syndrome risk profile.
          </div>
        </div>

        {/* Group 2 */}
        <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm hover:border-amber-300 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
              G2
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Cardiac Stress & ECG Dynamics</h3>
              <p className="text-xs text-amber-600 font-medium">5 Exercise & Electrophysiology Features</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 mt-3 border-t border-slate-100 pt-3">
            <li className="flex justify-between">
              <span className="font-mono font-semibold text-slate-800">restecg:</span>
              <span className="text-slate-500">Resting electrocardiographic results</span>
            </li>
            <li className="flex justify-between">
              <span className="font-mono font-semibold text-slate-800">thalach:</span>
              <span className="text-slate-500">Maximum exercise HR (bpm)</span>
            </li>
            <li className="flex justify-between">
              <span className="font-mono font-semibold text-slate-800">exang:</span>
              <span className="text-slate-500">Exercise-induced angina (1/0)</span>
            </li>
            <li className="flex justify-between">
              <span className="font-mono font-semibold text-slate-800">oldpeak:</span>
              <span className="text-slate-500">Exercise ST depression (mm)</span>
            </li>
            <li className="flex justify-between">
              <span className="font-mono font-semibold text-slate-800">slope:</span>
              <span className="text-slate-500">Slope of peak ST segment</span>
            </li>
          </ul>
          <div className="mt-4 p-2 bg-amber-50/60 rounded text-[11px] text-amber-800">
            <strong>Clinical Role:</strong> Quantifies reversible myocardial ischemia provoked during standardized cardiac stress.
          </div>
        </div>

        {/* Group 3 */}
        <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              G3
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Demographic & Clinical Context</h3>
              <p className="text-xs text-emerald-600 font-medium">4 Categorical & Anatomic Features</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 mt-3 border-t border-slate-100 pt-3">
            <li className="flex justify-between">
              <span className="font-mono font-semibold text-slate-800">sex:</span>
              <span className="text-slate-500">Biological sex (1=Male, 0=Female)</span>
            </li>
            <li className="flex justify-between">
              <span className="font-mono font-semibold text-slate-800">cp:</span>
              <span className="text-slate-500">Chest pain type (1 to 4)</span>
            </li>
            <li className="flex justify-between">
              <span className="font-mono font-semibold text-slate-800">ca:</span>
              <span className="text-slate-500">Major fluoroscopy vessels (0-3)</span>
            </li>
            <li className="flex justify-between">
              <span className="font-mono font-semibold text-slate-800">thal:</span>
              <span className="text-slate-500">Thallium scintigraphy defect</span>
            </li>
          </ul>
          <div className="mt-4 p-2 bg-emerald-50/60 rounded text-[11px] text-emerald-800">
            <strong>Clinical Role:</strong> Supplies direct anatomical perfusion and patient demographic susceptibility markers.
          </div>
        </div>
      </div>

      {/* Interactive Dataset Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Patient Cohort Inspection Table</h3>
            <p className="text-xs text-slate-500">Showing {filteredData.length} records matching search criteria</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, age, sex..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Age</th>
                <th className="py-2.5 px-3">Sex</th>
                <th className="py-2.5 px-3">CP</th>
                <th className="py-2.5 px-3">Trestbps</th>
                <th className="py-2.5 px-3">Chol</th>
                <th className="py-2.5 px-3">FBS</th>
                <th className="py-2.5 px-3">RestECG</th>
                <th className="py-2.5 px-3">Thalach</th>
                <th className="py-2.5 px-3">Exang</th>
                <th className="py-2.5 px-3">Oldpeak</th>
                <th className="py-2.5 px-3">Slope</th>
                <th className="py-2.5 px-3">CA</th>
                <th className="py-2.5 px-3">Thal</th>
                <th className="py-2.5 px-3">Target (CAD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-3 font-mono text-slate-500">#{row.id}</td>
                  <td className="py-2 px-3 font-medium text-slate-800">{row.age}</td>
                  <td className="py-2 px-3">{row.sex === 1 ? 'Male (1)' : 'Female (0)'}</td>
                  <td className="py-2 px-3 font-mono">{row.cp}</td>
                  <td className="py-2 px-3">{row.trestbps}</td>
                  <td className="py-2 px-3">{row.chol}</td>
                  <td className="py-2 px-3">{row.fbs}</td>
                  <td className="py-2 px-3">{row.restecg}</td>
                  <td className="py-2 px-3 font-mono">{row.thalach}</td>
                  <td className="py-2 px-3">{row.exang}</td>
                  <td className="py-2 px-3 font-mono">{row.oldpeak.toFixed(1)}</td>
                  <td className="py-2 px-3">{row.slope}</td>
                  <td className="py-2 px-3 font-mono">{row.ca}</td>
                  <td className="py-2 px-3 font-mono">{row.thal}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.num === 1
                          ? 'bg-red-100 text-red-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {row.num === 1 ? 'CAD Positive' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span>Page {page} of {Math.max(1, totalPages)}</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Formatted LaTeX Code Box for Table I */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-slate-200 shadow-md">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
              TABLE I (LaTeX Code)
            </div>
            <span className="text-xs text-slate-400">Dataset Profile and Multimodal Modality Groupings</span>
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
          {table1Latex}
        </pre>
      </div>
    </div>
  );
};
