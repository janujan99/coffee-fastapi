import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { useState } from "react";
function linearRegression(x, y) {
  const n = x.length;

  const meanX = x.reduce((sum, value) => sum + value, 0) / n;
  const meanY = y.reduce((sum, value) => sum + value, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (y[i] - meanY);
    denominator += (x[i] - meanX) ** 2;
  }

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  return { slope, intercept };
}
function calculateCorrelation(data) {
  const x = [];
  const y = [];
  for (let i = 0; i < data.length; i++){
    x.push(data[i].x);
    y.push(data[i].y);
  }
  const n = x.length;

  const meanX = x.reduce((sum, value) => sum + value, 0) / n;
  const meanY = y.reduce((sum, value) => sum + value, 0) / n;

  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - meanX;
    const yDiff = y[i] - meanY;

    numerator += xDiff * yDiff;
    denominatorX += xDiff ** 2;
    denominatorY += yDiff ** 2;
  }

  return numerator / Math.sqrt(denominatorX * denominatorY);
}

export default function RecipeScatterPlot({ recipes }) {
  const variables = {
  "dose_grams": "Dose (g)",
  "yield_grams": "Yield (g)",
  "time_seconds": "Brew Time (s)",
  "temp_setting": "Temperature (°C)",
  "grind_setting": "Grind Setting",
  "rating": "Rating",
};
  const [xVariable, setXVariable] = useState("dose_grams");
  const [yVariable, setYVariable] = useState("rating");
  const data = recipes.map((recipe) => ({
    x: recipe[xVariable],
    y: recipe[yVariable],
  }));
  
  console.log(data);
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <select name="x_axis" value={xVariable} onChange={(e) => setXVariable(e.target.value)} style={{ width: "100px", height: "30px" }}>
        <option value="dose_grams">Dose</option>
        <option value="yield_grams">Yield</option>
        <option value="time_seconds">Brew Time</option>
        <option value="temp_setting">Temperature</option>
        <option value="grind_setting">Grind Setting</option>
        <option value="days_since_roastdate">Days Since Roast</option>
        <option value="rating">Rating</option>
      </select>
      <h3 style={{paddingLeft: "10px", paddingRight: "10px"}}> vs </h3>
      <select name="y_axis" value={yVariable} onChange={(e) => setYVariable(e.target.value)} style={{ width: "100px", height: "30px" }}>
        <option value="rating">Rating</option>
        <option value="dose_grams">Dose</option>
        <option value="yield_grams">Yield</option>
        <option value="time_seconds">Brew Time</option>
        <option value="temp_setting">Temperature</option>
        <option value="grind_setting">Grind Setting</option>
        <option value="days_since_roastdate">Days Since Roast</option>
      </select>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid />

          <XAxis type="number" dataKey="x" name="Dose" unit="g">
            <Label value={variables[xVariable]} position="insideBottom" offset={-5} />
          </XAxis>
          <YAxis type="number" dataKey="y" name="Rating">
            <Label value={variables[yVariable]} angle={-90} position="insideLeft" />
          </YAxis>

          <Tooltip cursor={{ strokeDasharray: "3 3" }} />

          <Scatter name="Recipes" data={data} />
        </ScatterChart>
      </ResponsiveContainer>
      <h4>R: {calculateCorrelation(data)}</h4>
    </div>
  );
}
