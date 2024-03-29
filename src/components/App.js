const React = require("react");
const Scrollyteller = require("@abcnews/scrollyteller");
const Map = require("./Map");
const styles = require("./App.scss").default

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      property: "marriagelegal",
      legend: "all",
    };
  }

  render() {
    const { data, scrollyteller } = this.props;

    const key = Object.keys(data).filter((key) => {
      return key.replace(/[^a-zA-Z]+/g, "") === this.state.property;
    })[0];
    const p = data[key];
    const colour = p.theme[Object.keys(p.theme)[0]];

    return (
      <Scrollyteller
        panels={scrollyteller.panels}
        className={`Block is-richtext is-piecemeal ${styles.scrollyteller}`}
        panelClassName={`Block-content u-layout u-richtext ${styles.panel}`}
        onMarker={(config) =>
          this.setState((state) => ({
            property: config.key,
            legend: config.legend || state.legend,
          }))
        }
      >
        <Map data={p} legend={this.state.legend} />
      </Scrollyteller>
    );
  }
}

module.exports = App;
