import pkg from 'johnny-five'
const { Board, Ultrasonic, Servo } = pkg

const board = new Board({ port: 'COM5' }) // Reemplaza '/dev/ttyACM0' con el puerto correcto para tu Arduino

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
