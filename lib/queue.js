'use strict'


const debug = require('debug')('lib/queue')

const emitter = require('./emitter')


const FIRST_SEQ = 1


const buffer = new Map()

let current_seq = FIRST_SEQ
emitter.on('reset', () => current_seq = FIRST_SEQ)

const queue = (seq, type, args) => {
  if (!seq) {
    seq = current_seq
    const buffered = buffer.get(seq)
    if (!buffered) return
    type = buffered.type
    args = buffered.args
  }

  if (seq === current_seq) {
    emitter.emit(type, args)
    buffer.delete(seq)
    current_seq++
    debug(`Emitted seq ${seq}`)
    queue()
  } else {
    buffer.set(seq, {type, args})
    debug(`Buffered seq ${seq} (${buffer.size} total)`)
  }
}


module.exports = queue
