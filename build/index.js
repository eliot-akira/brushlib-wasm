
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

  console.log(rect)

  const { Painter } = await brushlib.create()
  const painter = Painter.fromCanvas(canvas)

  console.log('painter', painter)

  painter.setBrush(state.brush)
  painter.setColor(state.color)

  // painter.hover(0, 0, 0) // same as stroke() with pressure 0
  painter.stroke(0, 0, 1, state.pressure, state.xtilt, state.ytilt)
  painter.stroke(200, 200, 1, state.pressure, state.xtilt, state.ytilt)
  painter.stroke(400, 200, 1, state.pressure, state.xtilt, state.ytilt)
  painter.stroke(400, 400, 1, state.pressure, state.xtilt, state.ytilt)
}

main().catch(console.error)