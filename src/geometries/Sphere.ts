import { Geometry } from '~/@types/index'

export interface SphereOptions {
  radius?: number
  widthSegments?: number
  heightSegments?: number
}

export default class SphereGeometry implements Geometry {
  public vertices: number[]
  public indices: number[]
  public normals: number[]
  public uvs: number[]

  public widthSegments: number
  public heightSegments: number
  public radius: number

  public constructor({
    radius = 1,
    widthSegments = 10,
    heightSegments = 10
  }: SphereOptions = {}) {
    this.widthSegments = Math.floor(widthSegments)
    this.heightSegments = Math.floor(heightSegments)
    this.radius = radius

    this.vertices = []
    this.indices = []
    this.normals = []
    this.uvs = []

    this.generate()
  }

  public generate(): void {
    for (let width = 0; width <= this.widthSegments; ++width) {
      const theta: number = (width * Math.PI) / this.widthSegments
      const sinTheta: number = Math.sin(theta)
      const cosTheta: number = Math.cos(theta)

      for (let height = 0; height <= this.heightSegments; ++height) {
        const phi: number = (height * 2 * Math.PI) / this.heightSegments
        const sinPhi: number = Math.sin(phi)
        const cosPhi: number = Math.cos(phi)

        const x: number = cosPhi * sinTheta
        const y: number = cosTheta
        const z: number = sinPhi * sinTheta
        const u: number = 1 - height / this.heightSegments
        const v: number = 1 - width / this.widthSegments

        this.vertices.push(this.radius * x, this.radius * y, this.radius * z)
        this.normals.push(x, y, z)
        this.uvs.push(u, v)
      }
    }

    for (let width = 0; width < this.widthSegments; ++width) {
      for (let height = 0; height < this.heightSegments; ++height) {
        const first: number = width * (this.heightSegments + 1) + height
        const second: number = first + this.heightSegments + 1
        this.indices.push(
          second,
          first,
          first + 1,
          second + 1,
          second,
          first + 1
        )
      }
    }
  }
}
