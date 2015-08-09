/**
 * Module Dependencies
 */

import React from 'react'
import {TransitionSpring, presets} from 'react-motion'
import range from 'lodash.range'
import assign from 'lodash.assign'


const noop = function(){}

const Grid = React.createClass({

  propTypes: {
    style: React.PropTypes.object,
    onReorder: React.PropTypes.func,
    offsetTop: React.PropTypes.number,
    offsetLeft: React.PropTypes.number,
    columnCount: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  },

  getInitialState() {

    let count = React.Children.count(this.props.children)
    let layout = this.getLayout(count, this.props)

    return {
      even: 0,
      mouse: [0, 0],
      delta: [0, 0],
      lastPress: null,
      isPressed: false,
      count,
      layout
    };
  },

  getDefaultProps () {
    return {
      columnCount: 3,
      width: 50,
      height: 50,
      onReorder: noop,
      offsetTop: 0,
      offsetLeft: 0
    }
  },

  getLayout (count, props) {
    let {columnCount, width, height} = props
    return range(count).map(n => {
      let row = Math.floor(n / columnCount)
      let col = n % columnCount
      return [width * col, height * row]
    })
  },

  onTouchMove(e) {
    e.preventDefault()
    this.handleMouseMove(e.touches[0])
  },

  onTouchStart(key, pressLocation, e) {
    this.onMouseDown(key, pressLocation, e.touches[0])
  },

  onMouseDown(key, [pressX, pressY], {pageX, pageY}) {
    this.setState({
      lastPress: key,
      isPressed: true,
      delta: [pageX - pressX, pageY - pressY],
      mouse: [pressX, pressY]
    })
  },

  onMouseMove({pageX, pageY}) {
    const {lastPress, isPressed, delta: [dx, dy]} = this.state
    const {width, height, columnCount, offsetTop, offsetLeft} = this.props
    const count = React.Children.count(this.props.children)

    if (isPressed) {
      const col = clamp(Math.floor((pageX - offsetLeft) / width), 0, columnCount - 1)
      const row = clamp(Math.floor((pageY - offsetTop) / height), 0, Math.floor(count / columnCount))
      const index = row * columnCount + col
      var lastPressedIndex

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
  },

  onMouseUp() {
    this.setState({ isPressed: false, delta: [0, 0]})
  },

  getValues() {
    const {children} = this.props
    const {lastPress, isPressed, mouse} = this.state

    let layout = this.getLayout(React.Children.count(children), this.props)

    var positions = {}

    React.Children.forEach(children, (child, i) => {
      let {type, key} = child

      positions[key] = {
        opacity: { val : 1 },
        scale: { val : 1, config: presets.wobbly },
        child: child
      }

      if (key === lastPress && isPressed) {
        positions[key].left = { val : mouse[0], config: []}
        positions[key].top = { val : mouse[1], config: []}
      } else {
        let [x, y] = layout[i]
        positions[key].left = { val : x, config: presets.wobbly }
        positions[key].top = { val: y, config: presets.wobbly }
      }

    })

    return positions
  },

  willLeave(key, val, endValue, currentValue, speed) {
    return {
      left: { val : val.left.val },
      top: { val: val.top.val },
      scale: { val : 0 },
      opacity: { val : 0 },
      child: val.child
    }
  },

  willEnter(key, val, endValue, currentValue, speed) {
    return {
      left: { val : val.left.val },
      top: { val : val.top.val },
      scale: { val : 0, config: presets.wobbly },
      opacity: { val : 0 },
      child: val.child
    }
  },

  render() {
    const {children, width, height} = this.props
    const {lastPress} = this.state

    function renderPositions(positions) {
      return Object.keys(positions).map((key, i) => {
        let { left, top, opacity, child, scale } = positions[key]
        let style = assign(child.props.style || {}, {
          position: 'absolute',
          width: width + 'px',
          height: height + 'px',
          WebkitTransform: `translate3d(${left.val}px, ${top.val}px, 0) scale(${scale.val})`,
          transform: `translate3d(${left.val}px, ${top.val}px, 0) scale(${scale.val})`,
          opacity: opacity.val,
          zIndex: key === lastPress ? 99 : 1
        })

        return React.cloneElement(child, {
          style,
          onMouseDown: this.onMouseDown.bind(null, key, [left.val, top.val]),
          onTouchStart: this.onTouchStart.bind(null, key, [left.val, top.val])
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
            <div
              style={parentStyle}
              onTouchMove={this.onTouchMove}
              onTouchEnd={this.onTouchEnd}
              onMouseMove={this.onMouseMove}
              onMouseUp={this.onMouseUp}>
                {renderPositions.call(this, positions)}
            </div>
          )

        }}

      </TransitionSpring>
    );
  },
});


function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min)
}

export default Grid;
