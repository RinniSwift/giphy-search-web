var express = require('express');
var app = express();
var exphbs = require('express-handlebars');

// require the http module
var http = require('http');

// initialize the giphy api library
var giphy = require('giphy-api')();


app.engine('handlebars', exphbs({defaultLayout: 'main'}) );
app.set('view engine', 'handlebars');

// static files will be in the public folder
app.use(express.static('public'));

app.get('/hello-world', function (req, res) {
	res.send('Hello World');
});

app.get('/hello-gif', function(req, res) {
	var gifUrl = 'http://media2.giphy.com/media/gYBVM1igrlzH2/giphy.gif'
	res.render('hello-gif', {gifUrl: gifUrl})
})

// app.get('/', function(req, res) {
// 	giphy.search(req.query.term, function (err, response) {
// 		res.render('home', {gifs: response.data})
// 	});
// });


app.get('/', function (req, res) {
	console.log(req.query.term)
	var queryString = req.query.term;
	// remove white spaces and restricted characters
	var term = encodeURIComponent(queryString);
	// put search term into giphy API search url
	var url = 'http://api.giphy.com/v1/gifs/search?q=' + term + '&api_key=dc6zaTOxFJmzC'

	http.get(url, function(response) {
		// set encoding of response to utf8
		response.setEncoding('utf8');

		var body = '';

		response.on('data', function(d) {
			// continuely update stream with data from giphy 
			body += d;
		});

		response.on('end', function() {
			// when data is fully received, parse into JSON
			var parsed = JSON.parse(body);
			// render the home template and pass the gif data into the template
			res.render('home', {gifs: parsed.data})
		});

	});

})

app.listen(3000, function () {
  console.log('Gif Search listening on port localhost:3000!');
})