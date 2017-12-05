const React = require('react');

const styles = require('./Panel.scss');

/**
 * <Panel waypoint nodes marker onIntersection />
 *
 * nodes is a list of DOM nodes to be re-appended within this panel
 * marker is the config to be sent as the event when this panel is within view
 */
class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.onIntersection = this.onIntersection.bind(this);

    this.state = {
      previousTop: null
    };
  }

  componentDidMount() {
    this.props.nodes.forEach(node => {
      this.detail.appendChild(node);
    });

    // The threshold is a percentage (0-1) of the size of this panel
    // when the panel reaches that percentage of visibility the callback will be fired
    const bounds = this.base.getBoundingClientRect();
    const waypoint = this.props.waypoint / 100;

    // The actual heights of the waypoints in pixels
    const upperWaypoint = window.innerHeight * (1 - waypoint);
    const lowerWaypoint = window.innerHeight * waypoint;

    // That height as a percentage of the panel
    const threshold = [upperWaypoint / bounds.height, lowerWaypoint / bounds.height];
    this.observer = new IntersectionObserver(this.onIntersection, { threshold });
    this.observer.observe(this.base);

    // Keep track of where the panel was when the last waypoint was hit
    this.setState(state => ({
      previousTop: Math.round(bounds.top)
    }));
  }

  componentWillUnmount() {
    this.observer.unobserve(this.base);
    this.observer.disconnect();

    this.props.nodes.forEach(node => {
      if (this.detail.contains(node)) {
        this.detail.removeChild(node);
      }
    });
  }

  onIntersection(entries, observer) {
    const entry = entries[0];

    // On first load the tops will be the same, only fire if this is the next marker to be hit going down
    if (entry.boundingClientRect.top === this.state.previousTop) {
      if (entry.isIntersecting && entry.boundingClientRect.bottom > window.innerHeight / 2) {
        this.props.onIntersection(entry, observer, null, this.props.marker);
      }
      return;
    }

    // Work out which direction we are going and whether we hit a marker
    const direction = entry.boundingClientRect.top > this.state.previousTop ? 'up' : 'down';
    this.props.onIntersection(entry, observer, direction, this.props.marker);
    this.setState(state => ({
      previousTop: Math.round(entry.boundingClientRect.top)
    }));
  }

  render() {
    return (
      <div className={`${this.props.className} ${styles.base}`} ref={el => (this.base = el)}>
        <div className={styles.detail} ref={el => (this.detail = el)} />
      </div>
    );
  }
}

Panel.defaultProps = {
  className: '',
  waypoint: 60,
  nodes: [],
  marker: {},
  onIntersection() {}
};

module.exports = Panel;
