//Express
var express = require('express');
var app = express();

//body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
//session
var session = require('express-session');
app.use(session({
	secret: 'asdf',
	resave: false,
	saveUninitialized: true,
	cookie: {secure: true, maxAge: 120000 }
}))

app.use(express.static(__dirname+'/static'));
//Static

//Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/eCommerceSchema');

var UserSchema = new mongoose.Schema({
	first_name: {type: String, trim: true, required: true},
	last_name: {type: String, trim: true, required: true},
	email: {type: String, trim: true, required: true},
	password: {type: String, trim: true, required: true},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now}
});
mongoose.model('User', UserSchema);
var User =  mongoose.model('User');

var ProductSchema = new mongoose.Schema({
	title: {type: String, trim: true, required: true},
	price: {type: Number, trim: true, required: true},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now}
});
mongoose.model('Product', UserSchema);
var Product =  mongoose.model('Product');

//listener

//routes
app.post('/users', function(req, res){
	var userInstance = new User({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email, 
		password: req.body.password
	});
	userInstance.save(function(err){
		if(err){ return res.json(err) }
		else {return res.json(userInstance)}
	})	
})

app.post('/sessions', function(req, res){
	User.findOne({
		email: req.body.email, 
		password: req.body.password
	}, function(err,user){ //The err is very important.
		if(user){
			req.session.user_id = user.id;
			user.password = null; //returns password null so that it isnt stored in session.
			user.created_at = null;
			user.updated_at = null;
			return res.json(user)
		} else 
			{return res.json(false)}
	})
})

app.get('/authenticate', function(req, res){
	if(req.session.user_id){
		return res.json(true);
	}
	else{
		return res.json(false);
	}
})
app.get('/products', function(req, res){
	Product.find({}, function(err, records){
		return res.json(records);
	})
})

//mySql






app.listen(8008)