const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);


app.get('/', (req, res) => {
	res.type('text/html');
	res.send('Meadowlark Travel');
});


app.get('/about', (req, res) => {
	res.type('text/html');
	res.send('About ...');
});


app.use((req, res) => {
	res.type('text/plain');
	res.status(404);
	res.send('404 - page not found ...');
});


app.use((err, req, res, next) => {
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Internal Server Error');
});


app.listen(app.get('port'), () => {
	console.log('server has been starting to port: ' + app.get('port') );
});