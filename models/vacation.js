const mongoose = require('mongoose');
const vacationShema  = mongoose.Schema({
	name: String,
	slug: String,
	category: String,
	sku: String,
	description: String,
	priceInCents: Number,
	tags: [String],
	inSeason: Boolean,
	available: Boolean,
	requireWaiver: Boolean,
	maximumGuests: Number,
	notes: String,
	packegesSold: Number
});

vacationShema.methods.getDisplayPrice = function () {
	return '$' + (this.priceInCents / 100).toFixed(2);
};

let Vacation = mongoose.model('Vacation', vacationShema);

Vacation.find(function (err, vacation) {
	if (err) {
		console.error(err);
	}

	if (vacation.length) {
		return;
	}

	new Vacation({
		name: 'Однодневный тур по реке Худ',
		slug: 'hood-river-day-trip',
		category: 'Однодневный тур',
		sku: 'HR199',
		description: 'Проведите день в плавании по реке	Колумбия и насладитесь сваренным по традиционным рецептам пивом на реке Худ!',
		priceInCents: 9995,
		tags: ['однодневный тур', 'река худ', 'плавание', 'виндсерфинг', 'пивоварни'],
		inSeason: true,
		maximumGuests: 16,
		available: true,
		packagesSold: 0,
	}).save();

	new Vacation({
		name: 'Скалолазание в Бенде',
		slug: 'rock-climbing-in-bend',
		category: 'Приключение',
		sku: 'B99',
		description: 'Пощекочите себе нервы горным восхождением на пустынной возвышенности.',
		priceInCents: 289995,
		tags: ['отдых на выходных', 'бенд', 'пустынная возвышенность', 'скалолазание'],
		inSeason: true,
		requiresWaiver: true,
		maximumGuests: 4,
		available: false,
		packagesSold: 0,
		notes: 'Гид по данному туру в настоящий момент  восстанавливается после лыжной травмы.',
	}).save();

});



module.exports = Vacation;

