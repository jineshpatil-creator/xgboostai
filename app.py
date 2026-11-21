import os
import pickle
from pathlib import Path

import numpy as np
import pandas as pd
from flask import Flask, jsonify, render_template, request

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.pkl"

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024

# IMPORTANT:
# These category-to-integer mappings are assumptions until compared with
# the original training notebook. Change them if your notebook used another
# encoding. The model file does not store the original human-readable labels.
ENCODINGS = {
    "sex": {"female": 0, "male": 1},
    "smoker": {"no": 0, "yes": 1},
    "region": {
        "northeast": 0,
        "northwest": 1,
        "southeast": 2,
        "southwest": 3,
    },
}

EXPECTED_FEATURES = ["age", "sex", "bmi", "children", "smoker", "region"]

try:
    with MODEL_PATH.open("rb") as model_file:
        model = pickle.load(model_file)
except Exception as exc:
    raise RuntimeError(
        "Could not load model.pkl. Check that it was created with a compatible "
        "XGBoost version and that the file is present."
    ) from exc

feature_names = getattr(model, "feature_names_in_", None)
actual_features = list(feature_names) if feature_names is not None else []
if actual_features and actual_features != EXPECTED_FEATURES:
    raise RuntimeError(
        f"Model feature order mismatch. Expected {EXPECTED_FEATURES}, "
        f"found {actual_features}."
    )

if getattr(model, "n_features_in_", None) != len(EXPECTED_FEATURES):
    raise RuntimeError("The uploaded model does not report the expected six features.")


def parse_form(form):
    errors = {}
    try:
        age = int(form.get("age", "").strip())
        if not 0 <= age <= 120:
            errors["age"] = "Enter an age between 0 and 120."
    except (TypeError, ValueError):
        age = None
        errors["age"] = "Enter a whole-number age."

    try:
        bmi = float(form.get("bmi", "").strip())
        if not np.isfinite(bmi) or not 0 < bmi <= 100:
            errors["bmi"] = "Enter a BMI greater than 0 and no more than 100."
    except (TypeError, ValueError):
        bmi = None
        errors["bmi"] = "Enter a valid BMI number."

    try:
        children = int(form.get("children", "").strip())
        if not 0 <= children <= 20:
            errors["children"] = "Enter a whole number from 0 to 20."
    except (TypeError, ValueError):
        children = None
        errors["children"] = "Enter a whole number of children."

    sex_label = form.get("sex", "").strip().lower()
    smoker_label = form.get("smoker", "").strip().lower()
    region_label = form.get("region", "").strip().lower()

    if sex_label not in ENCODINGS["sex"]:
        errors["sex"] = "Choose a valid sex option."
    if smoker_label not in ENCODINGS["smoker"]:
        errors["smoker"] = "Choose a valid smoker option."
    if region_label not in ENCODINGS["region"]:
        errors["region"] = "Choose a valid region."

    if errors:
        return None, errors

    values = {
        "age": age,
        "sex": ENCODINGS["sex"][sex_label],
        "bmi": bmi,
        "children": children,
        "smoker": ENCODINGS["smoker"][smoker_label],
        "region": ENCODINGS["region"][region_label],
    }
    return values, {}


def predict(values):
    row = pd.DataFrame([[values[name] for name in EXPECTED_FEATURES]],
                       columns=EXPECTED_FEATURES)
    prediction = float(np.asarray(model.predict(row)).reshape(-1)[0])
    if not np.isfinite(prediction):
        raise ValueError("The model returned a non-finite prediction.")
    return max(0.0, prediction)


@app.get("/")
def index():
    return render_template("index.html", result=None, errors={})


@app.post("/predict")
def predict_route():
    values, errors = parse_form(request.form)
    if errors:
        return render_template("index.html", result=None, errors=errors,
                               submitted=request.form), 400

    try:
        estimate = predict(values)
        alternate = dict(values)
        alternate["smoker"] = 1 - values["smoker"]
        alternate_estimate = predict(alternate)

        result = {
            "estimate": estimate,
            "alternate_estimate": alternate_estimate,
            "difference": abs(estimate - alternate_estimate),
            "smoker_label": "Yes" if values["smoker"] else "No",
            "alternate_label": "No" if values["smoker"] else "Yes",
        }
        return render_template("index.html", result=result, errors={},
                               submitted=request.form)
    except Exception:
        app.logger.exception("Prediction failed")
        return render_template(
            "index.html",
            result=None,
            errors={"general": "Prediction could not be completed. Please try again."},
            submitted=request.form,
        ), 500


@app.get("/health")
def health():
    return jsonify({"status": "ok", "model": "loaded"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)
