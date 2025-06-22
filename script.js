const form = document.getElementById("recipeForm");
const recipeList = document.getElementById("recipeList");
let editIndex = -1;

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const ingredients = document.getElementById("ingredients").value;
  const steps = document.getElementById("steps").value;
  const category = document.getElementById("category").value;
  const imageFile = document.getElementById("image").files[0];

  if (imageFile) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const image = reader.result;
      const recipe = { title, ingredients, steps, image, category };
      saveRecipe(recipe);
      displayRecipes();
      form.reset();
      document.querySelector("button[type='submit']").textContent = "Add Recipe";
    };
    reader.readAsDataURL(imageFile);
  } else {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const currentImage = (editIndex > -1 && recipes[editIndex]?.image) || null;
    const recipe = { title, ingredients, steps, image: currentImage, category };
    saveRecipe(recipe);
    displayRecipes();
    form.reset();
    document.querySelector("button[type='submit']").textContent = "Add Recipe";
  }
});

function saveRecipe(recipe) {
  let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  if (editIndex > -1) {
    recipes[editIndex] = recipe;
    editIndex = -1;
  } else {
    recipes.push(recipe);
  }
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

function deleteRecipe(index) {
  let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  recipes.splice(index, 1);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  displayRecipes();
}

function editRecipe(index) {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const recipe = recipes[index];
  document.getElementById("title").value = recipe.title;
  document.getElementById("ingredients").value = recipe.ingredients;
  document.getElementById("steps").value = recipe.steps;
  document.getElementById("category").value = recipe.category || "";
  editIndex = index;
  document.querySelector("button[type='submit']").textContent = "Update Recipe";
}

function displayRecipes() {
  recipeList.innerHTML = "";
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  recipes.forEach((recipe, index) => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <h3>${recipe.title}</h3>
      ${recipe.image ? `<img src="${recipe.image}" alt="Recipe Image" class="recipe-image">` : ""}
      <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
      <p><strong>Steps:</strong> ${recipe.steps}</p>
      <p><strong>Category:</strong> ${recipe.category || "Uncategorized"}</p>
      <button class="delete-btn" onclick="deleteRecipe(${index})">Delete</button>
      <button onclick="editRecipe(${index})">Edit</button>
    `;
    recipeList.appendChild(card);
  });
}

document.getElementById("searchBox").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const cards = document.querySelectorAll(".recipe-card");

  cards.forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(query) ? "block" : "none";
  });
});

document.getElementById("toggleTheme").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
});

document.getElementById("exportBtn").addEventListener("click", function () {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const blob = new Blob([JSON.stringify(recipes, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "recipes.json";
  link.click();
});

window.onload = displayRecipes;
