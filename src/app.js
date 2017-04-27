'use strict';

var express = require('express'),
	  posts = require('./mock/posts.json');

var postsLists = Object.keys(posts).map(function(value) {
							         return posts[value]})

var app = express();

//define our static server for our static files
//configuring our static files
app.use('/static', express.static(__dirname + '/public'))

//let's tell express how to render our jade template
//first we should set up our view engine to jade
app.set('view engine', 'jade');
//and then define views parameter which takes a folder path with our tempates
//here we use a tick by invoking the __dirname varible
//this is important since we're staring the server from different dirrectory
// from the root of our project
// in many cases node dirrectories're going to be relative to the node process not the file you're working within
// we start node process one directory up using the nodemon command
//with the path to the app.js file     like this:    nodemon src/app.js
app.set('views', __dirname + '/templates');

//to create route we use method app.get
app.get('/', function(req, res){
	var path = req.path;
    //doing this: 'res.locals.path = path' is exactly the same as doing this: 'res.render('index', {path: path});'
    //this is just another way to provide variables to our template
    //in others routes the PATH variable will be undefined so they will have only BLOG in their NAV section
	res.locals.path = path;
	res.render('index');
});

app.get('/blog/:title?', function(req, res){ 
	var title = req.params.title;
	if (title === undefined) {
		res.status(503);
		res.render('blog', {posts: postsLists})
	} else {
		var post = posts[title] || {title: 'The page not found'};
		res.render('post', { post: post});
	}
});

app.get('/posts', function(req, res) {
	if (req.query.raw) {
		res.json(posts);
	} else {
		res.json(postsLists);
	}
})

app.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});
