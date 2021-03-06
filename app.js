
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/db',function (req,res) {
	mongoose.connect('mongodb://localhost/test');
	var db = mongoose.connection;
	var Schema = mongoose.Schema;
	db.on('error',console.error.bind(console,'connection error:'));
	db.once('open',function callback() {
	});


	var childSchema = new Schema({ name: String });
	var parentSchema = new Schema({
		children: [childSchema]
	})

	childSchema.pre('save',function (next) {
		if('invalid' == this.name) 
			return next(new Error('#sdfsdfsdf'));
		next();
	});
	var Parent = mongoose.model('Parent',parentSchema);
	var parent = new Parent({ children: [{ name: 'invalid' }]});
	parent.save(function (err) {
		console.log(err.message);
	});
	// var Parent = mongoose.model('Parent',parentSchema);
	// var parent = new Parent({
	// 	children: [
	// 		{ name: 'Matt' },
	// 		{ name: 'Sarah' }
	// 	]
	// });
	// parent.children[0].name = 'Matthew';
	// parent.save(function(){
	// 	console.warn("OK");
	// })

	// var personSchema = new Schema({
	// 	name: String,
	// 	sex: String,
	// 	age: Number
	// });

	// var Person = mongoose.model('Person',personSchema);
	// Person.update(
	// 	{ name: 'www' },
	// 	{ $set: { age: 24 }},
	// 	function (err,p) {
	// 		if(!err) {
	// 			var result = p.name + '...' + p.age;
	// 			console.log(result);
	// 		}
	// 	}
	// );

	// console.log(Person.findOne().exec(function (err,p) {
	// 	if(!err)
	// 		console.log(p);
	// }));
	// var p1 = new Person({
	// 	name: 'www',
	// 	sex: 'male',
	// 	age: 25
	// });
	// p1.save(function (err,person) {
	// 	if(!err)
	// 		console.log('OK');
	// 	var result = Person.findOne(function (err,person) {
	// 		if(!err)
	// 			console.log(person);
	// 	});
	// });




	// var animalSchema = new Schema({ name: String, type: String });
	// var personSchema = new Schema({
	// 	name: {
	// 		first: String,
	// 		last: String
	// 	}
	// });

	// animalSchema.methods.findSimilarTypes = function (cb) {
	//  	return this.model('Animal').find({ type: this.type }, cb);
	// };

	// animalSchema.statics.findByName = function (name,cb) {
	// 	this.find({ name: new RegExp(name,'i') }, cb);
	// };


	// var Person = mongoose.model('Person',personSchema);

	// var bad = new Person({
	// 	name: {
	// 		first: 'fuck',
	// 		last: 'you'
	// 	}
	// });

	// personSchema.virtual('name.full').get(function () {
	// 	return this.name.first + ' ' + this.name.last
	// });

	// personSchema.virtual('name.full').set(function (name) {
	// 	var split = name.split(' ');
	// 	this.name.first = split[0];
	// 	this.name.last = split[1];
	// });

	// var mad = new Person({});
	// mad.name.full = 'fuck youuuuuu';
	// console.log(mad.name.full);

	// var Animal = mongoose.model('Animal', animalSchema);
	// var dog = new Animal({ type: 'dog' });

	// dog.findSimilarTypes(function (err, dogs) {
	//  	console.log(dogs); // woof
	// });
})

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
