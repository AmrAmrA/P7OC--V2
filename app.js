const dataArrayOriginal = [];
const dataArray = [];
const init = async () => {
  await displayInformations();
  await fillTheDom();
  // await showme();
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

async function fillTheDom() {
  const main = document.querySelector(".main__cards");
  for (const recipe of dataArray) {

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
                    ${recipe.ingredients.map((ingredient) =>`
                    <li> 
                        <span class = "ingredient__name">  ${ingredient.ingredient} </span>   
                        <span class = "ingredient_quantity"> ${ingredient.quantity ? ingredient.quantity : ""}  ${ingredient.unit ? ingredient.unit : ""} </span> 
                    </li>`)
                  .join("")}
                </ul>
                    </div>
                    </div>
                `;
  }
}
// const arrayAnswer = [
//   "Cookies", "Limonade de Coco", "Tarte au thon",
// "Mettre les glaçons à votre goût dans le blender, ajouter le lait, la crème de coco, le jus de 2 citrons et le sucre. Mixer jusqu'à avoir la consistence désirée", 
// ];
// const ultimateArray = [];
// const newArray= [];
// const arrayDescriptions = [];
// async function showme() {
//     console.log(dataArrayOriginal);
//     console.log(dataArrayOriginal.filter((el) => arrayAnswer.includes(el.name)));
//     console.log(dataArrayOriginal.filter((el) => arrayAnswer.includes(el.description)));
//     const nameSelected = dataArrayOriginal.filter((el) => arrayAnswer.includes(el.name));
//     const descriptionSelected = dataArrayOriginal.filter((el) => arrayAnswer.includes(el.description));
//     ultimateArray.push(nameSelected, descriptionSelected);
//     console.log(ultimateArray.flat());
// }




// Function to to toggle the display of the ingredients, appliances and ustensils
const magnyfiyingComponents = document.querySelectorAll(".arrow__down");
const secondRows = document.querySelectorAll(".secondRow");

magnyfiyingComponents.forEach((el) => { 
  el.addEventListener("click", (e) => {
    e.target.classList.toggle("tourner");
    const classArrow = e.target.attributes.class.ownerElement.classList[1];
    secondRows.forEach((el) => {
      const classSecondRow = el.classList[1];
      if (classArrow  === classSecondRow) {
        el.classList.toggle("display");
      }
    });
});
});



const listAppliances      = document.querySelectorAll(".list__appliances");
const listIngredients     =   document.querySelectorAll(".list__ingredients");
const listUstensils       = document.querySelectorAll(".list__ustensils");


async function spreadElements() {
  // array of appliances
  const ArraySorted = dataArray.map(el => el.appliance).sort()
  const unSet = new Set(ArraySorted)
  const entriesSet = unSet.values()
  for (const entry of entriesSet)
  {
    listAppliances[1].innerHTML += `<li class = "list__element"> ${entry} </li>`
  }


  // array of ustensils
  const ArraySorted2 = dataArray.map(el => el.ustensils).flat().sort()
  const ArraySorted3 = ArraySorted2.map((el => el.includes('(6)') ? el.replace('(6)', '') : el)) ;
  ArraySorted3.sort((a,b) => a.localeCompare(b)); 
  const unSetDeux = new Set(ArraySorted3.map((el => el.charAt(0).toUpperCase() + el.slice(1))))
  for(const entry of unSetDeux) {
    listUstensils[1].innerHTML += `<li class = "list__element"> ${entry} </li>`
  }

  // array of ingredients
  const ArraySorted4 = dataArray.map(el => el.ingredients).flat().map(el => el.ingredient).sort()
  ArraySorted4.sort((a,b) => a.localeCompare(b));
  const ArraySorted5 = ArraySorted4.map((el => el.toLowerCase()))

  console.log(ArraySorted5);
  
  const unSetTrois = new Set(ArraySorted5.map((el => el.charAt(0).toUpperCase() + el.slice(1))))
  console.log(unSetTrois);
  for (const entry of unSetTrois) {
    listIngredients[1].innerHTML += `<li class = "list__element"> ${entry} </li>`
  }
}