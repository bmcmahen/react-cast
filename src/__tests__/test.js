import Grid from '../index'
import React from 'react/addons'
import expect from 'expect'
import _ from 'lodash'
import $ from 'jquery'

const Test = React.addons.TestUtils
const noop = () => {}

describe('Grid', () => {

  let items = _.range(15).map(num => {
    return {
      id: String(num),
      text: String(num)
    }
  })

  function createGrid(props = {}) {
    let gridProps = _.assign({
      onReorder: noop,
      offsetTop: 0,
      offsetLeft: 0,
      width: 50,
      height: 50
    }, props)

    return Test.renderIntoDocument(
      <Grid {...gridProps}>
        {items.map(item => {
          return (
            <div key={item.id} style={{backgroundColor: 'blue'}} className='Grid__item'>
              {item.text}
            </div>
          )
        })}
      </Grid>
    )
  }

  function getEl(component) {
    return $(React.findDOMNode(component))
  }

  it('should render the passed in children', () => {
    let $el = getEl(createGrid({ columnCount: 3 }))
    let children = $el.find('.Grid__item')
    expect(children.length).toEqual(15)
    let first = $(children.get(0))
    expect(first.text()).toEqual(0)
    expect($(children.get(1)).text()).toEqual(1)
  })

  it('should render the correct positions', () => {
    let $el = getEl(createGrid({ columnCount: 3 }))
    let children = $el.find('.Grid__item')
    let first = $(children.get(0))
    let third = $(children.get(2))
    let fourth = $(children.get(3))

    expect(first.css('transform')).toEqual('translate3d(0px, 0px, 0px) scale(1)')
    expect(third.css('transform')).toEqual('translate3d(100px, 0px, 0px) scale(1)')
    expect(fourth.css('transform')).toEqual('translate3d(0px, 50px, 0px) scale(1)')
  })

  it('should add the correct styles', () => {
    let $el = getEl(createGrid({ columnCount: 3 }))
    let children = $el.find('.Grid__item')
    let first = $(children.get(0))

    expect(first.css('position')).toEqual('absolute')
    expect(first.css('opacity')).toEqual('1')
  })

  it('should merge styles for children', () => {
    let $el = getEl(createGrid({ columnCount: 3 }))
    let children = $el.find('.Grid__item')
    let first = $(children.get(0))
    expect(first.css('background-color')).toEqual('blue')
  })

  it('should set the correct styles on the parent element', () => {
    let $el = getEl(createGrid())
  })

  it('should emit a reorder event', () => {

  })

  it('should animate remove children', () => {

  })

  it('should animate added children', () => {

  })

  it('should change positions if children order changes', () => {

  })

  it('should not remove event handlers from cloned children', () => {

  })

  it('should allow the user to disable the drag event', () => {
    
  })



})
