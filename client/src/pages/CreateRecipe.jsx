import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateRecipe.css";

export default function CreateRecipe() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    categories: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          ingredients: form.ingredients.split(","),
          categories: form.categories.split(",")
        })
      });

      if (res.ok) {
        navigate("/recipes");
      } else {
        console.error("Failed to upload recipe");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="cr-page">
      <form className="cr-form" onSubmit={handleSubmit}>
        <h2>🍽️ Share a Recipe</h2>

        <input
          name="title"
          placeholder="Recipe Title"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Short Description"
          onChange={handleChange}
          required
        />

        <textarea
          name="ingredients"
          placeholder="Ingredients (comma separated)"
          onChange={handleChange}
          required
        />

        <textarea
          name="instructions"
          placeholder="Instructions"
          onChange={handleChange}
          required
        />

        <input
          name="categories"
          placeholder="Categories (comma separated)"
          onChange={handleChange}
        />

        <button type="submit">Upload Recipe</button>
      </form>
    </div>
  );
}