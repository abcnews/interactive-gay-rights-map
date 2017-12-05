require('../intersection-observer-pollyfill');

const React = require('react');
const Panel = require('./Panel');

const styles = require('./Scrollyteller.scss');

class Scrollyteller extends React.Component {
  constructor(props) {
    super(props);

    // Observations for the scrollyteller wrapper
    this.onIntersection = this.onIntersection.bind(this);

    // Observations for panels
    this.onPanelIntersection = this.onPanelIntersection.bind(this);

    this.state = {
      sticky: 'before'
    };
  }

  componentDidMount() {
    // The scrollyteller element needs to know when to attach and dettach
    this.observer = new IntersectionObserver(this.onIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: [0, 1]
    });
    this.observer.observe(this.baseStart);
    this.observer.observe(this.baseEnd);
  }

  componentWillUnmount() {
    this.observer.unobserve(this.base);
    this.observer.disconnect();
  }

  onIntersection(entries, observer) {
    // We need to find out if we are before, after, or during our scrollyteller
    let before = false;
    let after = false;
    entries.forEach(entry => {
      if (entry.target === this.baseStart) {
        before = entry.isIntersecting;
      } else if (entry.target === this.baseEnd) {
        after = entry.isIntersecting;
      }
    });

    // We know we are 'during' the scrollyteller when before and after are both false
    let sticky = 'during';
    if (before) {
      sticky = 'before';
    } else if (after) {
      sticky = 'after';
    }
    this.setState(state => ({ sticky }));
  }

  onPanelIntersection(entry, observer, direction, marker) {
    // NOTE: On first load direction will be null

    if (direction === 'down' && entry.boundingClientRect.top < window.innerHeight / 2) return;
    if (direction === 'up' && entry.boundingClientRect.top > window.innerHeight / 2) return;

    // We have a new marker
    this.props.onMarker(marker);
  }

  observe(element, marker) {
    this.observables = this.observables.concat({ element, marker });
  }

  render() {
    const { waypoint, panels, className } = this.props;

    return (
      <div style={{ background: '#efefef' }} className={`${styles.base} ${className}`} ref={el => (this.base = el)}>
        <div ref={el => (this.baseStart = el)} />
        <div className={`${styles.background} ${styles[this.state.sticky]}`}>{this.props.children}</div>
        {panels &&
          panels.map((panel, index) => {
            let panelClassName;
            if (index === 0) {
              panelClassName = styles.firstPanel;
            } else if (index === panels.length - 1) {
              panelClassName = styles.lastPanel;
            }

            return (
              <Panel
                key={index}
                className={panelClassName}
                waypoint={waypoint}
                nodes={panel.nodes}
                marker={panel.marker}
                onIntersection={this.onPanelIntersection}
              />
            );
          })}
        <div ref={el => (this.baseEnd = el)} />
      </div>
    );
  }
}

Scrollyteller.defaultProps = {
  waypoint: 60,
  className: '',
  onMarker() {}
};

module.exports = Scrollyteller;
