import React, { Component } from 'react'
import Timeline from 'react-timelines'

import './timeline.css'

import { START_YEAR, NUM_OF_YEARS, BOT_TYPES, BOT_TYPES_EMPTY, BOT_PROPS } from './constants'

import { buildTimebar, buildTrack } from './builders'

import { fill, getAllBotTypes } from './utils'

const now = new Date()

const timebar = buildTimebar()

const MIN_ZOOM = 2
const MAX_ZOOM = 20

class App extends Component {
  constructor(props) {
    super(props)
    this.props = props;
  }

  init = () => {
    if(this.props.bots["bots"].length === 0) {
        var tracksById = fill(BOT_TYPES_EMPTY.length).reduce((acc, i) => {
            const track = buildTrack(BOT_TYPES_EMPTY[i].value,BOT_TYPES_EMPTY[i].label,this.props.bots["bots"])
            acc[track.id] = track
            return acc
          }, {})
    }
    else {
        var botTypes = getAllBotTypes(this.props.bots)
        var tracksById = fill(botTypes.length).reduce((acc, i) => {
            const track = buildTrack(botTypes[i],BOT_PROPS[botTypes[i]].label,this.props.bots["bots"])
            acc[track.id] = track
            return acc
          }, {})
    }


    
    this.state = {
      open: false,
      zoom: 2,
      tracksById,
      tracks: Object.values(tracksById),
    }
  }

  handleToggleOpen = () => {
    this.setState(({ open }) => ({ open: !open }))
  }

  handleZoomIn = () => {
    this.setState(({ zoom }) => ({ zoom: Math.min(zoom + 1, MAX_ZOOM) }))
  }

  handleZoomOut = () => {
    this.setState(({ zoom }) => ({ zoom: Math.max(zoom - 1, MIN_ZOOM) }))
  }

  handleToggleTrackOpen = track => {
    this.setState(state => {
      const tracksById = {
        ...state.tracksById,
        [track.id]: {
          ...track,
          isOpen: !track.isOpen,
        },
      }

      return {
        tracksById,
        tracks: Object.values(tracksById),
      }
    })
  }

  render() {
    this.init()
    const { open, zoom, tracks } = this.state
    const start = new Date(`${START_YEAR}`)
    const end = new Date(`${START_YEAR + NUM_OF_YEARS}`)
    return (
        <Timeline
          scale={{
            start,
            end,
            zoom,
            zoomMin: MIN_ZOOM,
            zoomMax: MAX_ZOOM,
          }}
          isOpen={open}
          toggleOpen={this.handleToggleOpen}
          zoomIn={this.handleZoomIn}
          zoomOut={this.handleZoomOut}
          clickTrackButton={track => console.log(track)}
          timebar={timebar}
          tracks={tracks}
          now={now}
          toggleTrackOpen={this.handleToggleTrackOpen}
          enableSticky
          scrollToNow
          
        />
    )
  }
}

export default App