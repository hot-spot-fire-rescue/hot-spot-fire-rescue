import React from 'react'
import chai, {expect} from 'chai'
chai.use(require('chai-enzyme')())
import {shallow} from 'enzyme'
import {spy} from 'sinon'
chai.use(require('sinon-chai'))
import firebase from 'APP/fire'
import {createStore} from 'redux'
import {List} from 'immutable'

import {createPlayer} from '../reducers/player'
import mainReducer from '../reducers/index'

/* global describe it beforeEach */

describe('createPlayer', () => {
  it('returns properly formatted action', () => {
    const testId = 'testId'
    const testAp = 5
    const testLocation = -1
    const testAvatar = 'someavatar'
    const someUsername = 'someUsername'
    expect(createPlayer(testId, testAp, testLocation, testAvatar, someUsername)).to.be.deep.equal({
      type: 'CREATE_PLAYER',
      id: testId,
      ap: testAp,
      location: testLocation,
      avatar: testAvatar,
      username: someUsername
    })
  })
})

describe('Reducer', () => {
  const initialState = List()
  let testStore

  beforeEach('Create testing store and freezing it', () => {
    testStore = createStore(mainReducer)
    // freeze store so we don't mutate!!
    Object.freeze(testStore.getState())
  })

  it('has expected type of initial state', () => {
    expect(typeof testStore.getState()).to.be.deep.equal(typeof initialState)
  })
})
