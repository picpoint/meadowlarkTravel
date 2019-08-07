const express = require('express');
const app = express();
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
const skils = require('./public/lib/skils.js');
const skilsRandom = require('./public/lib/skilsRandom.js');
const mocha = require('mocha');
const chai = require('chai');
const bodyParser = require('body-parser');



app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + 'public'));
app.use(bodyParser.urlencoded({extended: false}));


app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' &&
		req.query.test === '1';
	next();
});


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
	console.log(req.session);
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


app.listen(app.get('port'), () => {
	console.log('server has been starting to port: ' + app.get('port') );
});


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