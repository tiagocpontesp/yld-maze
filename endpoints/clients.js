'use strict'


const net = require('net')
const readline = require('readline')
const debug = require('debug')('endpoints/clients')


const PORT_CLIENTS = +process.env.PORT_CLIENTS || 9099


const clients = new Map()


net.createServer((socket) => {
  let id
  socket.setEncoding('utf8')
  const rl = readline.createInterface({input: socket})
  rl.once('line', (line) => {
    id = line
    clients.set(id, socket)
    debug(`${id} connected`)
    rl.close()
  })
  socket.on('end', () => {
    clients.delete(id)
    debug(`${id} disconnected`)
  })
}).listen(PORT_CLIENTS, (err) => {
  if (err) throw err
  debug(`Bound on ${PORT_CLIENTS}`)
})


module.exports = clients
