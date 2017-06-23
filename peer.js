const colors = require('colors')
const geolib = require('geolib')
const { forIn } = require('lodash')
const { parse } = require('path')
var bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');

module.exports = (app, server, socket) => {
  const ExpressPeerServer = require('peer').ExpressPeerServer;
  const peerServer = ExpressPeerServer(server, {
    debug: true
  })
  app.use('/api', peerServer);
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }));

  const users = {

  }

  const userIds = []

  app.post('/peer/upload', function(req, res) {
    if (!req.files)
      return res.status(400).send('No files were uploaded.');

    const { image } = req.files
    const { peerId, id } = JSON.parse(req.body.data)
    users[peerId].emit('peer:send:image', { buffer: image.data, ext: parse(image.name).ext.slice(1) })
    users[id].emit('peer:send:image', { buffer: image.data, ext: parse(image.name).ext.slice(1) })
      //users[peerId].emit('peer:connect:accepted', peerId )
      //users[id].emit('peer:send:image', image.data.buffer )
      //users[id].emit('peer:send:image', image.data)

    // Use the mv() method to place the file somewhere on your server
    /*sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
      if (err)
        return res.status(500).send(err);

      res.send('File uploaded!');
    });*/
  });

  const { io, on, off } = socket

  on('connection', (socket => {
    socket.on('disconnect', function() {
      var i = userIds.indexOf(socket.socketId);
      console.log(userIds);
      console.log(colors.red(`Disconnected id at index ${i}`));
      forIn(socket._events, (val, key) => {
        socket.removeListener(key, val)
        val = null
      })
      if (i >= 0) {
        userIds.splice(i, 1);
        delete users[socket.socketId]
        console.log(colors.red(`Disconnected id ${socket.socketId}`));
        console.log(colors.yellow(`Users remaining ${userIds.length}`));
      }
    });

    socket.on('handshake', (id => {
      users[id] = socket

      users[id].socketId = id
      userIds.push(id)
      console.log(colors.green(`Reveived id ${id}`));
      console.log(userIds);
    }))

    socket.on('peer:connect', data => {
      const { peerId, id } = data
      users[peerId].emit('peer:connect:request', id)
    })

    socket.on('peer:connect:accept', data => {
      const { peerId, id } = data
      users[peerId].emit('peer:connect:accepted', id)
      socket.emit('peer:connect:accepted', peerId)
      console.log("emit", peerId);
    })

    socket.on('heading', (userData => {
      const { heading, id } = userData
      const user = users[id]
      user.heading = heading
      user.latLng = { latitude: heading.lat, longitude: heading.lng }

      let found = false

      for (var i = 0; i < userIds.length; i++) {
        const otherUserId = userIds[i]
        if (otherUserId !== id) {
          const otherUser = users[otherUserId]
          if (otherUser.latLng) {
            const rhumbLine = geolib.getRhumbLineBearing(user.latLng, otherUser.latLng);
            const deg = Math.abs(rhumbLine - 180)
            found = true
            user.emit("peer:found", otherUserId)
            otherUser.emit("peer:found", id)
            break;
            /*          if (deg - 175 > 0) {
                        console.log("rhumbLine", rhumbLine);
                        console.log("\n");
                      }*/
          }
        }
      }
    }))

  }))
}
