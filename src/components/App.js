const React = require('react');

const Map = require('./Map');
const styles = require('./App.scss');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onMark = this.onMark.bind(this);

    this.state = {
      config: props.data['marriage-legal'],
      legend: 'all'
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

    if (config.key) {
      // Find the key in our data (they have hyphens but markers cannot)
      const key = Object.keys(this.props.data).filter(k => {
        return k.replace(/\-+/g, '') === config.key;
      })[0];

      if (key) {
        this.setState(state => {
          return {
            config: this.props.data[key]
          };
        });
      }
    }

    if (config.legend) {
      this.setState(state => ({
        legend: config.legend
      }));
    }
  }

  render() {
    return (
      <div className={styles.base}>
        <Map data={this.state.config} legend={this.state.legend} />
      </div>
    );
  }
}

module.exports = App;
