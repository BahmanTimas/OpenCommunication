const express = require('express')
const { ExpressPeerServer } = require('peer');
const app = express()
const port = 3000

app.use(express.static('dist'))

const server = app.listen(port, () => {
  console.log(`Ready on http://localhost:${port} `)
})

const peerServer = ExpressPeerServer(server, {
  path: '/',
  allow_discovery: true,
});

// let messages = []
// peerServer.on("connection", client => {
//   console.log("connection: " + client.getId())
// })
// peerServer.on("disconnect", client => {
//   console.log("disconnect: " + client.getId())
// })
// peerServer.on("message", (client, message) => {
//   console.log("message: " + client.getId() + " type: " + message.type)
//   if (message.type !== 'HEARTBEAT')
//     messages.push(message)
//
// })
// peerServer.on("error", error => {
//   console.log("error: " + error.name + " e-message: " + error.message)
// })

app.use('/peer-server', peerServer);
