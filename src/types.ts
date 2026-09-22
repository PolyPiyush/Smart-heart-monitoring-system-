export interface PatientRecord {
  id: number;
  age: number;
  sex: number; // 1: male, 0: female
  cp: number; // chest pain 1-4
  trestbps: number; // resting blood pressure
  chol: number; // serum cholestoral
  fbs: number; // fasting blood sugar > 120 (1 or 0)
  restecg: number; // resting ecg 0, 1, 2
  thalach: number; // max heart rate achieved
  exang: number; // exercise induced angina (1 or 0)
  oldpeak: number; // ST depression
  slope: number; // slope of peak exercise ST segment
  ca: number; // number of major vessels (0-3)
  thal: number; // 3: normal, 6: fixed defect, 7: reversible defect
  num: number; // 0: <50% stenosis, 1: >=50% stenosis (CAD positive)
}

export interface ModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  specificity: number;
  f1: number;
  rocAuc: number;
  prAuc: number;
  tp: number;
  tn: number;
  fp: number;
  fn: number;
}

export interface OptimizationTrial {
  trial: number;
  value: number;
  bestValue: number;
}

export interface AblationStudyResult {
  modality: string;
  features: string;
  featureCount: number;
  accuracy: number;
  f1: number;
  rocAuc: number;
  description: string;
}

export interface PipelineExecutionState {
  isTraining: boolean;
  trainingProgress: number;
  trainSplit: number;
  optunaTrials: number;
  randomSeed: number;
  datasetName: string;
  totalSamples: number;
  trainSamples: number;
  testSamples: number;
  models: {
    lr: ModelMetrics;
    rf: ModelMetrics;
    svc: ModelMetrics;
    xgb: ModelMetrics;
    ensemble: ModelMetrics;
  };
  trials: {
    lr: OptimizationTrial[];
    rf: OptimizationTrial[];
    svc: OptimizationTrial[];
    xgb: OptimizationTrial[];
  };
  ablation: AblationStudyResult[];
  optimalParams: {
    lr: { C: number; solver: string; penalty: string };
    rf: { nEstimators: number; maxDepth: number; minLeaf: number };
    svc: { C: number; gamma: string; kernel: string };
    xgb: { learningRate: number; maxDepth: number; nEstimators: number };
  };
  rocCurves: {
    [key: string]: { fpr: number[]; tpr: number[] };
  };
  prCurves: {
    [key: string]: { recall: number[]; precision: number[] };
  };
  featureImportances: { feature: string; importance: number; group: 'G1' | 'G2' | 'G3' }[];
}
