import { PipelineExecutionState } from '../types';

export function getTable1Latex(state: PipelineExecutionState): string {
  return `\\begin{table}[htbp]
\\centering
\\caption{CLINICAL COHORT PROFILE AND MULTIMODAL FEATURE GROUPINGS (UCI CLEVELAND, $N=${state.totalSamples}$)}
\\label{tab:dataset_profile}
\\begin{tabular}{lllcc}
\\hline
\\textbf{Clinical Modality} & \\textbf{Feature} & \\textbf{Clinical Interpretation} & \\textbf{Type} & \\textbf{Mean $\\pm$ SD / \\%} \\\\
\\hline
\\multirow{4}{*}{\\shortstack[l]{\\textbf{Group 1:}\\\\Metabolic /\\\\Hemodynamic}}
& age & Patient chronological age & Cont. & $54.4 \\pm 9.0$ yrs \\\\
& trestbps & Resting systolic blood pressure & Cont. & $131.6 \\pm 17.5$ mmHg \\\\
& chol & Serum cholesterol level & Cont. & $246.3 \\pm 51.8$ mg/dl \\\\
& fbs & Fasting blood sugar $> 120$ mg/dl & Bin. & $14.9\\%$ \\\\
\\hline
\\multirow{5}{*}{\\shortstack[l]{\\textbf{Group 2:}\\\\Cardiac Stress /\\\\ECG Dynamics}}
& restecg & Resting electrocardiographic results & Cat. & Classes 0, 1, 2 \\\\
& thalach & Maximum exercise heart rate achieved & Cont. & $149.6 \\pm 22.9$ bpm \\\\
& exang & Exercise-induced angina & Bin. & $32.7\\%$ \\\\
& oldpeak & ST depression induced by exercise & Cont. & $1.04 \\pm 1.16$ mm \\\\
& slope & Slope of the peak exercise ST segment & Cat. & Upsloping, Flat, Down \\\\
\\hline
\\multirow{4}{*}{\\shortstack[l]{\\textbf{Group 3:}\\\\Demographic /\\\\Clinical Context}}
& sex & Biological sex ($1=$ Male, $0=$ Female) & Bin. & $67.9\\%$ Male \\\\
& cp & Chest pain type (1: typ, 2: atyp, 3: non, 4: asym) & Cat. & $47.5\\%$ Asymptomatic \\\\
& ca & Major vessels ($0-3$) colored by fluoroscopy & Cat. & Range: $0 - 3$ \\\\
& thal & Thallium scintigraphy defect & Cat. & Normal, Fixed, Rev. \\\\
\\hline
\\textbf{Target Outcome} & num & Coronary diameter narrowing $\\ge 50\\%$ & Bin. & $45.9\\%$ CAD Positive \\\\
\\hline
\\end{tabular}
\\end{table}`;
}

export function getTable2Latex(state: PipelineExecutionState): string {
  const { lr, rf, svc, xgb } = state.optimalParams;
  return `\\begin{table}[htbp]
\\centering
\\caption{OPTIMAL HYPERPARAMETERS IDENTIFIED VIA BAYESIAN TPE OPTIMIZATION (5-FOLD CV)}
\\label{tab:hyperparameters}
\\begin{tabular}{lll}
\\hline
\\textbf{Model Architecture} & \\textbf{Hyperparameter Search Space} & \\textbf{Optimal Configuration} \\\\
\\hline
\\textbf{Logistic Regression} & $C \\in [10^{-3}, 10]$, Solver $\\in$ \\{\\text{lbfgs, liblinear}\\} & $C = ${lr.C.toFixed(4)}$, Solver = ${lr.solver}, Penalty = ${lr.penalty} \\\\
\\textbf{Random Forest} & Trees $\\in [50, 300]$, Depth $\\in [2, 12]$, Leaf $\\in [1, 6]$ & $n = ${rf.nEstimators}$, Max Depth = ${rf.maxDepth}$, Min Leaf = ${rf.minLeaf} \\\\
\\textbf{Support Vector Machine} & $C \\in [10^{-2}, 10]$, Kernel $\\in$ \\{\\text{rbf, linear}\\} & $C = ${svc.C.toFixed(4)}$, Kernel = ${svc.kernel}, $\\gamma$ = ${svc.gamma} \\\\
\\textbf{XGBoost / Gradient Boost} & Rate $\\in [0.01, 0.3]$, Depth $\\in [2, 8]$, Trees $\\in [50, 250]$ & Rate = ${xgb.learningRate.toFixed(3)}$, Depth = ${xgb.maxDepth}$, $n = ${xgb.nEstimators}$ \\\\
\\hline
\\textbf{Soft-Voting Ensemble} & Soft-max calibrated weighted decision rule & Weights: LR ($1.0$), RF ($1.2$), SVC ($1.1$), XGB ($1.3$) \\\\
\\hline
\\end{tabular}
\\end{table}`;
}

export function getTable3Latex(state: PipelineExecutionState): string {
  const models = [
    state.models.lr,
    state.models.rf,
    state.models.svc,
    state.models.xgb,
    state.models.ensemble
  ];

  const rows = models.map(m => {
    const isEnsemble = m.name.includes('Ensemble');
    const boldOpen = isEnsemble ? '\\textbf{' : '';
    const boldClose = isEnsemble ? '}' : '';
    return `${boldOpen}${m.name}${boldClose} & ` +
      `${boldOpen}${(m.accuracy * 100).toFixed(2)}\\%${boldClose} & ` +
      `${boldOpen}${(m.precision * 100).toFixed(2)}\\%${boldClose} & ` +
      `${boldOpen}${(m.recall * 100).toFixed(2)}\\%${boldClose} & ` +
      `${boldOpen}${(m.specificity * 100).toFixed(2)}\\%${boldClose} & ` +
      `${boldOpen}${m.f1.toFixed(4)}${boldClose} & ` +
      `${boldOpen}${m.rocAuc.toFixed(4)}${boldClose} & ` +
      `${boldOpen}${m.prAuc.toFixed(4)}${boldClose} \\\\`;
  }).join('\n');

  return `\\begin{table*}[t]
\\centering
\\caption{BENCHMARK PERFORMANCE ON INDEPENDENT HELD-OUT TEST COHORT ($N_{test}=${state.testSamples}$)}
\\label{tab:test_benchmarks}
\\begin{tabular}{lcccccccc}
\\hline
\\textbf{Model Architecture} & \\textbf{Accuracy} & \\textbf{Precision} & \\textbf{Sensitivity} & \\textbf{Specificity} & \\textbf{F1-Score} & \\textbf{ROC-AUC} & \\textbf{PR-AUC} \\\\
\\hline
${rows}
\\hline
\\end{tabular}
\\end{table*}`;
}

export function getTable4Latex(state: PipelineExecutionState): string {
  const rows = state.ablation.map(item => {
    const isEnsemble = item.modality.includes('Ensemble');
    const boldOpen = isEnsemble ? '\\textbf{' : '';
    const boldClose = isEnsemble ? '}' : '';
    return `${boldOpen}${item.modality}${boldClose} & ` +
      `${boldOpen}${item.features}${boldClose} & ` +
      `${boldOpen}${(item.accuracy * 100).toFixed(2)}\\%${boldClose} & ` +
      `${boldOpen}${item.f1.toFixed(4)}${boldClose} & ` +
      `${boldOpen}${item.rocAuc.toFixed(4)}${boldClose} \\\\`;
  }).join('\n');

  return `\\begin{table}[htbp]
\\centering
\\caption{MULTIMODAL FEATURE FUSION ABLATION STUDY RESULTS}
\\label{tab:ablation_study}
\\begin{tabular}{llccc}
\\hline
\\textbf{Feature Representation} & \\textbf{Attribute Subset} & \\textbf{Accuracy} & \\textbf{F1-Score} & \\textbf{ROC-AUC} \\\\
\\hline
${rows}
\\hline
\\end{tabular}
\\end{table}`;
}
