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

const styles = require('./Map.scss');
const SERIF_FONT = 'ABCSerif,Book Antiqua,Palatino Linotype,Palatino,serif';
const SANS_SERIF_FONT = 'ABCSans,Helvetica,Arial,sans-serif';

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.initGraph = this.initGraph.bind(this);
    this.getMapData = this.getMapData.bind(this);
    this.updateData = this.updateData.bind(this);

    this.createLegend = this.createLegend.bind(this);

    this.onResize = this.onResize.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.updateData(nextProps);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.initGraph(this.props);
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    const ratio = (window.innerWidth > window.innerHeight ? 480 : 650) / 940;

    this.width = window.innerWidth;
    this.height = Math.min(this.width * ratio, window.innerHeight);

    const scale = window.innerWidth < 400 ? 0.15 : 0.13;
    this.projection = d3
      .geoEquirectangular()
      .scale(this.width * scale)
      .center([0, 0])
      .rotate([-11, 0, 0]) // Rotate around the world a bit to not cut off Russia
      .translate([this.width / 2, this.height / 2 + 40]);

    this.path = d3.geoPath().projection(this.projection);

    this.svg.attr('width', this.width).attr('height', this.height);

    document.querySelector('.scrollyteller-stage').style.setProperty('height', this.height + 'px');

    this.features.selectAll('path').attr('d', this.path);

    this.updateData(this.props);
  }

  getMapData(props) {
    const countryNames = Object.keys(props.data.countries);
    return MAP_DATA.map(f => {
      // See if country should be highlighted
      if (countryNames.indexOf(f.country) > -1) {
        const keys = props.data.countries[f.country];

        if (props.legend !== 'all' && keys.indexOf(props.legend) === -1) {
          f.highlight = false;
          return f;
        }

        // Theme colour is the right-most key
        const theme = props.data.theme[keys[keys.length - 1]];
        const colour = theme[0] === '#' ? theme : props.data.theme[keys[keys.length]];
        f.highlight = colour;
      } else {
        f.highlight = false;
      }

      return f;
    });
  }

  createLegend(props) {
    const legendKeys = props.legend === 'all' ? Object.keys(props.data.legend) : [props.legend];

    // if desktop then move the legend to be just below the map and in the center
    let width = this.width;
    let yOffset = 8;
    if (width > 400) {
      width = 400;
      yOffset = 30;
    } else {
      width = width - 60;
    }
    const legendWidth = width / legendKeys.length;

    this.legend = this.svg
      .append('g')
      .selectAll('g')
      .data(legendKeys)
      .enter()
      .append('g')
      .attr('transform', `translate(${(this.width - width) / 2}, ${this.height - yOffset})`);

    this.legend
      .append('circle')
      .attr('r', 5)
      .attr('cx', (d, i) => {
        return i * legendWidth;
      })
      .attr('fill', d => {
        return props.data.theme[d];
      });
    this.legend
      .append('text')
      .attr('font-family', SANS_SERIF_FONT)
      .attr('font-size', 14)
      .attr('fill', d => {
        let colour = props.data.theme[d];
        if (colour === '#FF741F') {
          colour = '#BA4700';
        } else if (colour === '#1FCDAE') {
          colour = '#007A66';
        }
        return colour;
      })
      .text(d => {
        return props.data.legend[d];
      })
      .attr('y', 5)
      .attr('x', (d, i) => {
        return i * legendWidth + 12;
      });
  }

  /**
   * Initialize the graph
   * @param {object} props The latest props that were given to this component
   */
  initGraph(props) {
    const ratio = (window.innerWidth > window.innerHeight ? 480 : 650) / 940;

    this.width = window.innerWidth;
    this.height = Math.min(this.width * ratio, window.innerHeight);

    const scale = window.innerWidth < 400 ? 0.15 : 0.13;
    this.projection = d3
      .geoEquirectangular()
      .scale(this.width * scale)
      .center([0, 0])
      .rotate([-11, 0, 0]) // Rotate around the world a bit to not cut off Russia
      .translate([this.width / 2, this.height / 2 + 40]);

    this.path = d3.geoPath().projection(this.projection);

    // Attach the SSM data
    this.data = this.getMapData(props);

    this.svg = d3
      .select(this.base)
      .append('svg')
      .attr('class', styles.svg)
      .attr('width', this.width)
      .attr('height', this.height);

    document.querySelector('.scrollyteller-stage').style.setProperty('height', this.height + 'px');

    this.features = this.svg.append('g');

    this.features
      .selectAll('path')
      .data(this.data)
      .enter()
      .append('path')
      .attr('d', this.path)
      .style('fill', d => {
        if (d.highlight) {
          return d.highlight;
        } else {
          return '#ccc';
        }
      });

    this.createLegend(props);
  }

  updateData(props) {
    // Update the SSM data
    this.data = this.getMapData(props);

    this.features
      .selectAll('path')
      .data(this.data)
      .transition()
      .duration(d => {
        return 100 + Math.random() * 200;
      })
      .style('fill', d => {
        if (d.highlight) {
          return d.highlight;
        } else {
          return '#ccc';
        }
      });

    this.legend.remove();
    this.createLegend(props);
  }

  render() {
    return <div className={styles.wrapper} ref={el => (this.base = el)} />;
  }
}

module.exports = Map;
