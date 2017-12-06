const React = require('react');
const { render } = require('react-dom');
const d3 = require('./d3');

const PROJECT_NAME = 'interactive-gay-rights-map';
const root = document.querySelector(`[data-${PROJECT_NAME}-root]`);

function init() {
  const stage = document.querySelector('.scrollyteller-stage');

  if (stage === null) {
    return setTimeout(init, 100);
  }

  const App = require('./components/App');
  d3.json(root.getAttribute('data-config-url'), (err, data) => {
    render(<App data={data} />, stage);
  });
}

init();

if (module.hot) {
  module.hot.accept('./components/App', () => {
    try {
      init();
    } catch (err) {
      const ErrorBox = require('./components/ErrorBox');
      render(<ErrorBox error={err} />, root);
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  console.debug(`[${PROJECT_NAME}] public path: ${__webpack_public_path__}`);
}
