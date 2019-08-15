const path = require('path');
const express = require('express');
const app = express();
const handlebars = require('express-handlebars').create({
	defaultLayout:'main',
	helpers: {
		section: function (name, options) {
			if (!this._sections) {
				this._sectoins = {};
			}
			this._sectoins[name] = options.fn(this);
			return null;
    }
	}
});
const skils = require('./public/lib/skils.js');
const skilsRandom = require('./public/lib/skilsRandom.js');
const mocha = require('mocha');
const chai = require('chai');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const cookieParser = require('cookie-parser');
const credentials = require('./credentials.js');
const cookieSession = require('express-session');
const favicon = require('serve-favicon');
const nodemailer = require('nodemailer');
const morgan = require('morgan');
const logger = require('express-logger');
const loadtest = require('loadtest');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const VacationInSeasonListener = require('./models/vacationInSeasonListener.js');

let opts = {
	server: {
		socketOptions: {keepalive: 1}
	}
};

switch (app.get('env')) {
	case 'development':
		mongoose.connect(credentials.mongo.development.connectionString, opts);
		break;

	case 'production':
		mongoose.connect(credentials.mongo.production.connectionString, opts);
		break;

	default:
		throw new Error('Неизвестная среда выполнения', app.get('env'));
}


/*
suite('STRESS TESTS', ()=> {
	test('Home page must be to process 50 queris in seconds', function (done) {
		let options = {
			url: 'http://localhost:3000',
			concurrency: 4,
			maxRequests: 50
		};
		loadtest.loadTest(options, (err, result) => {
			expect(!err);
			expect(result.totalTimeSeconds < 1);
			done();
		});
	});
});
*/



/*
const mailTransport = nodemailer.createTransport('SMTP', {
	service: 'Gmail',
	auth: {
		user: credentials.gmail.user,
		pass: credentials.gmail.password
	}
});
*/


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + 'public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(credentials.cookieSecret));
app.use(cookieSession({
	resave: false,
	saveUninitialized: false,
	secret: credentials.cookieSecret
}));
app.use(favicon(path.join(__dirname, 'public/pict', 'travel.ico')));


app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

switch (app.get('env')) {
	case 'development':
		app.use(morgan('dev'));
		break;

	case 'production':
		logger({
			path: __dirname + '/log/request.log'
		});
		break;
}

/*
app.use((req, res, next) => {
	let cluster = require('cluster');
	if (cluster.isWorker) {
		console.log(`Исполнитель %d получил запрос `, cluster.worker.id);
	}
});
*/


app.get('/headers', (req, res) => {
	res.set({'Content-Type': 'text/html'});
	let s = '';
	for (let name in req.headers) {
		s += name + ' : ' + req.headers[name] + '\n';
		res.send(s);
	}
});



app.get('/', (req, res) => {
	res.render('home');
	res.cookie('first', 'cookieOne');
	res.cookie('second', 'cookieTwo');
	res.cookie('third', 'cookieThird', {signed: true});
	req.session.userName = 'Anonimuzzz';
	req.session.userName = null;

});


app.get('/about', (req, res) => {
	res.render('about', {
		skils: skilsRandom(),
		pageTestScript: '/qa/tests-about.js'
	});
});


app.get('tours/hood-river', (req, res) => {
	res.render('tours/hood-river');
});


app.get('tours/request-group-rate', (req, res) => {
	res.render('tours/request-group-rate');
});


app.get('/newsletter', (req, res) => {
	res.render('newsletter', {csrf: 'CSRF tokken goes here'});
});


app.get('/contest/vacation-photo', (req, res) => {
	let now = new Date();
	res.render('vacation-photo', {
		year: now.getFullYear(),
		month: now.getMonth()
	});
});


app.get('/epic-fail', (req, res) => {
	process.nextTick(()=> {
		throw new Error('BA BAH!!!');
	});
});


app.get('vacations', (req, res) => {
	Vacation.find({available: true}, function (err, vacation) {
		let context = {
			vacations: vacations.map(function (vacation) {
				return {
					sku: vacation.sku,
					name: vacation.name,
					description: vacation.description,
					price: vacation.getDisplayPrice(),
					inSeason: vacation.inSeason
				}
			})
		};
		res.render('vacations', context);
	});
});


app.get('./notify-me-when-in-season.handlebars', (req, res) => {
	res.render('notify-me-when-in-season', {sku: req.query.sku});
});


app.post('./notify-me-when-in-season.handlebars', (req, res) => {
	VacationInSeasonListener.update(
		{email: req.body.email},
		{$push: {sku: req.body.sku}},
		{upsert: true},

		function (err) {
			if (err) {
				console.error(err.stack);
				req.session.flash = {
					type: 'danger',
					intro: 'U -u - u - ps',
					message: 'При обработке ващего запроса произощла ощибка'
				};
				return res.redirect(303, '/vacations');
			}
			req.session.flash = {
				type: 'success',
				intro: 'Thank you',
				message: 'Вы будете оповещенны, когда наступит сезон для этого тура'
			};
			return res.redirect(303, '/vacations');
		}
		);
});


app.post('/contest/vacation-photo/:year/:month', (req, res) => {
	let form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		if (err) {
			return res.redirect(303, '/error');
		}
		console.log('received fields: ' + fields);
		console.log('received files: ' + files);
		res.redirect(303, 'thank you');
	});
});


app.post('/process', (req, res) => {
	console.log('Form (form querystring): ' + req.query.form);
	console.log('CSRF tokken (form hidden form field): ' + req.body._csrf);
	console.log('Name (from visible form field): ' + req.body.name);
	console.log('Email (from visible form field): ' + req.body.email);
	res.redirect(303, '/thank you');
});



app.use((req, res, next) => {
	res.status(404);
	res.render('404');
});


app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500);
	res.send('500');
});


app.use((req, res, next) => {
	if (!res.locals.partials) {
		res.locals.partials = {};
	}
	res.locals.partials.weatherContext = getWeatherData();
	next();
});


function startServer() {
	app.listen(app.get('port'), () => {
		console.log('server has been starting to port: ' + app.get('port') );
		console.log('server starting to enviroment: ' + app.get('env'));
	});
}


if (require.main === module) {
	startServer();
} else {
	module.exports = startServer;
}




function getWeatherData() {
	return {
		locations: [
			{
				name: 'Portland',
				forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
				weather: 'Clouds',
				temp: '54.1 F (12.3 C)'
			},
			{
				name: 'Бенд',
				forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
				weather: 'Малооблачно',
				temp: '55.0 F (12.8 C)'
			},
			{
				name: 'Манзанита',
				forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
				weather: 'Небольшой дождь',
				temp: '55.0 F (12.8 C)'
			}
		]
	};
}