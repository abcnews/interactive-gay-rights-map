const React = require('react');
const d3 = require('../d3');
const TopoJSON = require('topojson');

const mapJSON = require('../world.topo.json');
const countryCodes = require('../country-codes.json');
const MAP_DATA = TopoJSON.feature(mapJSON, mapJSON.objects.countries)
  .features.filter(f => {
    // Remove Antarctica
    return f.id !== 10;
  })
  .map(f => {
    // Attach the actual name of the country
    f.country = countryCodes[f.id];
    return f;
  });

// const years = {
//   "Argentina": 2010,
//   "Belgium": 2003,
//   "Bermuda": 2017,
//   "Brazil":
//   "Canada": 2005,
//   "Colombia": 2016,
//   "Denmark":
//   "Finland": 2017,
//   "France":
//   "Germany": 2017,
//   "Greenland (part of Denmark)": 2016,
//   "Iceland": 2010,
//   "Ireland":
//   "Luxembourg":
//   "Malta":
//   "Mexico": ,
//   "Netherlands": 2001,
//   "New Zealand":
//   "Norway":
//   "Portugal": 2010,
//   "South Africa": 2006,
//   "Spain": 2005,
//   "Sweden": 2009,
//   "United Kingdom":
//   "United States":
//   "Uruguay":
// }

const styles = require('./Map.scss');

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.initGraph = this.initGraph.bind(this);
    this.updateHighlightedCountries = this.updateHighlightedCountries.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.updateHighlightedCountries(nextProps.highlightedCountries, nextProps.colour);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.initGraph(this.props);
  }

  /**
   * Initialize the graph
   * @param {object} props The latest props that were given to this component
   */
  initGraph(props) {
    const ratio = 380 / 940;

    this.width = window.innerWidth;
    this.height = this.width * ratio;

    this.projection = d3
      .geoEquirectangular()
      .scale(this.width * 0.15)
      .center([0, 0])
      .rotate([-11, 0, 0]) // Rotate around the world a bit to not cut off Russia
      .translate([this.width / 2, this.height / 2 + this.height * 0.1]);

    this.path = d3.geoPath().projection(this.projection);

    // Attach the SSM data
    this.data = MAP_DATA.map(f => {
      f.highlighted = props.highlightedCountries.includes(f.country);
      return f;
    });

    this.svg = d3
      .select(this.base)
      .append('svg')
      .attr('class', styles.svg)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewbox', `0 0 ${this.width} ${this.height}`);

    this.features = this.svg.append('g');

    this.features
      .selectAll('path')
      .data(this.data)
      .enter()
      .append('path')
      .attr('d', this.path)
      .style('fill', d => {
        if (d.highlighted) {
          return props.colour;
        } else {
          return '#ccc';
        }
      });
  }

  updateHighlightedCountries(highlightedCountries, colour) {
    // Update the SSM data
    this.data = MAP_DATA.map(f => {
      f.highlighted = highlightedCountries.includes(f.country);
      return f;
    });

    this.features
      .selectAll('path')
      .data(this.data)
      .transition()
      .duration(d => {
        return 200 + Math.random() * 600;
      })
      .style('fill', d => {
        if (d.highlighted) {
          return colour;
        } else {
          return '#ccc';
        }
      });
  }

  render() {
    return <div className={styles.wrapper} ref={el => (this.base = el)} />;
  }
}

module.exports = Map;
