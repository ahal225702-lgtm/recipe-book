
import { useState, useEffect } from 'react';
import API from './api';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [editingId, setEditingId] = useState(null);
const [editTitle, setEditTitle] = useState('');
const [editIngredients, setEditIngredients] = useState('');
const [editInstructions, setEditInstructions] = useState('');

  const fetchRecipes = async () => {
    try {
      const response = await API.get('/');
      setRecipes(response.data);
      setError('');
    } catch (err) {
      setError('Could not load recipes. Check backend connection.');
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);
const startEdit = (recipe) => {
  setEditingId(recipe._id);
  setEditTitle(recipe.title);
  setEditIngredients(recipe.ingredients);
  setEditInstructions(recipe.instructions);
};

const cancelEdit = () => {
  setEditingId(null);
  setEditTitle('');
  setEditIngredients('');
  setEditInstructions('');
};

const saveEdit = async (e) => {
  e.preventDefault();

  try {
    await API.put('/' + editingId, {
      title: editTitle,
      ingredients: editIngredients,
      instructions: editInstructions,
    });

    cancelEdit();
    fetchRecipes();
  } catch (err) {
    setError('Failed to update recipe.');
  }
};
  const addRecipe = async (e) => {
    e.preventDefault();

    try {
      await API.post('/', { title, ingredients, instructions });
      setTitle('');
      setIngredients('');
      setInstructions('');
      setError('');
      fetchRecipes();
    } catch (err) {
      setError('Failed to add recipe. Please try again.');
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await API.delete('/' + id);
      fetchRecipes();
    } catch (err) {
      setError('Failed to delete recipe.');
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🍲 Recipe Book</h1>
        <p>Discover and save your favourite recipes!</p>
      </header>

      <main>
        <section className="form-section">
          <h2>Add New Recipe</h2>
          <form onSubmit={addRecipe}>
            <input
              placeholder="Recipe title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
            <textarea
              placeholder="Instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
            <button type="submit">Add Recipe</button>
          </form>
        </section>

        <section className="recipes-section">
          <h2>My Recipes ({recipes.length})</h2>
          <input
  type="text"
  placeholder="Search recipes..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

          {error && <p>{error}</p>}

          {recipes.length === 0 ? (
            <p>No recipes yet. Add your first recipe!</p>
          ) : (
            <div className="recipe-list">
              {recipes
  .filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  )
  .map((recipe) => (
                <article className="recipe-card" key={recipe._id}>
                  <h3>{recipe.title}</h3>
                  {editingId === recipe._id ? (
  <form onSubmit={saveEdit}>
    <input
      placeholder="Recipe title"
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
      required
    />
    <textarea
      placeholder="Ingredients"
      value={editIngredients}
      onChange={(e) => setEditIngredients(e.target.value)}
      required
    />
    <textarea
      placeholder="Instructions"
      value={editInstructions}
      onChange={(e) => setEditInstructions(e.target.value)}
      required
    />
    <button type="submit">Save Changes</button>
    <button type="button" onClick={cancelEdit}>Cancel</button>
  </form>
) : (
  <>
    <button onClick={() => startEdit(recipe)}>Edit</button>
  </>
)}
                  {editingId !== recipe._id && (
  <>
    <h4>Ingredients</h4>
    <p>{recipe.ingredients}</p>
    <h4>Instructions</h4>
    <p>{recipe.instructions}</p>
  </>
)}
                  <button onClick={() => deleteRecipe(recipe._id)}>
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
