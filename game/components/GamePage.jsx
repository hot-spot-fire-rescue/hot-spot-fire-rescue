import React from 'react'
import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {Provider} from 'react-redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {Grid, Row, Col, Clearfix} from 'react-bootstrap'
import IconButton from 'material-ui/IconButton'
import Clear from 'material-ui/svg-icons/content/clear'

import reducer from '../reducers'
import Board from './Board'

export default class extends React.Component {
  componentDidMount() {
    this.mountStoreAtRef(this.props.fireRef)
  }

  componentWillReceiveProps(incoming, outgoing) {
    this.mountStoreAtRef(incoming.fireRef)
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  mountStoreAtRef(ref) {
    if (this.state && this.state.store) {
      // If we already have a store, let's destroy it.
      this.unsubscribe && this.unsubscribe()
      this.unsubscribe = null
      this.setState({store: null})
      return process.nextTick(() => this.mountStoreAtRef(ref))
    }

    const store = createStore(
      reducer,
      composeWithDevTools(
        applyMiddleware(
          createLogger({collapsed: true}),
          thunkMiddleware,
          store => next => {
            const listener = ref.on('child_added', snapshot => next(snapshot.val()))
            this.unsubscribe = () => ref.off('child_added', listener)

            return action => {
              if (action.doNotSync) { return next(action) }
              return ref.push(action)
            }
          }
        )
      )
    )
    this.setState({store})
  }

  clear = () => {
    this.props.fireRef.set(null)
    // Reload the store
    this.mountStoreAtRef(this.props.fireRef)
  }

  render() {
    const {store} = this.state || {}
        , {children} = this.props
    if (!store) return null

    return <Provider store={store}>
      <Grid className="main-grid">
        <IconButton tooltip="SVG Icon" onClick={this.clear} style={{top: '6px'}}>
          <Clear />
        </IconButton>
        <span>Clear The Board</span>
        <Board fireRef={this.props.fireRef}/>
      </Grid>
    </Provider>
  }
}
