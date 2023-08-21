const dataArrayOriginal = [];
let   dataArray = [];
const init = async () => {
  await displayInformations();
  await fillTheDom();
  await spreadElements();
};
init();

// Function to call the API asynchronously
async function displayInformations() {
  const response = await fetch("recipes.js");

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json();
  data.recipes.forEach((el) => {
    dataArrayOriginal.push(el);
    dataArray.push(el);
  });

  //   dataArray
  return data;
}
// Fill the DOM with the data from the API
// there are cards with the recipes, the time, the name, the description, the ingredients...etc
async function fillTheDom() {
  const main = document.querySelector(".main__cards");
  for (const recipe of dataArray) {
    const article = document.createElement("article");
    article.classList.add("recipe__card");
    main.appendChild(article);
    article.innerHTML = `
            <div class = "time__place"><p class = 'recipe__time'> ${recipe.time} min </p></div>
            <img src="photosRecettes/${recipe.image}" class="recipe__image" alt="flèche vers le bas">
                <div class = 'recipe__body'> 
                <h1 class = "recipe__title"> ${recipe.name} </h1>
                <p class = "texte__recette"> Recette </p>
                <p class = "recipe__description">${recipe.description}</p>
                <p class = "texte__recette"> Ingrédients </p>
                <ul class = "recipe__preparation">
                    ${recipe.ingredients
                      .map((ingredient) => `
                      <li> 
                        <span class = "ingredient__name">  ${ingredient.ingredient} </span>   
                        <span class = "ingredient_quantity"> ${ingredient.quantity ? ingredient.quantity : ""}  ${ingredient.unit ? ingredient.unit : ""} </span> 
                    </li>`
                      ).join("")}
                </ul>
                    </div>
                    </div>`;}}

// Function to to toggle the display of the ingredients, appliances and ustensils
const magnyfiyingComponents = document.querySelectorAll(".arrow__down");
const secondRows = document.querySelectorAll(".secondRow");

magnyfiyingComponents.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.target.classList.toggle("tourner");
    const classArrow = e.target.attributes.class.ownerElement.classList[1];
    secondRows.forEach((el) => {
      const classSecondRow = el.classList[1];
      if (classArrow === classSecondRow) {
        el.classList.toggle("display");
      }
    });
  });
});

const listAppliances = document.querySelectorAll(".list__appliances");
const listIngredients = document.querySelectorAll(".list__ingredients");
const listUstensils = document.querySelectorAll(".list__ustensils");
// Function to fill the lists of ingredients, appliances and ustensils
// We had to sort them, flat them, and put them in a set to avoid duplicates
async function spreadElements() {
  // array of appliances
  const ArraySorted = dataArray.map((el) => el.appliance).sort();
  const unSet = new Set(ArraySorted);
  const entriesSet = unSet.values();
  for (const entry of entriesSet) {
    listAppliances[1].innerHTML += `<li class = "list__element"> ${entry} </li>`;
  }
  // array of ustensils
  const ArraySorted2 = dataArray
    .map((el) => el.ustensils).flat().sort();
  const ArraySorted3 = ArraySorted2.map((el) =>
    el.includes("(6)") ? el.replace("(6)", "") : el
  );
  ArraySorted3.sort((a, b) => a.localeCompare(b));
  const unSetDeux = new Set(
    ArraySorted3.map((el) => el.charAt(0).toUpperCase() + el.slice(1))
  );
  for (const entry of unSetDeux) {
    listUstensils[1].innerHTML += `<li class = "list__element"> ${entry} </li>`;
  }
  // array of ingredients
  const ArraySorted4 = dataArray
    .map((el) => el.ingredients).flat().map((el) => el.ingredient).sort();
  ArraySorted4.sort((a, b) => a.localeCompare(b));
  const ArraySorted5 = ArraySorted4.map((el) => el.toLowerCase());

  const unSetTrois = new Set(
    ArraySorted5.map((el) => el.charAt(0).toUpperCase() + el.slice(1))
  );

  for (const entry of unSetTrois) {
    listIngredients[1].innerHTML += `<li class = "list__element"> ${entry} </li>`;
  }
}

let globalArray = [];
let errorMessage = document.querySelector(".error__message");
let errorBackground = document.querySelector(".error__background");
const searchInput = document.querySelector(".searchInput");
// Event listener on the search bar when the user types something 
// We filter the data array to find the recipes that match the user's input
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase().trim();
  globalArray = [...dataArray.filter((el) => el.name.toLowerCase().trim().includes(value)),
    ...dataArray.filter((el) =>el.ingredients.map((el) => el.ingredient.toLowerCase().trim()).includes(value)),
    ...dataArray.filter((el) =>el.description.toLowerCase().trim().includes(value))];
  conditionnalLists(value);
});


// Conditionnal function when the user types something in the search bar
// We handle an error message if the user types something that doesn't match any recipe
const main = document.querySelector(".main__cards");
function conditionnalLists(value) {
  if (value.length >= 3 && globalArray.length > 0) {
    errorBackground.style = "display: none";
    updateDomBarSearch(globalArray);
    updateThreeLists(globalArray);
  } else if (value.length == 0) {
    errorBackground.style = "display: none";
    main.innerHTML = "";
    fillTheDom();
    updateWithBadges(globalArray)
    numberOfRecipesGlobal();
    updateThreeLists(globalArray);
    console.log(dataArray);
  } else if (value.length >= 3 && globalArray.length == 0) {
    errorBackground.style = "display: block";
    errorMessage.textContent = `Aucune recette ne contient "${value}" vous pouvez chercher «
    tarte aux pommes », « poisson », etc`;
    updateDomBarSearch(globalArray);
    updateThreeLists(globalArray);
  }
}
// Function to fill the number of recipes on the right of the page
function numberOfRecipesGlobal() {
  const numberRecipeOutside = document.querySelector(".numberRecipesOutside");
  const numberRecipesInside = document.querySelector(".numberRecipesInside");
  numberRecipeOutside.textContent = `1500 recettes`;
  numberRecipesInside.textContent = `1500 recettes`;
}


const numberRecipesInside = document.querySelector(".numberRecipesInside");
const numberRecipeOutside = document.querySelector(".numberRecipesOutside");
function updateDomBarSearch(globalArray) {
  const globalArrayNewSet = new Set(globalArray);
  numberRecipeOutside.textContent = `${globalArrayNewSet.size} recettes`;
  numberRecipesInside.textContent = `${globalArrayNewSet.size} recettes`;
  const main = document.querySelector(".main__cards");
  main.innerHTML = "";
  for (const recipe of globalArrayNewSet) {
    const article = document.createElement("article");
    article.classList.add("recipe__card");
    main.appendChild(article);
    article.innerHTML = `
            <div class = "time__place">
                <p class = 'recipe__time'> ${recipe.time} min </p>
            </div>
            <img src="photosRecettes/${
              recipe.image
            }" class="recipe__image" alt="flèche vers le bas">
                <div class = 'recipe__body'> 
                <h1 class = "recipe__title"> ${recipe.name} </h1>
                <p class = "texte__recette"> Recette </p>
                <p class = "recipe__description">${recipe.description}</p>
                <p class = "texte__recette"> Ingrédients </p>
                <ul class = "recipe__preparation">
                    ${recipe.ingredients
                      .map(
                        (ingredient) => `
                    <li> 
                        <span class = "ingredient__name">  ${
                          ingredient.ingredient
                        } </span>   
                        <span class = "ingredient_quantity"> ${
                          ingredient.quantity ? ingredient.quantity : ""
                        }  ${ingredient.unit ? ingredient.unit : ""} </span> 
                    </li>`
                      )
                      .join("")}
                </ul>
                    </div>
                    </div>
                `;
  }
}


// Update the three lists dynamically
// when the user types something in the search bar
function updateThreeLists(globalArray) {
  // Filter Ingredients and update them dynamically
  const filterIngrdients = [...new Set(globalArray)];
  const filterIngrdientsTwo = [...filterIngrdients.map((el) =>el.ingredients.flat().map((el) => el.ingredient).sort().flat()),];
  const filterIngrdientsThree = [...new Set(filterIngrdientsTwo.flat().sort((a, b) => a.localeCompare(b))),];
  listIngredients[1].innerHTML = "";
  for (const ingredient of filterIngrdientsThree) {listIngredients[1].innerHTML += `<li class = "list__element"> ${ingredient} </li>`;}
  // Filter Appliances and update them dynamically
  const filterAppliances = [...new Set(globalArray)];
  const filterAppliancesTwo = [...filterAppliances.map((el) => el.appliance)];
  const filterAppliancesThree = [...new Set(filterAppliancesTwo.flat().sort((a, b) => a.localeCompare(b))),];
  listAppliances[1].innerHTML = ""; 
  for (const appliance of filterAppliancesThree) {listAppliances[1].innerHTML += `<li class = "list__element"> ${appliance} </li>`;}
  // Filter Ustensils and update them dynamically
  const filterUstensils = [...new Set(globalArray)];
  const filterUstensilsTwo = [...filterUstensils.map((el) => el.ustensils.flat()),];
  const filterUstensilsThree = filterUstensilsTwo.flat().map((el) => el.charAt(0).toUpperCase() + el.slice(1));
  const filterUstensilsFour = [...new Set(filterUstensilsThree.flat().sort((a, b) => a.localeCompare(b))),];
  listUstensils[1].innerHTML = "";
  for (const ustensil of filterUstensilsFour) {listUstensils[1].innerHTML += `<li class = "list__element"> ${ustensil} </li>`;}

  updateWithBadges(dataArray);
}

const mainHeader = document.querySelector(".main__header");
const badges     = document.querySelector(".badges");



function updateWithBadges (globalArray) {
  const listElements = document.querySelectorAll(".list__element");
  for (const listElement of listElements) {
    listElement.addEventListener("click", () => {
      listElement.style.pointerEvents = "none";
      const value = listElement.textContent.toLowerCase().trim();
    globalArray = [
    ...globalArray.filter(el => el.ingredients.map((el) => el.ingredient.toLowerCase()).includes( value)), 
    ...globalArray.filter(el => el.appliance.toLowerCase().trim().includes(value)), 
    ...globalArray.filter(el => el.ustensils.map((el) => el.toLowerCase()).includes(value)) ]
      console.log(globalArray);
      generateBadges(value);
      updateDomBarSearch(globalArray);
      updateThreeLists(globalArray);
  })}
}





function generateBadges (value) {
  const badgeSelected = `<div class = "badge__selected"> <div class = "wrapper__elements"> <p class = "paragraph__selected"> ${value} </p> <img src = "assets/cancelBadge.png" alt = "cancel badge" class = "image__selected"> </div> </div>`;
  badges.innerHTML += badgeSelected;
}