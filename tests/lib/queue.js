'use strict'


const test = require('tape')


test('lib/queue', (t) => {
  t.plan(3)

  const emitter = require('../../lib/emitter') // no need to mock it
  delete require.cache[require.resolve('../../lib/queue')]
  const queue = require('../../lib/queue')

  const invocations = []
  invocations.push((seq) => t.ok(seq === 1, 'after buffering'))
  invocations.push((seq) => t.ok(seq === 2, 'in sequence'))
  invocations.push((seq) => t.ok(seq === 1, 'after reset'))

  emitter.on('TEST', (seq_as_arg) => invocations.shift()(seq_as_arg))

  queue(2, 'TEST', 2)
  queue(1, 'TEST', 1)
  emitter.emit('reset')
  queue(9, 'TEST', 9)
  queue(1, 'TEST', 1)
})

test.onFinish(process.exit)
