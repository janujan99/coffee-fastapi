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
    rating: ""
  });

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
    <form style={{padding: "5px"}} onSubmit={handleSubmit}>
      <h2>Log Brew</h2>

      <label style={{display: "flex", justifyContent: "space-between"}}>
        Bean
        <input
          type="text"
          name="bean"
          value={form.bean}
          onChange={handleChange}
          required
        />
      </label>
      <br></br>
      <label style={{display: "flex", justifyContent: "space-between"}}>
        Dose (g)
        <input
          type="number"
          name="dose"
          value={form.dose}
          onChange={handleChange}
          step="0.1"
          required
        />
      </label>
      <br></br>
      <label style={{display: "flex", justifyContent: "space-between"}}>
        Yield (g)
        <input
          type="number"
          name="yield"
          value={form.yield}
          onChange={handleChange}
          step="0.1"
          required
        />
      </label>
    <br></br>
      <label style={{display: "flex", justifyContent: "space-between"}}>
        Time (seconds)
        <input
          type="number"
          name="time"
          value={form.time}
          onChange={handleChange}
          step="1"
          required
        />
      </label>
<br></br>
      <label style={{display: "flex", justifyContent: "space-between"}}>
        Temperature Setting
        <input
          type="number"
          name="temperature"
          value={form.temperature}
          onChange={handleChange}
          step="0.1"
          required
        />
      </label>
<br></br>
<br></br>
      <label style={{display: "flex", justifyContent: "space-between"}}>
        Grinder Setting
        <input
          type="number"
          name="grinder"
          value={form.grinder}
          onChange={handleChange}
          step="0.1"
          required
        />
      </label>
<br></br>
      <label style={{display: "flex", justifyContent: "space-between"}}>
        Days Since Roast Date
        <input
          type="number"
          name="daysSinceRoast"
          value={form.daysSinceRoast}
          onChange={handleChange}
          step="1"
          min="0"
          required
        />
      </label>
<br></br>
      <label style={{display: "flex", justifyContent: "space-between"}}>
        Rating (1–10)
        <input
          type="number"
          name="rating"
          value={form.rating}
          onChange={handleChange}
          min="1"
          max="10"
          step="0.1"
          required
        />
      </label>
<br></br>
      <button className='logbrew' type="submit" onClick={() => props.getRecipes()}>
        Log Brew
      </button>
    </form>
  );
}

