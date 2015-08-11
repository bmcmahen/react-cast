import React from 'react'
import _ from 'lodash'
import Grid from '../src'
import {Spring} from 'react-motion'
import GridItem from './grid-item'

var projects = {
  '0': {
    name: 'Just Plum',
    description: 'Create, share, and find beautiful recipes.',
    image: 'justplum'
  },
  '1': {
    name: 'Fiddleware Subtitles',
    description: 'Create captions for your videos directly in the browser.',
    image: 'subtitles'
  },
  '2': {
    name: 'Montage',
    description: 'Experimental home media center based on Node.js',
    image: 'montage'
  },
  '3': {
    name: 'Connections',
    description: 'Explore the connection between ideas',
    image: 'mindmap'
  },
  '4': {
    name: 'Institutions',
    description: 'Find eugenic institutions in Western Canada',
    image: 'institutions'
  },
  '5': {
    name: 'Media',
    description: 'Explore videos and images from the Eugenics Archive',
    image: 'media'
  },
  '6': {
    name: 'Around the World',
    description: 'Eugenics around the world',
    image: 'world'
  },
  '7': {
    name: 'Timeline',
    description: 'Eugenics in Western Canada Timeline',
    image: 'timeline'
  },
  '8': {
    name: 'Chris McMahen',
    description: 'Author website for Chris McMahen',
    image: 'mcmahen'
  }
}

var GridWrapper = React.createClass({

  getInitialState() {
    return {
      columns: 3,
      width: 350,
      height: 200,
      offsetTop: 0,
      offsetLeft: 0,
      items: _.range(Object.keys(projects).length).map(num => {
        let id = String(num)
        if (projects[id]) {
          projects[id].id = id
          return projects[id]
        }

        return {
          id : String(num),
          name: 'New Project',
          image: null,
          description: 'Space for a new project'
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
      <div style={{minHeight: '100%'}}>
        <Grid
          ref='grid'
          columnCount={this.state.columns}
          onReorder={this.onReorder}
          offsetTop={this.state.offsetTop}
          offsetLeft={this.state.offsetLeft}
          style={{
            height: (Math.ceil(this.state.items.length / this.state.columns)) * this.state.height,
            width: this.state.columns * this.state.width,
            margin: '0 auto'
          }}
          width={this.state.width}
          height={this.state.height}>
          {this.state.items.map((item, i) => {
            return (
              <GridItem
                name={item.name}
                description={item.description}
                image={item.image}
                key={item.id}
              />
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
