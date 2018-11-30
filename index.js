const http = require("http")
const getRawBody = require("raw-body")
const contentType = require('content-type')

const SOCKET_PORT = process.env.SOCKET_PORT || 5001
const socketServer = require("socket.io").listen(SOCKET_PORT)
socketServer.on("connection", socket => {
  console.debug("Client connected")
  socket.on("disconnect", () => {
    socket.disconnect()
  })
})

const HTTP_PORT = process.env.HTTP_PORT || 3001

function requestHandler(request, response) {
  const { headers, url:path, method } = request
  let encoding = true
  try {
    encoding = contentType.parse(request).parameters.charset
  } catch (err) {
  }
  getRawBody(request, {
    length: headers['content-length'],
    limit: '1mb',
    encoding,
  }, function (err, body) {
    if (err) return response.end(err)
    
    response.end('')
    socketServer.sockets.emit("request", {
      headers,
      path,
      method,
      body,
    })
  })
}

const httpServer = http.createServer(requestHandler)
httpServer.listen(HTTP_PORT, error => {
  if (error) {
    console.error(error)
    process.exit(-1)
  }
  console.info(`webhook2websocket listening on ${HTTP_PORT}`)
})
