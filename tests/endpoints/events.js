'use strict'


const net = require('net')
const test = require('tape')


test('endpoints/events', (t) => {
  t.plan(2)

  const when_up = () => {

    const emitter = require('../../lib/emitter') // no need to mock this one

    let queued
    require('../../lib/queue')
    require.cache[require.resolve('../../lib/queue')].exports = (seq, type, args) => {
      queued = {seq, type, args}
    }

    require('../../endpoints/events')

    const socket = new net.Socket({writable: true})
    socket.setEncoding('utf8')
    socket.connect({port:process.env.PORT_EVENT_SOURCE})
    socket.write('666|F|60\n', () => {
      const wait_for_it = () => {
        t.deepEqual(queued, {
          seq: 666,
          type: 'F',
          args: {
            payload: '666|F|60\n',
            from: '60',
            to: undefined,
          },
        }, 'sent well parsed to the queue')

        emitter.once('reset', () => t.ok('reset'))
        socket.end()
      }
      setTimeout(wait_for_it, 500)

    })
  }
  setTimeout(when_up, 500)

})

test.onFinish(process.exit)
