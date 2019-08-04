const skils = require('./skils.js');


function skilsRandom() {
	let skilsRandom = skils[Math.floor(Math.random() * skils.length)];
	return skilsRandom;
}

module.exports = skilsRandom;
