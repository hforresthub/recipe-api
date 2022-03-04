const axios = require('axios')

axios.post('http://localhost:3000/recipes/', {
	"name": "butteredBagel",
	"ingredients": [
		"1 bagel",
		"butter"
	],
	"instructions": [
		"cut the bagel",
		"spread butter on bagel"
	]
})