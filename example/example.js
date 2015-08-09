import React from 'react'
import _ from 'lodash'
import Grid from '../src'

var GridWrapper = React.createClass({

  getInitialState() {
    return {
      columns: 4,
      width: 100,
      height: 100,
      offsetTop: 0,
      offsetLeft: 0,
      items: _.range(15).map(num => {
        return {
          id : String(num),
          text: String(num)
        }
      })
    }
  },

  componentDidMount() {
    let el = React.findDOMNode(this.refs.grid)
    this.setState({
      offsetTop: el.offsetTop,
      offsetLeft: el.offsetLeft
    })
  },

  render () {
    return (
      <div>
        <h1>Hello World</h1>
        <a href='#'>Pretend Link</a>
        <Grid
          ref='grid'
          columnCount={this.state.columns}
          onReorder={this.onReorder}
          offsetTop={this.state.offsetTop}
          offsetLeft={this.state.offsetLeft}
          style={{height: '400px'}}
          width={this.state.width}
          height={this.state.height}>
          {this.state.items.map((item, i) => {
            return (
              <div
                key={item.id}
                style={{padding: '5px', boxSizing: 'border-box'}}
                onClick={this.onItemClick.bind(this, item)}>
                <div style={{backgroundColor: '#eee', height: '100%'}}>
                  <a tabIndex={i + 1} href='#'># {item.text}</a>
                </div>
              </div>
            )
          })}
        </Grid>
        <div>
          <button onClick={this.setColumns}>Change Columns</button>
          <button onClick={this.removeLast}>RemoveLast</button>
          <button onClick={this.randomOrder}>Random positions</button>
          <button onClick={this.addItem}>Add Item</button>
        </div>
      </div>
    )
  },

  onReorder(originalIndex, newIndex) {
    const _arr = this.state.items.slice(0)
    const val = _arr[originalIndex]
    _arr.splice(originalIndex, 1)
    _arr.splice(newIndex, 0, val)
    this.setState({ items: _arr })
  },

  randomOrder() {
    this.setState({
      items: _.shuffle(this.state.items)
    })
  },

  setColumns() {
    this.total = this.total || 0
    this.total++

    this.setState({
      columns: this.total % 2 ? 2 : 4
    })
  },

  removeLast() {
    let items = this.state.items
    items.shift() // mutate
    this.setState({items: items })
  },

  addItem() {
    let items = this.state.items
    this.newer = this.newer ? this.newer + 1 : 16
    items.push({ id : String(this.newer), text: String(this.newer)})
    this.setState({ items: items })
  },

  random () {
    let items = {...this.state.items}
    this.setState({
      items: _.shuffle(items)
    })
  },

  onItemClick (item, e) {
    console.log('clicked', item)
  },

  sort (inverse) {
    let items = {...this.state.items}
    let sorted = _.sortBy(items, 'text')
    if (inverse) {
      sorted.reverse()
    }
    this.setState({
      items: sorted
    })
  },

  filter (query) {
    if (!this.filtered) {
      this.filtered = {...this.state.items}
    }

    let items = {...this.state.items}
    let filtered = _.filter(items, item => {
      return ~item.text.indexOf(query)
    })
    return filtered
  }


})

module.exports = GridWrapper
