const React = require('react');
const Scrollyteller = require('./Scrollyteller');
const Map = require('./Map');

const styles = require('./App.scss');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      property: 'marriage-legal'
    };
  }

  render() {
    const { projectName, config } = this.props;

    const p = config[this.state.property];
    const colour = p.theme[Object.keys(p.theme)[0]];

    // TODO: this should be loaded using the loader
    const states = ['marriage-legal', 'acts-illegal', 'acts-punishable-by-death', 'more-draconian'];
    const panels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((_, i) => {
      const property = states[i % states.length];
      const node = document.createElement('p');
      node.innerHTML = 'This is a paragraph for ' + property + '.';

      if (i === 2) {
        node.innerHTML += '<br /><br />And another thing<br /><br />And another<br /><br />And yet another one';
      }

      return {
        marker: {
          i,
          property
        },
        nodes: [node]
      };
    });

    return (
      <div className={styles.base}>
        <p>this is some content before the scrollyteller</p>
        <p>more content</p>

        <Scrollyteller panels={panels} onMarker={marker => this.setState({ property: marker.property })}>
          <Map highlightedCountries={Object.keys(p.countries)} colour={colour} />
        </Scrollyteller>

        <p>Content after</p>
        <p>More content after</p>
      </div>
    );
  }
}

module.exports = App;
