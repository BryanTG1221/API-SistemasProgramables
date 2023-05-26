import pkg from 'johnny-five'

const { Board, Servo } = pkg

const board = new Board({ port: 'COM5' })

board.on('ready', function () {
  const pluma = new Servo({
    pin: 10,
    startAt: 0
  })
  board.wait(10000, () => {
    pluma.to(90)
  })
})
