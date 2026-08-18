# 💰 Sales Prediction & Ad Spend Optimization — Marketing Pulse Dashboard

An advanced data science pipeline, predictive regression suite, and interactive web dashboard evaluating how TV, Radio, and Newspaper ad spend drive sales performance — featuring statistical synergy testing ($TV \times Radio$), SHAP model explainability, and a live budget allocation simulator.

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-239120?style=for-the-badge&logo=xgboost&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br>

[![Launch Interactive Dashboard](https://img.shields.io/badge/🚀%20LAUNCH%20LIVE%20DASHBOARD-2d2d2d?style=for-the-badge)](https://wv43jg.csb.app)
[![CodeSandbox Link](https://img.shields.io/badge/WV43JG.CSB.APP-8b2fc9?style=for-the-badge)](https://wv43jg.csb.app)

---

### 📌 Project Overview

Built as **Task 4 for the CodeAlpha Data Science Internship**, this project models product sales volume relative to multi-channel advertising investments. It provides both rigorous backend statistical modeling and an interactive React web dashboard (`Marketing Pulse`) for real-time scenario testing and campaign optimization.

### 📦 Dataset

* **Source:** [Advertising.csv — Kaggle](https://www.kaggle.com/datasets/bumba5341/advertisingcsv)
* **Scope:** 200 observations measuring ad spend across **TV**, **Radio**, and **Newspaper** ($1,000s) alongside resulting product **Sales** ($1,000s units).

---

### 🔍 Key Features & Analytical Pipeline

* **Data Cleaning & Quality Audits:** Zero-variance checks, outlier detection, and data type standardization.
* **Multicollinearity Checks (VIF):** Variance Inflation Factors calculated to ensure channel effect independence.
* **Cross-Channel Synergy ($TV \times Radio$):** Statistically confirmed interaction effects revealing that Radio amplifies TV ad effectiveness ($p < 0.05$).
* **Model Benchmarking (5-Fold CV):** Comparing Linear, Ridge, Lasso, Random Forest, Gradient Boosting, and **XGBoost** ($R^2$ and RMSE optimization).
* **SHAP Explainability:** Marginal feature importance breakdowns validating channel ROI priority.
* **Interactive Web Dashboard:**
  * 📈 **Interactive Spend Simulators:** Dynamic what-if budget optimization tools.
  * 📊 **ROI & Marginal Analysis:** Channel efficiency metrics visualizing diminishing returns.
  * 🎛️ **Scenario Comparison:** Side-by-side revenue output projections based on custom channel weights.

---

### 📁 Project Structure
