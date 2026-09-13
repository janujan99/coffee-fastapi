import { useState } from "react";
import axios from "axios";

export default function BrewForm(props) {
  const [form, setForm] = useState({
    bean: "",
    dose: "",
    yield: "",
    time: "",
    temperature: "",
    grinder: "",
    daysSinceRoast: "",
    rating: "",
  });
  const [ratingValue, setRatingValue] = useState(8.5);

  const handleRatingChange = (event) => {
    const nextValue = Number(event.target.value);
    setForm((prev) => ({
      ...prev,
      rating: String(nextValue),
    }));
    setRatingValue(nextValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const dateString = now.toLocaleString();

    console.log({
      user_name: "janujan9954",
      datetime: dateString,
      bean: form.bean,
      dose_grams: Number(form.dose),
      yield_grams: Number(form.yield),
      time_seconds: Number(form.time),
      temp_setting: Number(form.temperature),
      grind_setting: Number(form.grinder),
      daysSinceRoast: Number(form.daysSinceRoast),
      rating: Number(form.rating),
    });

    await axios.post("http://localhost:8000/recipes", {
      user_name: "janujan9954",
      datetime: dateString,
      bean: form.bean,
      dose_grams: Number(form.dose),
      yield_grams: Number(form.yield),
      time_seconds: Number(form.time),
      temp_setting: Number(form.temperature),
      grind_setting: Number(form.grinder),
      days_since_roastdate: Number(form.daysSinceRoast),
      rating: Number(form.rating),
    });
  };

  return (
    <form className="brew-form" onSubmit={handleSubmit}>
      <div className="brew-header">
        <div className="brew-badge">
          <span className="brew-badge-icon">☕</span>
          <span>ESPRESSO DIALING</span>
        </div>
        <h1>Log Brew</h1>
        <p>Capture parameter nuances to refine your cup</p>
      </div>

      <div className="form-panel">
        <div className="panel-header">
          <div className="panel-title">
            <span className="panel-icon">◯</span>
            <span>Bean &amp; Provenance</span>
          </div>
          <span className="panel-tag">PRIMARY</span>
        </div>

        <input
          className="text-input text-input-wide"
          type="text"
          name="bean"
          value={form.bean}
          onChange={handleChange}
          placeholder="e.g. Ethiopia Guji Natural (Sey Coffee)"
          required
        />

        <div className="field-grid two-up">
          <div className="field-box">
            <label>Days Since Roast</label>
            <input
              className="text-input"
              type="number"
              name="daysSinceRoast"
              value={form.daysSinceRoast}
              onChange={handleChange}
              placeholder="14"
              step="1"
              min="0"
              required
            />
          </div>

          <div className="field-box">
            <label>Grinder Setting</label>
            <input
              className="text-input"
              type="number"
              name="grinder"
              value={form.grinder}
              onChange={handleChange}
              placeholder="e.g. 14.5 (Niche)"
              step="0.1"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-panel">
        <div className="panel-header">
          <div className="panel-title">
            <span className="panel-icon">◔</span>
            <span>Extraction Dynamics</span>
          </div>
          <span className="panel-tag ratio">Ratio 1:2.0</span>
        </div>

        <div className="field-grid two-up">
          <div className="field-box">
            <label>Dose (g)</label>
            <input
              className="text-input"
              type="number"
              name="dose"
              value={form.dose}
              onChange={handleChange}
              placeholder="18.0"
              step="0.1"
              required
            />
          </div>

          <div className="field-box">
            <label>Yield (g)</label>
            <input
              className="text-input"
              type="number"
              name="yield"
              value={form.yield}
              onChange={handleChange}
              placeholder="36.0"
              step="0.1"
              required
            />
          </div>

          <div className="field-box">
            <label>Time (seconds)</label>
            <input
              className="text-input"
              type="number"
              name="time"
              value={form.time}
              onChange={handleChange}
              placeholder="28"
              step="1"
              required
            />
          </div>

          <div className="field-box">
            <label>Temperature (°C)</label>
            <input
              className="text-input"
              type="number"
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              placeholder="93.5"
              step="0.1"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-panel rating-panel">
        <div className="panel-header rating-header">
          <div className="panel-title">
            <span className="panel-icon star">★</span>
            <span>Cup Rating (1–10)</span>
          </div>
          <span className="panel-tag rating-value">{Number(ratingValue).toFixed(1)}/10</span>
        </div>

        <div className="slider-wrap">
          <input
            className="rating-slider"
            id="discrete-slider"
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={ratingValue}
            onChange={handleRatingChange}
            required
          />
        </div>

        <div className="rating-scale">
          <span>1 (Under/Channel)</span>
          <span>5 (Balanced)</span>
          <span>10 (God Shot)</span>
        </div>

        <div className="rating-values">
          <span>6.0</span>
          <span>7.0</span>
          <span>8.0</span>
          <span className="selected">8.5</span>
          <span>9.0</span>
          <span>9.5</span>
          <span>10</span>
        </div>
      </div>

      <button className="logbrew" type="submit" onClick={() => props.getRecipes()}>
        <span className="button-icon">☕</span>
        Log Brew
      </button>
    </form>
  );
}
