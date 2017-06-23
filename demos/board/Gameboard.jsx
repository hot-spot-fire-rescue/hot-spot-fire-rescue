'use strict'
import React from 'react'
import {connect} from 'react-redux'

export const Gameboard = () => {
  const alertWall = (event) => {
    event.stopPropagation()
    alert('this is the wall')
  }

  const alertCell = (event) => {
    event.stopPropagation()
    alert('this is the cell')
  }

  return (
    <div>
      <div className="row">
        <div className="cell" id="0" onClick={ alertCell }>
          <div className="horizontal-wall" id="0" onClick={ alertWall }></div>
          <div className="player"></div>
        </div>
        <div className="cell" onClick={ alertCell } id="1">
          <div className="horizontal-wall" onClick={ alertWall }></div>
        </div>
        <div className="cell" onClick={ alertCell } id="2">
          <div className="horizontal-wall" onClick={ alertWall }></div>
          <div className="vertical-wall" onClick={ alertWall }></div>
        </div>

        <div className="cell" id="3"></div>
        <div className="cell" id="4"></div>
        <div className="cell" id="5"></div>
        <div className="cell" id="6"></div>
        <div className="cell" id="7"></div>
        <div className="cell" id="8"></div>
        <div className="cell" id="9"></div>
      </div>
      <div className="row">
        <div className="cell" id="10"></div>
        <div className="cell" id="11"></div>
        <div className="cell" id="12"></div>
        <div className="cell" id="13"></div>
        <div className="cell" id="14"></div>
        <div className="cell" id="15"></div>
        <div className="cell" id="16"></div>
        <div className="cell" id="17"></div>
        <div className="cell" id="18"></div>
        <div className="cell" id="19"></div>
      </div>
    </div>
  )
}

export default connect()(Gameboard)
