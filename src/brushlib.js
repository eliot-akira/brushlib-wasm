
exports.create = function create() {

  // Emscripten provides Module

  // eslint-disable-next-line no-undef
  return Module().then((Module) => {

    /**
     * Bindings
     */

    function createGetColorProxy(Module, getColor) {
      return function (x, y, radius, rPointer, gPointer, bPointer, aPointer) {
        const result = getColor(x, y, radius)

        Module.setValue(rPointer, result[0], 'float')
        Module.setValue(gPointer, result[1], 'float')
        Module.setValue(bPointer, result[2], 'float')
        Module.setValue(aPointer, result[3], 'float')
      }
    }

    function loadBrush(brush) {
      const bindings = this
      const settings = brush.settings

      bindings.new_brush()

      forEachKeyIn(settings, function (settingName, setting) {
        bindings.set_brush_base_value(settingName, (setting.base_value || 0.0))

        forEachKeyIn(setting.inputs, function (inputName, input) {
          bindings.set_brush_mapping_n(settingName, inputName, (input.length))

          input.forEach(function (point, index) {
            bindings.set_brush_mapping_point(settingName, inputName, index, point[0], point[1])
          })
        })
      })

      bindings.reset_brush()
    }

    class Bindings {
      constructor(drawDab, getColor) {

        const colorProxyPtr = Module.addFunction(createGetColorProxy(Module, getColor),
          // (x, y, radius, rPointer, gPointer, bPointer, aPointer)
          // f32 f32 f32  i32 i32 i32 i32
          'ifffffff'
        )
        const drawDabProxyPtr = Module.addFunction(drawDab,
          // x,y,radius,r,g,b, a, hardness, alphaEraser, aspectRatio, angle, lockAlpha, colorize
          // f32 f32 f32 f32 f32  f32 f32 f32 f32 f32  f32 f32 f32
          'i' + ('f'.repeat(13))
        )

        Module.ccall('init', 'void', ['number', 'number'], [drawDabProxyPtr, colorProxyPtr])

        this.Module = Module
        // https://emscripten.org/docs/api_reference/preamble.js.html#cwrap
        this.stroke_to = Module.cwrap('stroke_to', 'void',
          ['number', 'number', 'number', 'number', 'number', 'number']
          // float x, float y, float pressure, float xtilt, float ytilt, double dtime
        )

        this.load_brush = bind(loadBrush, this)
        this.new_brush = Module.cwrap('new_brush')
        this.reset_brush = Module.cwrap('reset_brush')

        // Using the slower ccall() method, because cwrap() has a weird bug on FF when using strings :(
        this.set_brush_base_value = function (name, value) {
          Module.ccall('set_brush_base_value', 'void', ['string', 'number'], [name, value])
        }

        this.set_brush_mapping_n = function (name, mapping, n) {
          Module.ccall('set_brush_mapping_n', 'void', ['string', 'string', 'number'], [name, mapping, n])
        }

        this.set_brush_mapping_point = function (name, mapping, index, x, y) {
          Module.ccall('set_brush_mapping_point', 'void',
            ['string', 'string', 'number', 'number', 'number'], [name, mapping, index, x, y])
        }
      }
    }


    /**
     * Painter
     */
    const canvasRenderer = {
      getColor: function (x, y, radius) {
        console.log('Get color', x, y, radius)
        const image = this.getImageData(x, y, 1, 1)
        const pixel = image.data

        pixel[0] /= 255
        pixel[1] /= 255
        pixel[2] /= 255
        pixel[3] /= 255

        return pixel
      },

      createFill: function (ctx, radius, hardness, r, g, b, a) {

        const rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'

        if (hardness >= 1) {
          return rgba
        }

        const fill = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)

        fill.addColorStop(hardness, rgba)
        fill.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)')

        return fill
      },

      /* taken form https://github.com/yapcheahshen/brushlib.js by Yap Cheah Shen :)  */
      drawDab: function (
        x, y, radius,
        r, g, b, a,
        hardness, alphaEraser, aspectRatio, angle,
        lockAlpha, colorize
      ) {

        // console.log('drawDab', x, y, radius, r, g, b, a, hardness, alphaEraser, aspectRatio, angle, lockAlpha, colorize)

        if (a === 0) { return }

        r = Math.floor(r * 256)
        g = Math.floor(g * 256)
        b = Math.floor(b * 256)
        hardness = Math.max(hardness, 0)

        const height = (radius * 2 / aspectRatio) / 2
        const width = (radius * 2 * 1.3) / 2
        const fill = canvasRenderer.createFill(this, radius, hardness, r, g, b, a)

        this.save()
        this.beginPath()


        // Eraser hack
        if (alphaEraser === 0) {
          this.globalCompositeOperation = 'destination-out'
        }

        this.translate(x, y)
        this.rotate(90 + angle)
        this.moveTo(0, -height)
        this.bezierCurveTo(width, -height, width, height, 0, height)
        this.bezierCurveTo(-width, height, -width, -height, 0, -height)
        this.fillStyle = fill
        this.fill()

        this.closePath()
        this.restore()
      }
    }

    class Painter {
      constructor(bindings) {
        this._bindings = bindings
      }

      // static
      static fromCanvas(ctx) {
        ctx = isFunction(ctx.getContext) ? ctx.getContext('2d') : ctx
        return new Painter(new Bindings(bind(canvasRenderer.drawDab, ctx), bind(canvasRenderer.getColor, ctx)))
      }

      setBrush(brush) {
        this._bindings.load_brush(brush)
        return this
      }

      setColor(r, g, b) {
        const hsv = Array.isArray(r) ? rgb2hsv.apply(null, r) : rgb2hsv(r, g, b)

        this._bindings.set_brush_base_value('color_h', hsv.h)
        this._bindings.set_brush_base_value('color_s', hsv.s)
        this._bindings.set_brush_base_value('color_v', hsv.v)

        return this
      }

      newStroke(x, y) {
        this._bindings.reset_brush()
        return this.hover(x, y, 10)
      }

      stroke(x, y, dt, pressure, xtilt, ytilt) {
        pressure = isNumber(pressure) ? pressure : 0.5
        xtilt = (xtilt || 0.0)
        ytilt = (ytilt || 0.0)
        dt = (dt || 0.1)

        this._bindings.stroke_to(x, y, pressure, 0, ytilt, dt)
        return this
      }

      hover(x, y, dt) {
        return this.stroke(x, y, dt, 0, 0, 0)
      }
    }

    return {
      Painter,
      Bindings
    }
  })
}


/**
 * Utility functions
 */

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply)
}

function isNumber(value) {
  return (typeof value === 'number')
}

function bind(func, ctx) {
  return function () { return func.apply(ctx, arguments) }
}

function forEachKeyIn(obj, iteratee) {
  Object.keys(obj || {}).forEach(function (key) { iteratee(key, obj[key]) })
}

function rgb2hsv() {
  let rr; let gg; let bb
  const r = arguments[0] / 255
  const g = arguments[1] / 255
  const b = arguments[2] / 255
  let h; let s
  const v = Math.max(r, g, b)
  const diff = v - Math.min(r, g, b)
  const diffc = function (c) {
    return (v - c) / 6 / diff + 1 / 2
  }

  if (diff === 0) {
    h = s = 0
  } else {
    s = diff / v
    rr = diffc(r)
    gg = diffc(g)
    bb = diffc(b)

    if (r === v) {
      h = bb - gg
    } else if (g === v) {
      h = (1 / 3) + rr - bb
    } else if (b === v) {
      h = (2 / 3) + gg - rr
    }
    if (h < 0) {
      h += 1
    } else if (h > 1) {
      h -= 1
    }
  }
  return {
    h,
    s,
    v
  }
}
