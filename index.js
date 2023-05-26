import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import pkg from 'johnny-five'

const { Board, Proximity, Servo } = pkg
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

const board = new Board({ port: 'COM5' })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

io.on('connection', (socket) => {
  const data = {
    myBoleean: true
  }
  socket.emit('event', data)

  // Mover la inicialización del sensor dentro del evento 'ready' de la placa
  board.on('ready', function () {
    const sensorUltrasonic = new Proximity({
      controller: 'HCSR04',
      pin: 7
    })
    const pluma = new Servo({
      pin: 10,
      startAt: 0
    })

    sensorUltrasonic.on('change', () => {
      const { centimeters } = sensorUltrasonic
      socket.emit('event', centimeters)
    })
    app.get('/api/openPluma', (req, res) => {
      pluma.to(90)
      board.wait(10000, () => {
        pluma.to(0)
        res.send('Accion Ejecutada')
      })
    })
  })

  // Enviar mensaje al cliente que se ha conectado
  socket.emit('message', 'Conexion establecida')

  // Manejar desconexiones del cliente
  socket.on('disconnect', () => {
    console.log('Client has disconnected')
  })
})

server.listen(9000, () => {
  console.log('Server is running on port 9000')
})
