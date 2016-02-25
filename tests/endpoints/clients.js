'use strict'


const net = require('net')
const test = require('tape')

const clients = require('../../endpoints/clients')


test('endpoints/clients', (t) => {
  t.plan(2)

  const when_up = () => {
    const socket = new net.Socket({writable: true})
    socket.setEncoding('utf8')
    socket.connect({port:process.env.PORT_CLIENTS})
    socket.write('rawr\n', () => {
      const wait_for_it = () => {
        t.ok(clients.has('rawr'), 'client connection')
        socket.on('close', () => t.ok(!clients.has('rawr'), 'client disconnection'))
        socket.end()
      }
      setTimeout(wait_for_it, 500)

    })
  }
  setTimeout(when_up, 500)

})

test.onFinish(process.exit)
