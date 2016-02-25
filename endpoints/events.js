'use strict'


const net = require('net')
const readline = require('readline')
const debug = require('debug')('endpoints/events')

const emitter = require('../lib/emitter')
const queue = require('../lib/queue')


const PORT_EVENT_SOURCE = +process.env.PORT_EVENT_SOURCE || 9090


net.createServer((socket) => {
  debug(`Event source connected`)
  socket.setEncoding('utf8')
  const rl = readline.createInterface({input: socket})
  rl.on('line', (line) => {
    const s = line.split('|')
    const seq = +s[0]
    const type = s[1]
    const args = {
      payload: `${line}\n`,
      from: s[2],
      to: s[3],
    }
    debug(`Received ${line} : { seq: ${seq} , type: ${type} }`)
    queue(seq, type, args)
  })
  socket.on('end', () => {
    debug(`Event source disconnected`)
    rl.close()
    emitter.emit('reset')
  })
}).listen(PORT_EVENT_SOURCE, (err) => {
  if (err) throw err
  debug(`Bound on ${PORT_EVENT_SOURCE}`)
})
