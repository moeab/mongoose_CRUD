var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose_dashboard');

var animalSchema = new mongoose.Schema({
	name : String,
	venomous : String
})

var Snake = mongoose.model('Animal', animalSchema);

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended : true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	var snake_list = [];
	Snake.find({}, function(err, snakes){
		if(err){
			res.render('index', {err_succ : 'Something went wrong'});
		} else {
			for (var i = 0; i < snakes.length; i++){
				snake_list.push({name : snakes[i].name ,venomous : snakes[i].venomous ,id : snakes[i]._id});
			}
			res.render('index', {snakes : snake_list});
		}
	})
})

app.get('/snake/new', function(req, res){
	res.render('new');
})

animalSchema.path('name').required(true);
animalSchema.path('venomous').required(true);

app.post('/snakes', function(req, res){
	var snake = new Snake({name : req.body.name, venomous : req.body.venom});
	snake.save(function(err){
		if(err){
			res.render('new',  {err : 'Please enter snake name'});
		} else {
			res.redirect('/');
		}
	})
})

app.get('/snake/:id/edit', function(req, res){
	Snake.findOne({_id : req.params.id}, function(err, snake){
		res.render('edit', {snake : snake});
	})
})

app.post('/snake/:id', function(req, res){
	Snake.update({_id : req.params.id}, {name : req.body.name , venomous : req.body.venom }, function(err, snake){
		res.redirect('/');
	})
})

app.post('/snake/:id/destroy', function(req, res){
	Snake.remove({_id : req.params.id}, function(err, snake){
		res.redirect('/');
	})
})


app.listen(6896, function(){
	console.log('listening on port 6896');
})