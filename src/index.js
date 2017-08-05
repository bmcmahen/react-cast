/**
 * Module Dependencies
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {TransitionSpring, presets} from 'react-motion'
import range from 'lodash.range'
import assign from 'lodash.assign'

const noop = function(){}

/**
 * Grid Class
 */

class Grid extends Component {

  constructor(props) {
    super(props);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.willLeave = this.willLeave.bind(this);
    this.willEnter = this.willEnter.bind(this);

    const count = React.Children.count(this.props.children);
    const layout = this.getLayout(count, this.props);

    this.state = {
      even: 0,
      mouse: [0, 0],
      delta: [0, 0],
      lastPress: null,
      isPressed: false,
      count,
      layout
    };
  }

  componentDidMount() {
    if (this.props.draggable) {
      window.addEventListener('mousemove', this.onMouseMove)
      window.addEventListener('touchmove', this.onTouchMove)
      window.addEventListener('mouseup', this.onMouseUp)
      window.addEventListener('touchend', this.onTouchEnd)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('touchmove', this.onTouchMove)
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('touchend', this.onTouchEnd)
  }

  getLayout (count, props) {
    let {columnCount, width, height} = props
    return range(count).map(n => {
      let row = Math.floor(n / columnCount)
      let col = n % columnCount
      return [width * col, height * row]
    })
  }

  onTouchMove(e) {
    if (!this.props.draggable) return
    e.preventDefault()
    this.onMouseMove(e.touches[0])
  }

  onTouchStart(key, pressLocation, e) {
    if (!this.props.draggable) return
    this.onMouseDown(key, pressLocation, e.touches[0])
  }

  onMouseDown(key, [pressX, pressY], {pageX, pageY}) {
    if (!this.props.draggable) return
    this.setState({
      lastPress: key,
      isPressed: true,
      delta: [pageX - pressX, pageY - pressY],
      mouse: [pressX, pressY]
    })
  }

  onTouchEnd(e) {
    if (!this.props.draggable) return
    this.onMouseUp()
  }

  onMouseMove({pageX, pageY}) {
    if (!this.props.draggable) return
    const {lastPress, isPressed, delta: [dx, dy]} = this.state
    const {width, height, columnCount, offsetTop, offsetLeft} = this.props
    const count = React.Children.count(this.props.children)

    if (isPressed) {
      const col = clamp(Math.floor((pageX - offsetLeft) / width), 0, columnCount - 1)
      const row = clamp(Math.floor((pageY - offsetTop) / height), 0, Math.floor(count / columnCount))
      const index = row * columnCount + col
      let lastPressedIndex

      // inefficient -- makes more sense to record index of lastPressed
      // during the mousedown handler
      React.Children.forEach(this.props.children, (child, i) => {
        if (child.key === lastPress) {
          lastPressedIndex = i
        }
      })

      this.props.onReorder(lastPressedIndex, index, this.props.children)
      this.setState({ mouse: [pageX - dx, pageY - dy] })
    }
  }

  onMouseUp() {
    if (!this.props.draggable) return
    this.setState({ isPressed: false, delta: [0, 0]})
  }

  getValues() {
    const {children, transition} = this.props
    const {lastPress, isPressed, mouse} = this.state

    // not sure if this needs to be rerun each time
    let layout = this.getLayout(React.Children.count(children), this.props)

    let positions = {}

    React.Children.forEach(children, (child, i) => {
      let {type, key} = child

      positions[key] = {
        opacity: { val : 1 },
        scale: { val : 1, config: transition },
        child: child
      }

      if (key === lastPress && isPressed) {
        positions[key].left = { val : mouse[0], config: []}
        positions[key].top = { val : mouse[1], config: []}
      } else {
        let [x, y] = layout[i]
        positions[key].left = { val : x, config: transition }
        positions[key].top = { val: y, config: transition }
      }

    })

    return positions
  }

  willLeave(key, val, endValue, currentValue, speed) {
    return {
      left: { val : val.left.val },
      top: { val: val.top.val },
      scale: { val : 0 },
      opacity: { val : 0 },
      child: val.child
    }
  }

  willEnter(key, val, endValue, currentValue, speed) {
    const {transition} = this.props
    return {
      left: { val : val.left.val },
      top: { val : val.top.val },
      scale: { val : 0, config: transition },
      opacity: { val : 0 },
      child: val.child
    }
  }

  render() {
    const {children, width, height} = this.props
    const {lastPress} = this.state
    const self = this

    function renderPositions(positions) {

      return Object.keys(positions).map((key, i) => {
        let { left, top, opacity, child, scale } = positions[key]

        let defaultStyle = {
          position: 'absolute',
          width: width + 'px',
          height: height + 'px',
          WebkitTransform: `translate3d(${left.val}px, ${top.val}px, 0) scale(${scale.val})`,
          transform: `translate3d(${left.val}px, ${top.val}px, 0) scale(${scale.val})`,
          opacity: opacity.val,
          zIndex: key === lastPress ? 99 : 1
        }

        let style = child.props.style
          ? assign(child.props.style, defaultStyle)
          : defaultStyle

        return React.cloneElement(child, {
          style,
          onMouseDown: self.onMouseDown.bind(null, key, [left.val, top.val]),
          onTouchStart: self.onTouchStart.bind(null, key, [left.val, top.val])
        })
      })
    }

    let defaultParentStyle = {
      position: 'relative'
    }

    const parentStyle = this.props.style
      ? assign(this.props.style, defaultParentStyle)
      : defaultParentStyle

    return (
      <TransitionSpring
        endValue={this.getValues()}
        willEnter={this.willEnter}
        willLeave={this.willLeave}>

        { positions => {

          return (
            <div style={parentStyle}>
              {renderPositions(positions)}
            </div>
          )

        }}

      </TransitionSpring>
    );
  }
}

Grid.defaultProps = {
  columnCount: 3,
  width: 50,
  height: 50,
  onReorder: noop,
  offsetTop: 0,
  offsetLeft: 0,
  draggable: true,
  transition: presets.stiff
};

Grid.propTypes = {
  style: PropTypes.object,
  onReorder: PropTypes.func,
  offsetTop: PropTypes.number,
  offsetLeft: PropTypes.number,
  columnCount: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  transition: PropTypes.array,
  draggable: PropTypes.bool
};

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min)
}

export default Grid;
