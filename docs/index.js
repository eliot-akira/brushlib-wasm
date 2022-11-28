
console.log('brushlib', brushlib)

const state = {
  color: [10, 100, 180],
  brush: brushlib.brushes[1],
  pressure: 0.8,
  xtilt: 0,
  ytilt: 0
}

async function main() {

  const canvas = document.querySelector('#canvas')
  const rect = document.body.getBoundingClientRect()

  canvas.width = window.innerWidth // rect.right - rect.left
  canvas.height = window.innerHeight // rect.bottom - rect.top

  const { Painter } = await brushlib.create()
  const painter = Painter.fromCanvas(canvas)

  console.log('painter', painter)

  painter.setBrush(state.brush)
  painter.setColor(state.color)

  // painter.hover(0, 0, 0) // same as stroke() with pressure 0
  // painter.stroke(x, y, dt, pressure, xtilt, ytilt)

  painter.stroke(0, 0, 1, 0.8, 0, 0)
  painter.stroke(200, 200, 1, 0.8, 0, 0)
  painter.stroke(400, 200, 1, 0.8, 0, 0)
  painter.stroke(400, 400, 1, 0.8, 0, 0)


  painter.setBrush(brushlib.brushes[5])
  painter.setColor([200, 0, 280])

  painter.stroke(600, 400, 1, 0.01, 0, 0)
  painter.stroke(200, 400, 1, 1, 0, 0)

  painter.setBrush(brushlib.brushes[6])
  painter.setColor([255, 255, 0])

  painter.stroke(200, 400, 1, 0.8, 0, 0)
  painter.stroke(200, 600, 1, 0.8, 0, 0)
  painter.stroke(400, 600, 1, 0.8, 0, 0)
  painter.stroke(200, 400, 1, 0.8, 0, 0)

  painter.setBrush(brushlib.brushes[11])
  painter.setColor([0, 255, 0])

  painter.stroke(200, 400, 1, 0.8, 0, 0)
  painter.stroke(200, 200, 1, 0.8, 0, 0)
  painter.stroke(600, 400, 1, 0.8, 0, 0)


  painter.setBrush(brushlib.brushes[26])
  painter.setColor([0, 255, 255])

  painter.stroke(200, 400, 1, 0.8, 0, 0)
  painter.stroke(600, 0, 1, 0.3, 0, 0)
  painter.stroke(600, 600, 1, 0.8, 0, 0)
}

main().catch(console.error)