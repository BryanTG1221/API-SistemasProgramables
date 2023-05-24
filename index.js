import express from 'express'
import { createServer } from 'http'
import routes from './routes/routes.js'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

io.on('connection', (socket) => {
  console.log('Nueva conexion')

  const data = {
    myBoleean: true
  }
  socket.emit('event', data)

  // Enviar mensaje al cliente que se ha conectado
  socket.emit('message', 'Conexion establecida')

  // Manejar desconexiones del cliente
  socket.on('disconnect', () => {
    console.log('Client has disconnected')
  })
})

app.use('/api', routes)

server.listen(9000, () => {
  console.log('Server is running on port 9000')
})
