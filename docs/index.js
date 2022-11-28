
async function main() {

  const { brushlib } = window
  console.log('brushlib', brushlib)

  const canvas = document.querySelector('#canvas')
  const rect = document.body.getBoundingClientRect()

  canvas.width = window.innerWidth // rect.right - rect.left
  canvas.height = window.innerHeight // rect.bottom - rect.top

  const { Painter } = await brushlib.create()
  const painter = Painter.fromCanvas(canvas)

  console.log('painter', painter)


  // painter.hover(0, 0, 0) // same as stroke() with pressure 0
  // painter.stroke(x, y, dt, pressure, xtilt, ytilt)

  // painter.stroke(0, 0, 1, 0.8, 0, 0)
  // painter.stroke(200, 200, 1, 0.8, 0, 0)
  // painter.stroke(400, 200, 1, 0.8, 0, 0)
  // painter.stroke(400, 400, 1, 0.8, 0, 0)

  painter.setBrush(brushlib.brushes[16])
  painter.setColor([140, 222, 220])

  let points

  points = [
    ...getCubicBezierPoints(
      [{ x: 800, y: 700 }, { x: 400, y: -440 }, { x: 650, y: 200 }, { x: 0, y: 400 }],
      20
    )
  ]

  for (const point of points) {
    painter.stroke(point.x, point.y, 0.1, 0.7 * Math.random() + 0.1, 0, 0)
  }

  painter.setBrush(brushlib.brushes[1])
  painter.setColor([10, 100, 180])
  points = [
    ...getCubicBezierPoints(
      [{ x: 0, y: 400 }, { x: 190, y: -140 }, { x: 200, y: 1000 }, { x: 550, y: 200 }],
      20
    ),
  ]

  for (const point of points) {
    painter.stroke(point.x, point.y, 1, 0.5 * Math.random() + 0.2, 0, 0)
  }

  // painter.setBrush(brushlib.brushes[6])
  // painter.setColor([255, 255, 0])

  // painter.stroke(200, 200, 1, 0.8, 0, 0)
  // painter.stroke(0, 600, 1, 0.8, 0, 0)
  // painter.stroke(600, 200, 1, 0.1, 0, 0)
  // // painter.stroke(200, 400, 1, 0.8, 0, 0)

  painter.setBrush(brushlib.brushes[11])
  painter.setColor([0, 255, 0])

  points = [
    ...getCubicBezierPoints(
      [{ x: 100, y: 0 }, { x: 300, y: 540 }, { x: 550, y: 200 }, { x: 600, y: 600 }],
      20
    )
  ]

  for (const point of points) {
    painter.stroke(point.x, point.y, 1, 0.8 * Math.random() + 0.2, 0, 0)
  }

  painter.setBrush(brushlib.brushes[17])
  painter.setColor([80, 80, 180])
  painter.stroke(0, 400, 1, 1, 0, 0)
  painter.stroke(800, 550, 2, 0.1, 0, 0)
  painter.stroke(0, 200, 1, 0.1, 0, 0)
  painter.stroke(800, 50, 2, 1, 0, 0)
}

main().catch(console.error)


/**
 * Line and Bezier curves
 * https://stackoverflow.com/questions/17083580/i-want-to-do-animation-of-an-object-along-a-particular-path/17096947#17096947
 */

function getPointsBetween(b, callback, numPoints = 20) {

  const points = [b[0]]
  let lastPoint = b[0]

  for (let t = 0; t <= numPoints; t++) {
    // calc another point along the curve
    const point = callback(b, t / numPoints)

    // Add the point if it's not already in the points[] array
    const dx = point.x - lastPoint.x
    const dy = point.y - lastPoint.y
    const d = Math.sqrt(dx * dx + dy * dy)
    const dInt = parseInt(d)
    if (dInt > 0 || t === numPoints) {
      lastPoint = point
      points.push(point)
    }
  }
  return points
}

function getLinePoints(b, numPoints) {
  return getPointsBetween(b, getLineXYatPercent, numPoints)
}
function getQuadraticBezierPoints(b, numPoints) {
  return getPointsBetween(b, getQuadraticBezierXYatTime, numPoints)
}
function getCubicBezierPoints(b, numPoints) {
  return getPointsBetween(b, getCubicBezierXYatTime, numPoints)
}

// Given the 4 control points on a Bezier curve
// Get x,y at interval T along the curve (0<=t<=1)
// The curve starts when t==0 and ends when t==1
function getCubicBezierXYatTime(b, t) {
  const [startPoint, controlPoint1, controlPoint2, endPoint] = b
  const x = CubicN(t, startPoint.x, controlPoint1.x, controlPoint2.x, endPoint.x)
  const y = CubicN(t, startPoint.y, controlPoint1.y, controlPoint2.y, endPoint.y)
  return ({ x, y })
}

// Cubic helper formula
function CubicN(t, a, b, c, d) {
  const t2 = t * t
  const t3 = t2 * t
  return a + (-a * 3 + t * (3 * a - a * t)) * t + (3 * b + t * (-6 * b + b * 3 * t)) * t + (c * 3 - c * 3 * t) * t2 + d * t3
}

function getQuadraticBezierXYatTime(b, t) {
  const [startPoint, controlPoint, endPoint] = b
  const x = Math.pow(1 - t, 2) * startPoint.x + 2 * (1 - t) * t * controlPoint.x + Math.pow(t, 2) * endPoint.x
  const y = Math.pow(1 - t, 2) * startPoint.y + 2 * (1 - t) * t * controlPoint.y + Math.pow(t, 2) * endPoint.y
  return ({ x, y })
}

function getLineXYatPercent(b, t) {
  const [startPoint, endPoint] = b
  const dx = endPoint.x - startPoint.x
  const dy = endPoint.y - startPoint.y
  const x = startPoint.x + dx * t
  const y = startPoint.y + dy * t
  return ({ x, y })
}

function drawPoints(points) {
  ctx.fillStyle = 'red'
  // don't draw the last dot b/ its radius will display past the curve
  for (let i = 0; i < points.length - 1; i++) {
    ctx.beginPath()
    ctx.arc(points[i].x, points[i].y, 1, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawBezier(b) {
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.moveTo(b[0].x, b[0].y)
  ctx.bezierCurveTo(b[1].x, b[1].y, b[2].x, b[2].y, b[3].x, b[3].y)
  ctx.stroke()
}

