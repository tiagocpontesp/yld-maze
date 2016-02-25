'use strict'


const EventEmitter = require('events').EventEmitter
const debug = require('debug')('lib/emitter')

const clients = require('../endpoints/clients')


const emitter = new EventEmitter()
const all_follows = new Map()


const private_message = (e) => {
  const connected = clients.get(e.to)
  if(connected) connected.write(e.payload)
}

emitter.on('reset', () => all_follows.clear())

// Follow
emitter.on('F', (e) => {
  debug(`Following : ${e.from} -> ${e.to} ...`)
  let followers = all_follows.get(e.to)
  if (!followers) {
    followers = new Set()
    all_follows.set(e.to, followers)
  }
  followers.add(e.from)
  private_message(e)
})

// Unfollow
emitter.on('U', (e) => {
  debug(`Unfollowing : ${e.from} X> ${e.to} ...`)
  const followers = all_follows.get(e.to)
  if (followers) followers.delete(e.from)
})

// Broadcast
emitter.on('B', (e) => {
  debug(`Broadcasting to ${clients.size} clients ...`)
  for (const entry of clients) {
    entry[1].write(e.payload)
  }
})

// Private Message
emitter.on('P', (e) => {
  debug(`PMing ${e.to} ...`)
  private_message(e)
})

// Status Update
emitter.on('S', (e) => {
  const followers = all_follows.get(e.from)
  if (!followers) {
    debug(`Updated Status from ${e.from}, without followers`)
  } else {
    debug(`Updating Status from ${e.from} to ${followers.size} followers ...`)
    for (const id of followers)
      clients.get(id).write(e.payload)
  }
})


module.exports = emitter
