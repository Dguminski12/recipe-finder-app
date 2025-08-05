const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    //Clear previous results
    resultsDiv.innerHTML = '';

    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + input.value);
        const data = await response.json();
    
    //Check for results
        if (!data.meals) {
            resultsDiv.innerHTML = `<p>No results found for "${query}".</p>`;
            return;
        }

    //Show Results
        resultsDiv.innerHTML = "";
        data.meals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.className = 'meal-card';
            mealCard.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p><a href="${meal.strSource || meal.strYoutube}" target="_blank">View Recipe</a></p>
            <button class="fav-btn" data-id="${meal.idMeal}">Add to Favorites</button>
            `;
            resultsDiv.appendChild(mealCard);
        });
        //Add event listeners to favorite buttons
        document.querySelectorAll('.fav-btn').forEach(button => {
            button.addEventListener('click', () => {
                const mealId = button.getAttribute('data-id');
                const meal = data.meals.find(m => m.idMeal === mealId);

                saveToFavourites(meal);
                button.textContent = 'Added to Favorites';
            });
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsDiv.innerHTML = `<p>Error fetching results. Please try again later.</p>`;
    }
});


//Function to add a meal to favorites
function saveToFavourites(meal) {
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

    //Avoiding duplicates
    if (favourites.some(fav => fav.idMeal === meal.idMeal)) return;

    favourites.push(meal);
    localStorage.setItem("favourites", JSON.stringify(favourites));
};

//Function to remove a meal from favorites
function removeFromFavourites(mealId) {
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    favourites = favourites.filter(meal => meal.idMeal !== mealId);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    //Refresh the favorites view
    viewFavsButton.click();
};

const viewFavsButton = document.getElementById('view-favs-btn');

viewFavsButton.addEventListener('click', () => {
    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];

    if (favourites.length === 0) {
        resultsDiv.innerHTML = '<p>No favorites found.</p>';
        return;
    };

    resultsDiv.innerHTML = '';
    favourites.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = "meal-card";
        mealCard.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p><a href="${meal.strSource || meal.strYoutube}" target="_blank">View Recipe</a></p>
            <button class="remove-btn" data-id="${meal.idMeal}">Remove from Favorites</button>
        `;
        resultsDiv.appendChild(mealCard);
    });
    //Add remove functionality for favorites
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", () => {
            const mealId = button.getAttribute("data-id");
            removeFromFavourites(mealId);
            button.textContent = 'Removed from Favorites';
            console.log(mealId)
        });
    });   
});

