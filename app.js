const express = require('express');
const app = express();
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
const forecast = require('./public/js/forecast.js');


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 4000);

app.use(express.static(__dirname + 'public'));

app.get('/', (req, res) => {
	res.render('home');
});


app.get('/about', (req, res) => {
	let forecastRandom = forecast[Math.floor(Math.random() * forecast.length)];
	res.render('about', {forecast: forecastRandom});
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


app.listen(app.get('port'), () => {
	console.log('server has been starting to port: ' + app.get('port') );
});