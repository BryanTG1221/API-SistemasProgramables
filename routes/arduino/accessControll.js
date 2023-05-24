import pkg from 'johnny-five'
import SerialPort from 'serialport'
const { Board, Ultrasonic, Servo } = pkg

const board = new Board({ port: '/dev/ttyACM0' }) // Reemplaza '/dev/ttyACM0' con el puerto correcto para tu Arduino

board.on('ready', () => {
  const ultrasonic = new Ultrasonic({
    pin: 9,
    controller: 'HCSR04',
    isAnalog: false
  })

  const servo = new Servo(10)

  const distanciaUmbral = 30

  setInterval(() => {
    ultrasonic.ping((err, distance) => {
      if (!err) {
        console.log(`Distancia: ${distance} cm`)

        if (distance <= distanciaUmbral) {
          servo.to(180)
          console.log('Abrir')
        } else {
          servo.to(0)
          console.log('Cerrar')
        }
      } else {
        console.log('Error al leer la distancia:', err)
      }
    })
  }, 1000)
})

// Código para establecer la comunicación serie
const port = new SerialPort('/dev/ttyACM0', { // Reemplaza '/dev/ttyACM0' con el puerto correcto para tu Arduino
  baudRate: 9600
})

port.on('open', () => {
  console.log('Conexión serie establecida')

  port.on('data', (data) => {
    console.log('Datos recibidos:', data.toString())
    // Haz algo con los datos recibidos
  })
})
