import "./App.css"; // import css file
import { useEffect, useState } from "react";
import "./BrewForm";
import BrewForm from "./BrewForm";
import "./modal.css";
import RecipeScatterPlot from "./Scatter";
export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("new-brew");
  const getRecipes = async () => {
    try {
      const response = await fetch("http://localhost:8000/recipes");

      const data = await response.json();

      setRecipes(data);
    } catch (error) {
      console.error("Failed to get recipes:", error);
    }
  };

const confirmDelete = async () => {
  if (recipeToDelete === null) return;

  try {
    const response = await fetch(
      `http://localhost:8000/recipes/${recipeToDelete}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete recipe");
    }

    // Remove it from React state
    setRecipes((prev) =>
      prev.filter((recipe) => recipe.id !== recipeToDelete)
    );

    // Close modal
    setShowDeleteModal(false);
    setRecipeToDelete(null);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <div className="app">
      <div className="tabs">
        <button
          className={`button-83 ${activeTab === "new-brew" ? "active" : ""}`}
          role="button"
          onClick={() => {
            setActiveTab("new-brew");
          }}
        >
          New Brew
        </button>

        <button
          className={`button-83 ${activeTab === "history" ? "active" : ""}`}
          role="button"
          onClick={() => {
            setActiveTab("history");
            getRecipes();
          }}
        >
          History
        </button>

        <button
          className={`button-83 ${activeTab === "analytics" ? "active" : ""}`}
          role="button"
          onClick={() => {
            setActiveTab("analytics");
            getRecipes();
          }}
        >
          Analytics
        </button>
      </div>
      
      <header className="app-header" style={{backgroundColor: "#FAF6F0"}}>
      {activeTab === "new-brew" && <BrewForm getRecipes={getRecipes}/>}
      {activeTab === "history" && (<div style={{width: "100%", overflowX: "auto"}}><table>
            <thead>
              <tr>
                <th>Date and Time</th>
                <th>Bean</th>
                <th>Dose</th>
                <th>Yield</th>
                <th>Time</th>
                <th>Temperature</th>
                <th>Grind</th>
                <th>Rating</th>
                <th>Delete Entry</th>
              </tr>
            </thead>

            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>{recipe.datetime}</td>
                  <td>{recipe.bean}</td>
                  <td>{recipe.dose_grams}g</td>
                  <td>{recipe.yield_grams}g</td>
                  <td>{recipe.time_seconds}s</td>
                  <td>{recipe.temp_setting}°C</td>
                  <td>{recipe.grind_setting}</td>
                  <td>{recipe.rating}</td>
                  <td onClick={() => {setRecipeToDelete(recipe.id); setShowDeleteModal(true)}}>X</td>
                </tr>
              ))}
            </tbody>
          </table></div>)}
      {activeTab === "analytics" && <RecipeScatterPlot recipes={recipes}/>}

      </header>
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete Recipe?</h2>

            <p>
              Are you sure you want to delete this recipe? This action cannot be
              undone.
            </p>

            <div className="modal-buttons">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRecipeToDelete(null);
                }}
              >
                Cancel
              </button>

              <button onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
