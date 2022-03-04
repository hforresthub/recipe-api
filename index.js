const express = require('express')
const app = express()
const fs = require('fs')



app.listen(3000, () => {
	console.log('Server running on port 3000')
})

// get a list of all recipes
app.get('/recipes', (req, res, next) => {
	// first get recipe data from data.json
	const recipeData = fs.readFileSync('data.json', 'utf8')
	// then parse data into object
	const recipeObject = JSON.parse(recipeData)
	// create empty list for recipes
	const recipeList = []
	// put each recipe name from object into the list
	recipeObject.recipes.forEach((recipe) => {
		recipeList.push(recipe.name)
	})
	// send list of recipes to requester
	res.json(recipeList)
})

// get a list of all ingredients for chosen recipe
app.get('/recipes/details/:id', (req, res, next) => {
	// first get recipe data from data.json
	const recipeData = fs.readFileSync('data.json', 'utf8')
	// then parse data into object
	const recipeObject = JSON.parse(recipeData)
	// create empty list for recipes
	const chosenRecipe = recipeObject.recipes.filter((recipe) => {
		return (recipe.name === req.params.id)
	})
	let ingredientList = {}
	if (chosenRecipe.length > 0) {
		ingredientList = {
			'details': {
				'ingredients': chosenRecipe[0].ingredients,
				'numSteps': chosenRecipe[0].instructions.length
			}
		}
	}
	// send list of ingredients to requester
	res.json(ingredientList)
})