const search = document.getElementById('search');
const submit = document.getElementById('submit');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal');


// Search Meal and fetch from API
function searchMeal(e) {
    e.preventDefault();

    // Clear Single Meal
    single_mealEl.innerHTML = '';

    //Get search Term
    const term = search.value;

    // console.log(term);

    //check for empty
    if(term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            //console.log(data);
            resultHeading.innerHTML = `<h2 class="align-item-center">Search results for '${term}':</h2>`;

            if(data.meals === null) {
                resultHeading.innerHTML = `<p>Your search didn't bring any result, try again</p>`;
            }
            else{
                mealsEl.innerHTML= data.meals.map(meal =>`
                        <div class="meal col-md-4">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                            <div class="meal-info" data-mealId="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>    
                `    
                    )
                    .join('');
            }
        });
        //Clear Search value
        search.value = '';
    }
    else{
        alert('Please enter a search value')
    }
}


//fetch meal by id
function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data =>{
        const meal = data.meals[0];
        
        addMealToDOM(meal);
    });
}

// Add meal to DOM

function addMealToDOM(meal) {
    const ingredients = [];
    for (let i = 1; i<= 20; i++) {
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }else{
            break;
        }
    }

    single_mealEl.innerHTML = `
        <div class="single-meal row">
            <div class="col-md-6">
               <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />         
            </div>
            <div class="col-md-6">
                 <h1>${meal.strMeal}</h1>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>    
    `;
    resultHeading.style.display = "none";
    mealsEl.style.display = "none";
}


//Event Listeners
submit.addEventListener('submit', searchMeal);

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if(item.classList){
            return item.classList.contains('meal-info');
        }
        else{
            return false;
        }
    });

        if(mealInfo) {
            const mealID = mealInfo.getAttribute("data-mealId");
           getMealById(mealID);
        }
})

