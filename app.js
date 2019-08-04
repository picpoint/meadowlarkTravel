const express = require('express');
const app = express();
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
const skils = require('./public/lib/skils.js');
const skilsRandom = require('./public/lib/skilsRandom.js');
const mocha = require('mocha');
const chai = require('chai');


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + 'public'));


app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' &&
		req.query.test === '1';
	next();
});


app.get('/', (req, res) => {
	res.render('home');
});


app.get('/about', (req, res) => {
	res.render('about', {
		skils: skilsRandom(),
		pageTestScript: '/qa/tests-about.js'
	});
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