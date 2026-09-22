# 🫀 SmartHeart AI: Multimodal CAD Risk Stratification

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Streamlit](https://img.shields.io/badge/Streamlit-App-FF4B4B)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Scikit--Learn%20%7C%20XGBoost-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

**SmartHeart AI** is a clinically interpretable machine learning framework designed for early Coronary Artery Disease (CAD) risk stratification. This project investigates the efficacy of multimodal feature fusion combined with a Bayesian-tuned soft-voting ensemble to improve cardiovascular risk prediction while maintaining strict clinical interpretability.

## 🚀 Key Features

* **Multimodal Feature Fusion:** Categorizes patient attributes from the UCI Cleveland Heart Disease dataset into three distinct clinical modalities (Metabolic, Cardiac Stress, and Demographic) to capture non-linear physiological interactions.
* **Bayesian Hyperparameter Optimization:** Utilizes Optuna (TPE) for sequential, automated tuning of base classifiers (Logistic Regression, Random Forest, SVC, XGBoost) strictly on training folds to prevent data leakage.
* **Probabilistic Soft-Voting Ensemble:** Aggregates class probabilities rather than deterministic labels, achieving highly stable decision boundaries.
* **Clinical Interpretability (SHAP):** Maps predictive outputs back to clinical variables using Shapley Additive Explanations, ensuring the model remains transparent for healthcare professionals.
* **Interactive Web Application:** Includes a fully functional Streamlit dashboard for end-to-end pipeline execution, metric benchmarking, and publication-ready IEEE figure generation.

## 📊 Performance & Results

Evaluated on an independent, strictly isolated test cohort ($N=61$), the SmartHeart AI ensemble achieved state-of-the-art predictive stability for small clinical datasets:

* **ROC-AUC:** 0.961
* **Accuracy:** 91.8%
* **Sensitivity (Recall):** 92.6%
* **Specificity:** 85.7%

*Ablation studies confirmed that fusing demographic context with cardiac stress indicators yielded the highest predictive synergy.*

## 🛠️ Installation & Setup

To run the SmartHeart AI Streamlit application locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YourUsername/SmartHeart-AI.git](https://github.com/YourUsername/SmartHeart-AI.git)
   cd SmartHeart-AI
   
