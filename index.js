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
	// create list of the 1 item matching the query, if it exists
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

// post request to add a recipe
app.use(
	express.urlencoded({
		extended: true
	})
)
app.use(express.json())
app.post('/recipes', (req, res) => {
	// first get recipe data from data.json
	const recipeData = fs.readFileSync('data.json', 'utf8')
	// then parse data into object
	const recipeObject = JSON.parse(recipeData)
	// create list of the 1 item matching the query, if it exists
	const chosenRecipe = recipeObject.recipes.filter((recipe) => {
		return (recipe.name === req.body.name)
	})
	if (chosenRecipe.length > 0) {
		res.status(400).send('{"error": "Recipe already exists}')
	} else {
		recipeObject.recipes.push(req.body)
		fs.writeFile('./data.json', JSON.stringify(recipeObject), err => {
			if (err) {
				console.error(err)
				res.json(err)
				return
			}
			res.status(201).send('big success')
		})
	}
})

app.put('/recipes', (req, res) => {
	// first get recipe data from data.json
	const recipeData = fs.readFileSync('data.json', 'utf8')
	// then parse data into object
	const recipeObject = JSON.parse(recipeData)
	let indexOfEdit = -1
	// create list of the 1 item matching the query, if it exists
	const chosenRecipe = recipeObject.recipes.filter((recipe, index) => {
		indexOfEdit = index
		return (recipe.name === req.body.name)
	})
	if (chosenRecipe.length === 0) {
		res.status(404).send('{"error": "Recipe does not exist"}')
	} else {
		recipeObject.recipes.splice(indexOfEdit, 1, req.body)
		fs.writeFile('./data.json', JSON.stringify(recipeObject), err => {
			if (err) {
				console.error(err)
				res.json(err)
				return
			}
			res.status(204).send('big success')
		})
	}
})