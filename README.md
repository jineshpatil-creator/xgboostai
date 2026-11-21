# CoverCast

Flask application for an informational annual medical insurance charge estimate using the supplied XGBoost regression model.

## Run locally
```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000.

## Important encoding note
The model exposes six numeric features in this order: age, sex, bmi, children, smoker, region. The readable category mappings in `app.py` are assumptions; verify them against the original training notebook before using predictions for any real decision.

This project provides educational estimates only, not an insurance quote or medical advice.
