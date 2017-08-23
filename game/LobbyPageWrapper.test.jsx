import React from 'react'
import chai, {expect} from 'chai'
chai.use(require('chai-enzyme')())
import {shallow} from 'enzyme'
import {spy} from 'sinon'
chai.use(require('sinon-chai'))
import firebase from 'APP/fire'
import {Provider} from 'react-redux'

import LobbyPageWrapper from './LobbyPageWrapper'
import LobbyPage from './components/LobbyPage'
import Lobby from './components/Lobby'

/* global describe it beforeEach */
describe('<LobbyPage /> the page that passes props to the lobby', () => {
  let lobbyPageWrapper
  const db = firebase.database()
  const testDatabase= db.ref('hello')
  beforeEach('Create component', () => {
    lobbyPageWrapper = shallow(<lobbyPageWrapper />)
  })

  it('exists and has been created at least', () => {
    expect(lobbyPageWrapper.length).to.be.equal(1)
  })
})
