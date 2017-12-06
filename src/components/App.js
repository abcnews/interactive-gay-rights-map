const React = require('react');

const Map = require('./Map');
const styles = require('./App.scss');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onMark = this.onMark.bind(this);

    this.state = {
      countries: [],
      colour: '#999'
    };
  }

  componentDidMount() {
    window.addEventListener('mark', this.onMark);
  }

  componentWillUnmount() {
    window.removeEventListener('mark', this.onMark);
  }

  onMark(mark) {
    const { config } = mark.detail.activated;

    if (config.legality) {
      // Find the key in our data (they have hyphens but markers cannot)
      const key = Object.keys(this.props.data).filter(k => {
        return k.replace(/\-+/, '') === config.legality;
      })[0];

      if (key) {
        // Grab the countries out of the config
        const countries = data[key].countries;
        const colour = conig.colour || data[key].theme[Object.keys(data[key].theme)[0]];

        this.setState(state => {
          return {
            countries,
            colour
          };
        });
      }
    }
  }

  render() {
    return (
      <div className={styles.base}>
        <Map highlightedCountries={this.state.countries} colour={this.state.colour} />
      </div>
    );
  }
}

module.exports = App;
