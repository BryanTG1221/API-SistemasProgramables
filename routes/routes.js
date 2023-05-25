import express from 'express'
import pkg from 'johnny-five'
const { Led } = pkg
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello World')
})

router.get('/openPluma', (req, res) => {
  res.send('Abrir Pluma')
  const ledAzul = new Led(13)
  ledAzul.pulse()
  board.wait(10000, () => {
    ledAzul.stop().off()
  })
})

export default router
