import { mat4 } from 'https://cdn.pika.dev/gl-matrix/v3'

const vertexSource = document.getElementById('vertex-shader').textContent
const fragmentSource = document.getElementById('fragment-shader').textContent

export default class Geometry {
  static createShader(gl, src, type) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, src)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Error compiling shader: ' + src, gl.getShaderInfoLog(shader)) // prettier-ignore
      gl.deleteShader(shader)
      return null
    }

    return shader
  }

  static createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Error linking shader program: ', gl.getProgramInfoLog(program)) // prettier-ignore
      gl.deleteProgram(program)
      return null
    }

    return program
  }

  constructor(gl, scissor, attributes) {
    this.gl = gl
    this.scissor = scissor

    if (!attributes) {
      console.error('attributes should be provided to geometry')
    }

    const vertexShader = Geometry.createShader(
      this.gl,
      vertexSource,
      this.gl.VERTEX_SHADER
    )
    const fragmentShader = Geometry.createShader(
      this.gl,
      fragmentSource,
      this.gl.FRAGMENT_SHADER
    )
    if (!vertexShader || !fragmentShader) return

    this.program = Geometry.createProgram(this.gl, vertexShader, fragmentShader)
    if (!this.program) return

    this.gl.useProgram(this.program)

    this.attributes = {}
    this.attributeLocations = {}
    this.getAttribLocations()
    for (let key in attributes) {
      this.addAttribute(key, attributes[key])
    }
    this.createUniforms()

    this.orbital = false
    this.angle = [0, Math.PI / 4, 0]
    this.previousAngle = [0, 0, 0]
    this.deltaAngle = [0, 0, 0]
    this.identityMatrix = mat4.create()
    this.xRotation = mat4.create()
    this.zRotation = mat4.create()
  }

  addAttribute(key, attr = {}) {
    attr.size = attr.size || 1
    attr.type = attr.type || key === 'indices' ? this.gl.UNSIGNED_SHORT : this.gl.FLOAT // prettier-ignore
    attr.target = key === 'indices' ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER // prettier-ignore
    attr.buffer = this.gl.createBuffer()
    attr.isStatic = attr.isStatic || true
    attr.normalize = attr.normalize || false
    attr.count = attr.data.length / attr.size

    this.attributes[key] = attr
    this.updateAttribute(attr)
  }

  updateAttribute(attr) {
    this.gl.bindBuffer(attr.target, attr.buffer)
    this.gl.bufferData(
      attr.target,
      attr.data,
      attr.isStatic ? this.gl.STATIC_DRAW : this.gl.DYNAMIC_DRAW
    )
    this.gl.bindBuffer(attr.target, null)
  }

  getAttribLocations() {
    this.attributeLocations = {}
    const numberOfAttributes = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES) // prettier-ignore
    for (let i = 0; i < numberOfAttributes; i++) {
      const attribute = this.gl.getActiveAttrib(this.program, i)
      this.attributeLocations[attribute.name] = this.gl.getAttribLocation(this.program, attribute.name) // prettier-ignore
    }
  }

  bindAttributes() {
    Object.keys(this.attributeLocations).forEach(name => {
      const location = this.attributeLocations[name]
      const attr = this.attributes[name]

      if (!attr) {
        console.warn('active attribute ' + name + ' not being supplied')
        return
      }

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attr.buffer)
      this.gl.vertexAttribPointer(
        location,
        attr.size,
        attr.type,
        attr.normalize,
        0,
        0
      )
      this.gl.enableVertexAttribArray(location)
    })

    if (this.attributes.indices) {
      this.gl.bindBuffer(
        this.gl.ELEMENT_ARRAY_BUFFER,
        this.attributes.indices.buffer
      )
    }
  }

  createUniforms() {
    this.worldUniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_world'
    )
    this.viewUniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_view'
    )
    this.projectionUniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_projection'
    )

    this.worldMatrix = mat4.create()
    this.viewMatrix = mat4.create()
    this.projectionMatrix = mat4.create()

    // prettier-ignore
    mat4.lookAt(
      this.viewMatrix,
      [0, 0, -6],
      [0, 0, 0],
      [0, 1, 0]
    )
    mat4.perspective(
      this.projectionMatrix,
      Math.PI / 4,
      this.scissor.width / this.scissor.height,
      0.1,
      1000
    )

    this.gl.uniformMatrix4fv(
      this.worldUniformLocation,
      this.gl.FALSE,
      this.worldMatrix
    )
    this.gl.uniformMatrix4fv(
      this.viewUniformLocation,
      this.gl.FALSE,
      this.viewMatrix
    )
    this.gl.uniformMatrix4fv(
      this.projectionUniformLocation,
      this.gl.FALSE,
      this.projectionMatrix
    )
  }

  setScissor() {
    this.gl.scissor(
      this.scissor.left,
      this.scissor.scroll,
      this.scissor.width,
      this.scissor.height
    )
    this.gl.viewport(
      this.scissor.left,
      this.scissor.scroll,
      this.scissor.width,
      this.scissor.height
    )
  }

  startOrbit() {
    this.orbital = true
    this.previousAngle = this.angle.slice(0)
    this.deltaAngle = [0, 0, 0]
  }

  setOrbit(x, z) {
    this.deltaAngle = [x, 0, z]
  }

  stopOrbit() {
    this.orbital = false
  }

  applyRotation() {
    if (this.orbital) {
      this.angle[0] = this.previousAngle[0] + this.deltaAngle[0]
      this.angle[2] = this.previousAngle[2] + this.deltaAngle[2]
    } else {
      this.angle[0] += 0.01
      this.angle[2] += 0.005
    }
    mat4.rotate(this.xRotation, this.identityMatrix, this.angle[0], [0, 1, 0])
    mat4.rotate(this.zRotation, this.identityMatrix, this.angle[2], [1, 0, 0])
    mat4.multiply(this.worldMatrix, this.zRotation, this.xRotation)
    this.gl.uniformMatrix4fv(
      this.worldUniformLocation,
      this.gl.FALSE,
      this.worldMatrix
    )
  }

  draw() {
    this.gl.useProgram(this.program)
    this.bindAttributes()
    this.applyRotation()

    this.setScissor()
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.gl.clearColor(1, 1, 1, 1)

    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.attributes.indices.count,
      this.attributes.indices.type,
      0
    )
  }
}
