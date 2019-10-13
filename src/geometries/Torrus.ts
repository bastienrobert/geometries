import { Geometry } from '~/@types/index'
import { subtract3, normalize3 } from '~/helpers'

export interface TorrusOptions {
  radius?: number
  tube?: number
  radialSegments?: number
  tubularSegments?: number
  arc?: number
}

export default class TorrusGeometry implements Geometry {
  public vertices: number[]
  public indices: number[]
  public normals: number[]
  public uvs: number[]

  public radius: number
  public tube: number
  public radialSegments: number
  public tubularSegments: number
  public arc: number

  public constructor({
    radius = 1.5,
    tube = 0.5,
    radialSegments = 10,
    tubularSegments = 100,
    arc = Math.PI * 2
  }: TorrusOptions = {}) {
    this.radius = radius
    this.tube = tube
    this.radialSegments = Math.floor(radialSegments)
    this.tubularSegments = Math.floor(tubularSegments)
    this.arc = arc

    this.vertices = []
    this.indices = []
    this.normals = []
    this.uvs = []

    this.generate()
  }

  public generate(): void {
    for (let j = 0; j <= this.radialSegments; ++j) {
      for (let i = 0; i <= this.tubularSegments; ++i) {
        const u = (i / this.tubularSegments) * this.arc
        const v = (j / this.radialSegments) * Math.PI * 2

        const vertex = [
          (this.radius + this.tube * Math.cos(v)) * Math.cos(u),
          (this.radius + this.tube * Math.cos(v)) * Math.sin(u),
          this.tube * Math.sin(v)
        ]
        this.vertices = this.vertices.concat(vertex)

        const normal = normalize3(
          subtract3(vertex, [
            this.radius * Math.cos(u),
            this.radius * Math.sin(u),
            0
          ])
        )
        this.normals = this.normals.concat(normal)

        this.uvs.push(i / this.tubularSegments, j / this.radialSegments)
      }
    }

    for (let j = 1; j <= this.radialSegments; ++j) {
      for (let i = 1; i <= this.tubularSegments; ++i) {
        const a = (this.tubularSegments + 1) * j + i - 1
        const b = (this.tubularSegments + 1) * (j - 1) + i - 1
        const c = (this.tubularSegments + 1) * (j - 1) + i
        const d = (this.tubularSegments + 1) * j + i

        this.indices.push(a, b, d)
        this.indices.push(b, c, d)
      }
    }
  }
}
