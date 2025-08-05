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
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=chicken");
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
            `;
            resultsDiv.appendChild(mealCard);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsDiv.innerHTML = `<p>Error fetching results. Please try again later.</p>`;
    }
});