import { Geometry } from '~/@types/index'
import { normalize3 } from '~/helpers'

export interface CylinderOptions {
  radiusTop?: number
  radiusBottom?: number
  height?: number
  radialSegments?: number
  heightSegments?: number
  openEnded?: boolean
  thetaLength?: number
}

export default class CylinderGeometry implements Geometry {
  public vertices: number[]
  public indices: number[]
  public normals: number[]
  public uvs: number[]

  public radiusTop: number
  public radiusBottom: number
  public height: number
  public radialSegments: number
  public heightSegments: number
  public openEnded: boolean
  public thetaLength: number

  private _index: number
  private _halfHeight: number

  public constructor({
    radiusTop = 0.5,
    radiusBottom = 0.5,
    height = 1.5,
    radialSegments = 8,
    heightSegments = 1,
    openEnded = false,
    thetaLength = Math.PI * 2
  }: CylinderOptions = {}) {
    this.radiusTop = radiusTop
    this.radiusBottom = radiusBottom
    this.height = height
    this.radialSegments = Math.floor(radialSegments)
    this.heightSegments = Math.floor(heightSegments)
    this.openEnded = openEnded
    this.thetaLength = thetaLength

    this.vertices = []
    this.indices = []
    this.normals = []
    this.uvs = []

    this._index = 0
    this._halfHeight = this.height / 2

    this.generate()
  }

  public generate(): void {
    this.generateTorso()

    if (!this.openEnded) {
      if (this.radiusTop > 0) this.generateCap(this.radiusTop, 1)
      if (this.radiusBottom > 0) this.generateCap(this.radiusBottom, -1)
    }
  }

  private generateTorso(): void {
    const slope: number = (this.radiusBottom - this.radiusTop) / this.height
    let indexArray: number[][] = []

    for (let y = 0; y <= this.heightSegments; ++y) {
      let indexRow: number[] = []
      const v: number = y / this.heightSegments
      const radius: number =
        v * (this.radiusBottom - this.radiusTop) + this.radiusTop

      for (let x = 0; x <= this.radialSegments; ++x) {
        const u: number = x / this.radialSegments
        const theta: number = u * this.thetaLength

        const sinTheta: number = Math.sin(theta)
        const cosTheta: number = Math.cos(theta)

        this.vertices.push(
          radius * sinTheta,
          -v * this.height + this._halfHeight,
          radius * cosTheta
        )

        this.normals = this.normals.concat(
          normalize3([sinTheta, slope, cosTheta])
        )

        this.uvs.push(u, 1 - v)

        indexRow.push(this._index++)
      }

      indexArray.push(indexRow)
    }

    for (let x = 0; x < this.radialSegments; ++x) {
      for (let y = 0; y < this.heightSegments; ++y) {
        const a = indexArray[y][x]
        const b = indexArray[y + 1][x]
        const c = indexArray[y + 1][x + 1]
        const d = indexArray[y][x + 1]

        this.indices.push(a, b, d)
        this.indices.push(b, c, d)
      }
    }
  }

  private generateCap(radius: number, sign: number): void {
    const indexStart = this._index

    for (let x = 0; x <= this.radialSegments; ++x) {
      this.vertices.push(0, this._halfHeight * sign, 0)
      this.normals.push(0, sign, 0)
      this.uvs.push(0.5, 0.5)
      this._index++
    }

    const indexEnd = this._index

    for (let x = 0; x <= this.radialSegments; ++x) {
      const u = x / this.radialSegments
      const theta = u * this.thetaLength

      const cosTheta = Math.cos(theta)
      const sinTheta = Math.sin(theta)

      this.vertices.push(
        radius * sinTheta,
        this._halfHeight * sign,
        radius * cosTheta
      )
      this.normals.push(0, sign, 0)
      this.uvs.push(cosTheta * 0.5 + 0.5, sinTheta * 0.5 * sign + 0.5)
      this._index++
    }

    for (let x = 0; x < this.radialSegments; ++x) {
      const c = indexStart + x
      const i = indexEnd + x

      sign > 0 ? this.indices.push(i, i + 1, c) : this.indices.push(i + 1, i, c)
    }
  }
}
