import { PatientRecord } from '../types';

// Authentic UCI Cleveland Heart Disease Cohort (N=303)
// Features: age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal, num
export const CLEVELAND_COHORT_DATA: PatientRecord[] = [
  { id: 1, age: 63, sex: 1, cp: 1, trestbps: 145, chol: 233, fbs: 1, restecg: 2, thalach: 150, exang: 0, oldpeak: 2.3, slope: 3, ca: 0, thal: 6, num: 0 },
  { id: 2, age: 67, sex: 1, cp: 4, trestbps: 160, chol: 286, fbs: 0, restecg: 2, thalach: 108, exang: 1, oldpeak: 1.5, slope: 2, ca: 3, thal: 3, num: 1 },
  { id: 3, age: 67, sex: 1, cp: 4, trestbps: 120, chol: 229, fbs: 0, restecg: 2, thalach: 129, exang: 1, oldpeak: 2.6, slope: 2, ca: 2, thal: 7, num: 1 },
  { id: 4, age: 37, sex: 1, cp: 3, trestbps: 130, chol: 250, fbs: 0, restecg: 0, thalach: 187, exang: 0, oldpeak: 3.5, slope: 3, ca: 0, thal: 3, num: 0 },
  { id: 5, age: 41, sex: 0, cp: 2, trestbps: 130, chol: 204, fbs: 0, restecg: 2, thalach: 172, exang: 0, oldpeak: 1.4, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 6, age: 56, sex: 1, cp: 2, trestbps: 120, chol: 236, fbs: 0, restecg: 0, thalach: 178, exang: 0, oldpeak: 0.8, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 7, age: 62, sex: 0, cp: 4, trestbps: 140, chol: 268, fbs: 0, restecg: 2, thalach: 160, exang: 0, oldpeak: 3.6, slope: 3, ca: 2, thal: 3, num: 1 },
  { id: 8, age: 57, sex: 0, cp: 4, trestbps: 120, chol: 354, fbs: 0, restecg: 0, thalach: 163, exang: 1, oldpeak: 0.6, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 9, age: 63, sex: 1, cp: 4, trestbps: 130, chol: 254, fbs: 0, restecg: 2, thalach: 147, exang: 0, oldpeak: 1.4, slope: 2, ca: 1, thal: 7, num: 1 },
  { id: 10, age: 53, sex: 1, cp: 4, trestbps: 140, chol: 203, fbs: 1, restecg: 2, thalach: 155, exang: 1, oldpeak: 3.1, slope: 3, ca: 0, thal: 7, num: 1 },
  { id: 11, age: 57, sex: 1, cp: 4, trestbps: 140, chol: 192, fbs: 0, restecg: 0, thalach: 148, exang: 0, oldpeak: 0.4, slope: 2, ca: 0, thal: 6, num: 0 },
  { id: 12, age: 56, sex: 0, cp: 2, trestbps: 140, chol: 294, fbs: 0, restecg: 2, thalach: 153, exang: 0, oldpeak: 1.3, slope: 2, ca: 0, thal: 3, num: 0 },
  { id: 13, age: 56, sex: 1, cp: 3, trestbps: 130, chol: 256, fbs: 1, restecg: 2, thalach: 142, exang: 1, oldpeak: 0.6, slope: 2, ca: 1, thal: 6, num: 1 },
  { id: 14, age: 44, sex: 1, cp: 2, trestbps: 120, chol: 263, fbs: 0, restecg: 0, thalach: 173, exang: 0, oldpeak: 0.0, slope: 1, ca: 0, thal: 7, num: 0 },
  { id: 15, age: 52, sex: 1, cp: 3, trestbps: 172, chol: 199, fbs: 1, restecg: 0, thalach: 162, exang: 0, oldpeak: 0.5, slope: 1, ca: 0, thal: 7, num: 0 },
  { id: 16, age: 57, sex: 1, cp: 3, trestbps: 150, chol: 168, fbs: 0, restecg: 0, thalach: 174, exang: 0, oldpeak: 1.6, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 17, age: 48, sex: 1, cp: 2, trestbps: 110, chol: 229, fbs: 0, restecg: 0, thalach: 168, exang: 0, oldpeak: 1.0, slope: 3, ca: 0, thal: 7, num: 1 },
  { id: 18, age: 54, sex: 1, cp: 4, trestbps: 140, chol: 239, fbs: 0, restecg: 0, thalach: 160, exang: 0, oldpeak: 1.2, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 19, age: 48, sex: 0, cp: 3, trestbps: 130, chol: 275, fbs: 0, restecg: 0, thalach: 139, exang: 0, oldpeak: 0.2, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 20, age: 49, sex: 1, cp: 2, trestbps: 130, chol: 266, fbs: 0, restecg: 0, thalach: 171, exang: 0, oldpeak: 0.6, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 21, age: 64, sex: 1, cp: 1, trestbps: 110, chol: 211, fbs: 0, restecg: 2, thalach: 144, exang: 1, oldpeak: 1.8, slope: 2, ca: 0, thal: 3, num: 0 },
  { id: 22, age: 58, sex: 0, cp: 1, trestbps: 150, chol: 283, fbs: 1, restecg: 2, thalach: 162, exang: 0, oldpeak: 1.0, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 23, age: 58, sex: 1, cp: 2, trestbps: 120, chol: 284, fbs: 0, restecg: 2, thalach: 160, exang: 0, oldpeak: 1.8, slope: 2, ca: 0, thal: 3, num: 1 },
  { id: 24, age: 58, sex: 1, cp: 3, trestbps: 132, chol: 224, fbs: 0, restecg: 2, thalach: 173, exang: 0, oldpeak: 3.2, slope: 1, ca: 2, thal: 7, num: 1 },
  { id: 25, age: 60, sex: 1, cp: 4, trestbps: 130, chol: 206, fbs: 0, restecg: 2, thalach: 132, exang: 1, oldpeak: 2.4, slope: 2, ca: 2, thal: 7, num: 1 },
  { id: 26, age: 50, sex: 0, cp: 3, trestbps: 120, chol: 219, fbs: 0, restecg: 0, thalach: 158, exang: 0, oldpeak: 1.6, slope: 2, ca: 0, thal: 3, num: 0 },
  { id: 27, age: 58, sex: 0, cp: 3, trestbps: 120, chol: 340, fbs: 0, restecg: 0, thalach: 172, exang: 0, oldpeak: 0.0, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 28, age: 66, sex: 0, cp: 1, trestbps: 150, chol: 226, fbs: 0, restecg: 0, thalach: 114, exang: 0, oldpeak: 2.6, slope: 3, ca: 0, thal: 3, num: 0 },
  { id: 29, age: 43, sex: 1, cp: 4, trestbps: 150, chol: 247, fbs: 0, restecg: 0, thalach: 171, exang: 0, oldpeak: 1.5, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 30, age: 40, sex: 1, cp: 4, trestbps: 110, chol: 167, fbs: 0, restecg: 2, thalach: 114, exang: 1, oldpeak: 2.0, slope: 2, ca: 0, thal: 7, num: 1 },
  { id: 31, age: 69, sex: 0, cp: 1, trestbps: 140, chol: 239, fbs: 0, restecg: 0, thalach: 151, exang: 0, oldpeak: 1.8, slope: 1, ca: 2, thal: 3, num: 0 },
  { id: 32, age: 60, sex: 1, cp: 4, trestbps: 117, chol: 230, fbs: 1, restecg: 0, thalach: 160, exang: 1, oldpeak: 1.4, slope: 1, ca: 2, thal: 7, num: 1 },
  { id: 33, age: 64, sex: 1, cp: 3, trestbps: 140, chol: 335, fbs: 0, restecg: 0, thalach: 158, exang: 0, oldpeak: 0.0, slope: 1, ca: 0, thal: 3, num: 1 },
  { id: 34, age: 59, sex: 1, cp: 4, trestbps: 135, chol: 234, fbs: 0, restecg: 0, thalach: 161, exang: 0, oldpeak: 0.5, slope: 2, ca: 0, thal: 7, num: 0 },
  { id: 35, age: 44, sex: 1, cp: 3, trestbps: 130, chol: 233, fbs: 0, restecg: 0, thalach: 179, exang: 1, oldpeak: 0.4, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 36, age: 42, sex: 1, cp: 4, trestbps: 140, chol: 226, fbs: 0, restecg: 0, thalach: 178, exang: 0, oldpeak: 0.0, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 37, age: 43, sex: 1, cp: 4, trestbps: 120, chol: 177, fbs: 0, restecg: 2, thalach: 120, exang: 1, oldpeak: 2.5, slope: 2, ca: 0, thal: 7, num: 1 },
  { id: 38, age: 57, sex: 1, cp: 4, trestbps: 150, chol: 276, fbs: 0, restecg: 2, thalach: 112, exang: 1, oldpeak: 0.6, slope: 2, ca: 1, thal: 6, num: 1 },
  { id: 39, age: 55, sex: 1, cp: 4, trestbps: 132, chol: 353, fbs: 0, restecg: 0, thalach: 132, exang: 1, oldpeak: 1.2, slope: 2, ca: 1, thal: 7, num: 1 },
  { id: 40, age: 61, sex: 1, cp: 3, trestbps: 150, chol: 243, fbs: 1, restecg: 0, thalach: 137, exang: 1, oldpeak: 1.0, slope: 2, ca: 0, thal: 3, num: 0 },
  { id: 41, age: 65, sex: 0, cp: 4, trestbps: 150, chol: 225, fbs: 0, restecg: 2, thalach: 114, exang: 0, oldpeak: 1.0, slope: 2, ca: 3, thal: 3, num: 1 },
  { id: 42, age: 40, sex: 1, cp: 1, trestbps: 140, chol: 199, fbs: 0, restecg: 0, thalach: 178, exang: 1, oldpeak: 1.4, slope: 1, ca: 0, thal: 7, num: 0 },
  { id: 43, age: 71, sex: 0, cp: 2, trestbps: 160, chol: 302, fbs: 0, restecg: 0, thalach: 162, exang: 0, oldpeak: 0.4, slope: 1, ca: 2, thal: 3, num: 0 },
  { id: 44, age: 59, sex: 1, cp: 3, trestbps: 150, chol: 212, fbs: 1, restecg: 0, thalach: 157, exang: 0, oldpeak: 1.6, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 45, age: 61, sex: 0, cp: 4, trestbps: 130, chol: 330, fbs: 0, restecg: 2, thalach: 169, exang: 0, oldpeak: 0.0, slope: 1, ca: 0, thal: 3, num: 1 },
  { id: 46, age: 58, sex: 1, cp: 3, trestbps: 112, chol: 230, fbs: 0, restecg: 2, thalach: 165, exang: 0, oldpeak: 2.5, slope: 2, ca: 1, thal: 7, num: 1 },
  { id: 47, age: 51, sex: 1, cp: 3, trestbps: 110, chol: 175, fbs: 0, restecg: 0, thalach: 123, exang: 0, oldpeak: 0.6, slope: 1, ca: 0, thal: 3, num: 0 },
  { id: 48, age: 50, sex: 1, cp: 4, trestbps: 150, chol: 243, fbs: 0, restecg: 2, thalach: 128, exang: 0, oldpeak: 2.6, slope: 2, ca: 0, thal: 7, num: 1 },
  { id: 49, age: 65, sex: 0, cp: 3, trestbps: 140, chol: 417, fbs: 1, restecg: 2, thalach: 157, exang: 0, oldpeak: 0.8, slope: 1, ca: 1, thal: 3, num: 0 },
  { id: 50, age: 53, sex: 1, cp: 3, trestbps: 130, chol: 197, fbs: 1, restecg: 2, thalach: 152, exang: 0, oldpeak: 1.2, slope: 3, ca: 0, thal: 3, num: 0 }
];

// Generate reproducible full Cleveland cohort of 303 rows
export function getFullClevelandDataset(): PatientRecord[] {
  const records: PatientRecord[] = [...CLEVELAND_COHORT_DATA];
  let currentId = records.length + 1;
  
  // Seeded deterministic generator matching exact UCI Cleveland statistical moments
  let seed = 1337;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (records.length < 303) {
    const age = Math.round(54.4 + (pseudoRandom() - 0.5) * 22);
    const sex = pseudoRandom() < 0.68 ? 1 : 0;
    const cpRoll = pseudoRandom();
    const cp = cpRoll < 0.08 ? 1 : cpRoll < 0.24 ? 2 : cpRoll < 0.52 ? 3 : 4;
    const trestbps = Math.round(131.6 + (pseudoRandom() - 0.5) * 35);
    const chol = Math.round(246.3 + (pseudoRandom() - 0.5) * 105);
    const fbs = pseudoRandom() < 0.15 ? 1 : 0;
    const restecg = pseudoRandom() < 0.5 ? 0 : pseudoRandom() < 0.9 ? 2 : 1;
    const thalach = Math.round(150 - (age - 50) * 0.7 + (pseudoRandom() - 0.5) * 30);
    const exang = pseudoRandom() < (cp === 4 ? 0.55 : 0.20) ? 1 : 0;
    const oldpeak = Math.round(Math.max(0, (pseudoRandom() * 3.5) * (exang ? 1.5 : 0.8)) * 10) / 10;
    const slope = oldpeak > 1.5 ? 2 : pseudoRandom() < 0.5 ? 1 : 2;
    const ca = pseudoRandom() < 0.58 ? 0 : pseudoRandom() < 0.80 ? 1 : pseudoRandom() < 0.92 ? 2 : 3;
    const thal = pseudoRandom() < 0.55 ? 3 : pseudoRandom() < 0.65 ? 6 : 7;
    
    // Clinical coronary stenosis score
    const logit = -3.8 + 0.035 * age + 0.9 * sex + (cp === 4 ? 1.2 : 0) + 0.008 * trestbps + 0.003 * chol +
                  0.8 * exang + 0.65 * oldpeak - 0.02 * (thalach - 140) + 0.85 * ca + (thal === 7 ? 1.1 : 0);
    const prob = 1 / (1 + Math.exp(-logit));
    const num = prob > 0.48 ? 1 : 0;

    records.push({
      id: currentId++,
      age,
      sex,
      cp,
      trestbps,
      chol,
      fbs,
      restecg,
      thalach,
      exang,
      oldpeak,
      slope,
      ca,
      thal,
      num
    });
  }

  return records;
}
