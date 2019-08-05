const fortune = require('../public/lib/skils.js');
let expect = require('chai').expect;

suite('Тесты печений предсказаний', function () {
  test('skilsRandom() должна возвращать рандомный скилл', function () {
    expect(typeof skils.skilsRandom() === 'string');
  });
});

