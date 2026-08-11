# 💰 Sales Prediction Using Advertising Spend

**CodeAlpha Data Science Internship — Task 4: Sales Prediction using Python**

An advanced regression project predicting product sales from TV, Radio, and Newspaper advertising spend —
with statistical significance testing, cross-validated model comparison, SHAP explainability, and a
practical marketing budget what-if simulator.

## 📁 Project Structure
```
.
├── Sales_Prediction_Advertising.ipynb   # Main analysis notebook (fully executed)
├── data/
│   └── Advertising.csv                  # Raw dataset
├── requirements.txt
└── README.md
```

## 📦 Dataset
[Advertising.csv — Kaggle](https://www.kaggle.com/datasets/bumba5341/advertisingcsv)
200 observations of TV, Radio, and Newspaper ad spend (thousands of $) and resulting Sales (thousands of units).

## ⚙️ Setup
```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
jupyter lab Sales_Prediction_Advertising.ipynb
```

## 🔍 What's Inside

1. **Data Cleaning & Quality Checks**
2. **Exploratory Data Analysis** — per-channel relationships, correlation matrix, 3D interactive scatter
3. **Multicollinearity Check (VIF)** — validating that channel effects can be separated cleanly
4. **OLS Regression with Significance Testing** — p-values and confidence intervals per channel
5. **Cross-Channel Interaction Effect** — statistically testing (and confirming) TV × Radio synergy
6. **Model Comparison** — Linear, Ridge, Lasso, Random Forest, Gradient Boosting, XGBoost, validated with 5-fold CV
7. **Residual Diagnostics** — confirming the best model's errors are well-behaved
8. **SHAP Explainability** — why the model predicts what it predicts, not just how accurate it is
9. **Marginal ROI Analysis** — diminishing-returns curves per channel
10. **What-If Budget Simulator** — compare custom spend allocation scenarios
11. **Business Recommendations & Limitations**

## 🚀 How to Reproduce
1. Download `Advertising.csv` from the Kaggle link above (already included in `data/`).
2. Run all cells top-to-bottom in Jupyter Lab/Notebook.

## 🛠 Tech Stack
`pandas` · `numpy` · `matplotlib` · `seaborn` · `plotly` · `statsmodels` · `scikit-learn` · `xgboost` · `shap`

---
Built for the **CodeAlpha Data Science Internship**. Remember to also: post your project video on LinkedIn
tagging @CodeAlpha, upload the repo as `CodeAlpha_SalesPrediction`, and submit via the internship
submission form.
