import express from 'express'
import { createServer } from 'http'
import routes from './routes/routes.js'
import { Server } from 'socket.io'
import pkg from 'johnny-five'

const { Board, Proximity, Led } = pkg
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

const board = new Board({ port: 'COM6' })

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
    const led = new Led(11)

    sensorUltrasonic.on('change', () => {
      const { centimeters, inches } = sensorUltrasonic
      socket.emit('event', centimeters)
    })
    app.get('/api/openPluma', (req, res) => {
      led.fadeIn()
      board.wait(5000, () => {
        led.fadeOut()
        res.send('Terminado')
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
