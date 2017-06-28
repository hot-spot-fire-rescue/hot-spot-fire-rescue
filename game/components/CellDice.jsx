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
    return num
  }

  rollD8() {
    const d8Result = document.getElementById("d8Result")
    const d8 = Math.floor(Math.random()*8+1)
    d8Result.innerHTML = d8
    return d8
  }

  render() {
    return (
      <div>
        <ReactDice
          numDice={1}
          faceColor="pink"
          dotColor="green"
          outline={true}
          outlineColor="black"
          rollDone={this.rollDoneCallback}
          ref={dice => this.reactDice = dice}
        />
        <div className="diceArea">
          <button onClick={this.rollD8} style= {{backgroundColor: 'pink', width: '60px', height: '60px', margin : '15px'}}><p id="d8Result" style={{fontSize: '20px'}}></p></button>

        </div>

      </div>
    )
  }
}
