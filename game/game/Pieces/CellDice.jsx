import React from 'react'
import {connect} from 'react-redux'
import ReactDice from 'react-dice-complete'

export default class RowDice extends React.Component {
  constructor(props) {
    super()
  }
  rollAll() {
    this.reactDice.rollAll()
  }

  rollDoneCallback(num) {
    console.log(`You rolled a ${num}`)
  }

  render() {
    return (
      <div>
        <ReactDice
          numDice={1}
          faceColor="white"
          dotColor="black"
          outline={true}
          outlineColor="black"
          rollDone={this.rollDoneCallback}
          ref={dice => this.reactDice = dice}
        />
        <ReactDice
          numDice={1}
          outline={true}
          outlineColor="black"
          rollDone={this.rollDoneCallback}
          ref={dice => this.reactDice = dice}
        />
      </div>
    )
  }
}
