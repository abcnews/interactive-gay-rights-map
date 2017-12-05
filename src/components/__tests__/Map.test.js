const { h } = require('preact');
const render = require('preact-render-to-string');
const htmlLooksLike = require('html-looks-like');

const Map = require('../Map');

describe('Map', () => {
  test('It renders', () => {
    const actual = render(<Map />);
    const expected = `
      <div></div>
    `;

    htmlLooksLike(actual, expected);
  });
});
