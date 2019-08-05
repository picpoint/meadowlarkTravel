let Browser = require('zombie');
assert = require('chai').assert;
let browser;

suite('Межстраничные тесты', function () {
  setup(function () {
    browser = new Browser();
  })
});



test('Запрос расценок для групп со траницы туров по реке Худ должен заполнять поле рефера', function (done) {
  let referrer = 'http://localhost:3000/tours/hood-river';
  browser.visit(referrer, function () {
    browser.clickLink('.requestGroupRate', function () {
      assert(browser.field('referrer').value === referrer);
      done();
    });
  });
});



test('запрос расценок для групп со страницы туров пансионата "Орегон Коуст" должен заполнять поле рефера', function (done) {
  let referrer = 'http://localhost:3000/tours/oregon-coast';
  browser.visit(referrer, function () {
    browser.clickLink('.requestGroupRate', function () {
      assert(browser.field('referrer').value === referrer);
      done();
    });
  });
});



test('Посещение страницы "Запрос цены для групп" напрямую должен приводить к пустому полю реферера', function (done) {
  browser.visit('http://localhost:3000/tours/request-group-rate', function () {
    assert(browser.field('referrer').value === '');
    done();
  });
});