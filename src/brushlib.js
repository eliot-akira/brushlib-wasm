
exports.create = function create(canvas) {
  // Emscripten Module
  // eslint-disable-next-line no-undef
  return Module().then((Module) => {

    // Support multiple instances of Painter with canvas

    const bindings = {
      getColor: function () {},
      drawDab: function () {}
    }

    function getColorProxy(x, y, radius, rPointer, gPointer, bPointer, aPointer) {

      const result = bindings.getColor(x, y, radius)

      Module.setValue(rPointer, result[0], 'float')
      Module.setValue(gPointer, result[1], 'float')
      Module.setValue(bPointer, result[2], 'float')
      Module.setValue(aPointer, result[3], 'float')
    }

    function drawDabProxy(
      x, y, radius,
      r, g, b, a,
      hardness, alphaEraser, aspectRatio, angle,
      lockAlpha, colorize
    ) {
      bindings.drawDab(
        x, y, radius,
        r, g, b, a,
        hardness, alphaEraser, aspectRatio, angle,
        lockAlpha, colorize
      )
    }

    /**
     * Module.addFunction(function, signature)
     *
     * Signature is a string with each character being a type:
     *
     * - i = i32
     * - j = i64
     * - f = f32
     * - d = f64
     * - p = i64 (if 64-bit memory) or i32
     *
     * First character is return value.
     *
     * @see https://github.com/emscripten-core/emscripten/blob/2c7b97cff48fd3efc7020e31b25d2303f4d2a0a6/src/library_addfunction.js#L23
     */

    const colorProxyPtr = Module.addFunction(
      getColorProxy,
      // (x, y, radius, rPointer, gPointer, bPointer, aPointer)
      // f32 f32 f32  i32 i32 i32 i32
      'ifffiiii'
    )
    const drawDabProxyPtr = Module.addFunction(
      drawDabProxy,
      // x,y,radius,r,g,b, a, hardness, alphaEraser, aspectRatio, angle, lockAlpha, colorize
      // f32 f32 f32 f32 f32  f32 f32 f32 f32 f32  f32 f32 f32
      'i' + ('f'.repeat(13))
    )

    Module.ccall('init',
      'void',
      ['number', 'number'],
      [drawDabProxyPtr, colorProxyPtr]
    )

    // https://emscripten.org/docs/api_reference/preamble.js.html#cwrap
    bindings.stroke_to = Module.cwrap(
      'stroke_to',
      'void',
      // float x, float y, float pressure, float xtilt, float ytilt, double dtime
      ['number', 'number', 'number', 'number', 'number', 'number']
    )

    bindings.new_brush = Module.cwrap('new_brush')
    bindings.reset_brush = Module.cwrap('reset_brush')

    // Original comment: Using the slower ccall() method, because cwrap() has a weird bug on FF when using strings
    bindings.set_brush_base_value = function (name, value) {
      Module.ccall(
        'set_brush_base_value',
        'void',
        ['string', 'number'],
        [name, value]
      )
    }

    bindings.set_brush_mapping_n = function (name, mapping, n) {
      Module.ccall(
        'set_brush_mapping_n',
        'void',
        ['string', 'string', 'number'],
        [name, mapping, n]
      )
    }

    bindings.set_brush_mapping_point = function (name, mapping, index, x, y) {
      Module.ccall(
        'set_brush_mapping_point',
        'void',
        ['string', 'string', 'number', 'number', 'number'],
        [name, mapping, index, x, y]
      )
    }

    bindings.load_brush = function loadBrush(brush) {

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

    /**
     * Painter
     */

    class Painter {

      constructor(ctx) {
        this.ctx = isFunction(ctx.getContext) ? ctx.getContext('2d') : ctx
        this.radiusRatio = 1
      }

      setBindings() {
        // Set bindings target
        bindings.drawDab = this.drawDab
        bindings.getColor = this.getColor
      }

      setBrush(brush) {
        bindings.load_brush(brush)
        if (brush.size) this.setBrushSize(brush.size)
        return this
      }

      setColor(r, g, b) {
        const hsv = Array.isArray(r) ? rgb2hsv.apply(null, r) : rgb2hsv(r, g, b)

        bindings.set_brush_base_value('color_h', hsv.h)
        bindings.set_brush_base_value('color_s', hsv.s)
        bindings.set_brush_base_value('color_v', hsv.v)

        return this
      }

      setBrushSize(ratio) {
        this.radiusRatio = ratio
        return this
      }

      newStroke(x, y) {
        bindings.reset_brush()
        return this.hover(x, y, 10)
      }

      stroke(x, y, dt, pressure, xtilt, ytilt) {

        this.setBindings()

        pressure = isNumber(pressure) ? pressure : 0.5
        xtilt = (xtilt || 0.0)
        ytilt = (ytilt || 0.0)
        dt = (dt || 0.1)

        bindings.stroke_to(x, y, pressure, 0, ytilt, dt)

        return this
      }

      hover(x, y, dt) {
        return this.stroke(x, y, dt, 0, 0, 0)
      }

      // Canvas renderer

      getColor = (x, y, radius) => {
        const ctx = this.ctx
        const image = ctx.getImageData(x, y, 1, 1)
        const pixel = image.data

        pixel[0] /= 255
        pixel[1] /= 255
        pixel[2] /= 255
        pixel[3] /= 255

        return pixel
      }

      createFill = (radius, hardness, r, g, b, a) => {
        const ctx = this.ctx
        const rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'

        if (hardness >= 1) {
          return rgba
        }

        const fill = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)

        fill.addColorStop(hardness, rgba)
        fill.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)')

        return fill
      }

      /**
       * Based on a function from https://github.com/yapcheahshen/brushlib.js
       */
      drawDab = (
        x, y, radius = 1,
        r, g, b, a,
        hardness, alphaEraser, aspectRatio, angle,
        lockAlpha, colorize
      ) => {

        const ctx = this.ctx

        // console.log('drawDab', x, y, radius, r, g, b, a, hardness, alphaEraser, aspectRatio, angle, lockAlpha, colorize)

        if (a === 0) { return }

        r = Math.floor(r * 256)
        g = Math.floor(g * 256)
        b = Math.floor(b * 256)
        hardness = Math.max(hardness, 0)

        radius *= this.radiusRatio

        const height = (radius * 2 / aspectRatio) / 2
        const width = (radius * 2 * 1.3) / 2
        const fill = this.createFill(radius, hardness, r, g, b, a)

        ctx.save()
        ctx.beginPath()

        // Eraser hack
        if (alphaEraser === 0) {
          ctx.globalCompositeOperation = 'destination-out'
        }

        ctx.translate(x, y)
        ctx.rotate(90 + angle)
        ctx.moveTo(0, -height)
        ctx.bezierCurveTo(width, -height, width, height, 0, height)
        ctx.bezierCurveTo(-width, height, -width, -height, 0, -height)
        ctx.fillStyle = fill
        ctx.fill()

        ctx.closePath()
        ctx.restore()
      }
    }

    return new Painter(canvas)
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
