
##  README

> [Exercise instructions](./provided/instructions.md)


## Run

* just show me it's working
`npm install && npm test && npm start`

* i want to start the jar myself and know what's going on
`npm run dev`

> Note:
> * you can keep relaunching the jar against a dev script instance
> * node 5.x only


## Architecture

* `endpoints/clients.js`
Handles client connections, keeping a Map of ids to active sockets.

* `endpoints/events.js`
Handles event source connections, and shoots pre-parsed messages to the queue.

* `lib/queue.js`
Eats unsorted parsed messages, discharges ordered `lib/emitter` events as fast as it possibly can.

* `lib/emitter.js`
Exports said emitter, handles the rest of the action (managing followers, messaging clients)


## Worthy of mention
  * Against the instructions, I've included a sole dependency (debug) just to keep some logging, without affecting production mode. hope it's not a bother;
  * Tests shouldn't be relying on setTimeouts, in case the suite should grow (could use events);
  * Ditched the unit tests for the `lib/emitter` logic, since the jar's e2e testing already does this well.. and this took me more than 2h;
  * I should be using something like proxyquire instead of a require.cache hack.
