import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Spring, presets} from 'react-motion'

class GridItem extends Component {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);

    this.state = {
      disabled: false
    };
  }

  onClick(e) {
    this.setState({ disabled: !this.state.disabled })
  }

  getDefault() {
    return {
      blur: { val : 0, config: presets.noWobble},
      opacity: { val : 1, config: presets.noWobble },
      scale: { val : 1, config: presets.wobbly},
      grayscale: { val : 0, config: presets.noWobble}
    }
  }

  getEndValue() {
    return {
      blur: { val : this.state.disabled ? 6 : 0, config: presets.noWobble},
      opacity: { val : this.state.disabled ? 0.5 : 1, config: presets.noWobble},
      scale: { val : this.state.disabled ? 0.5 : 1, config: presets.wobbly },
      grayscale: { val : this.state.disabled ? 1 : 0, config: presets.noWobble }
    }
  }

  render() {
    const {style, name, image, description, ...other} = this.props

    style.padding = '15px'
    style.boxSizing = 'border-box'

    return (
          <div
            style={style}
            onClick={this.onClick}
            {...other}>
            <div style={{
              height: '100%',
              boxSizing: 'border-box',
              border: '1px solid black'
            }}>

              <div style={{
                  height: '100%',
                  backgroundSize: 'cover',
                  width: '100%',
                  WebkitFilter: `grayscale(1) brightness(1.1)`,
                  filter: `grayscale(1) brightness(1.1)`,
                  backgroundImage: `url(static/${image}.jpg)`,
                  backgroundColor: '#eee'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '35px',
                  left: '15px',
                  right: '15px'
                }}>
              <h3 style={{
                margin: 0,
                fontFamily: 'Helvetica neue, helvetica, arial, sans-serif',
                color: 'darkorange',
                fontStyle: 'italic',
                textTransform: 'lowercase',
                fontSize: '1.6em',
                display: 'inline-block',
                fontWeight: 'bold',
                letterSpacing: '2px',
                padding: '0 5px',
                backgroundColor: 'black'
              }}>
                {name}
              </h3>
                <br />
                <span style={{backgroundColor: '#aaa', fontFamily: 'helvetica neue', color: 'black', fontSize: '0.85em', fontWeight: 'bold'}}>{description}</span>
              </div>
            </div>
          </div>
    )
  }

}

GridItem.defaultProps = {
  disabled: false
};

GridItem.propTypes = {
  style: PropTypes.object,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  link: PropTypes.string,
  image: PropTypes.string
};

export default GridItem
