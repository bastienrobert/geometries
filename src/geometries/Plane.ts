import { Geometry } from '~/@types/index'

export interface PlaneOptions {
  width?: number
  height?: number
  widthSegments?: number
  heightSegments?: number
}

export interface PlaneComputeOptions {
  [key: string]: number[]
}

export default class Plane implements Geometry {
  public vertices: number[]
  public index: number[]
  public normals: number[]
  public uvs: number[]

  public width: number
  public height: number
  public widthSegments: number
  public heightSegments: number

  public constructor({
    width = 1,
    height = 1,
    widthSegments = 1,
    heightSegments = 1
  }: PlaneOptions = {}) {
    this.width = width
    this.height = height
    this.widthSegments = Math.floor(widthSegments)
    this.heightSegments = Math.floor(heightSegments)

    this.vertices = []
    this.uvs = []
    this.normals = []
    this.index = []

    this.generate()
  }

  public generate(): void {
    const { vertices, index, normals, uvs } = Plane.compute(
      'x',
      'y',
      'z',
      1,
      -1,
      this.width,
      this.height,
      0,
      this.widthSegments,
      this.heightSegments
    )

    this.vertices = vertices
    this.index = index
    this.normals = normals
    this.uvs = uvs
  }

  public static compute(
    u: string,
    v: string,
    w: string,
    udir: number,
    vdir: number,
    width: number,
    height: number,
    depth: number,
    gridX: number,
    gridY: number,
    firstIndex: number = 0
  ): PlaneComputeOptions {
    let vertices: number[] = []
    let index: number[] = []
    let normals: number[] = []
    let uvs: number[] = []

    const segmentWidth: number = width / gridX
    const segmentHeight: number = height / gridY

    let vec3: { [index: string]: number } = {}

    for (let i = 0; i <= gridY; i++) {
      const y: number = i * segmentHeight - height / 2

      for (let j = 0; j <= gridX; j++) {
        const x: number = j * segmentWidth - width / 2

        vec3[u] = x * udir
        vec3[v] = y * vdir
        vec3[w] = depth / 2
        vertices.push(vec3.x, vec3.y, vec3.z)

        vec3[u] = 0
        vec3[v] = 0
        vec3[w] = depth > 0 ? 1 : -1
        normals.push(vec3.x, vec3.y, vec3.z)

        uvs.push(j / gridX)
        uvs.push(1 - i / gridY)
      }
    }

    for (let i = 0; i < gridY; i++) {
      for (let j = 0; j < gridX; j++) {
        const a: number = firstIndex + j + (gridX + 1) * i
        const b: number = firstIndex + j + (gridX + 1) * (i + 1)
        const c: number = firstIndex + j + 1 + (gridX + 1) * (i + 1)
        const d: number = firstIndex + j + 1 + (gridX + 1) * i

        index.push(a, b, d)
        index.push(b, c, d)
      }
    }

    return {
      vertices,
      normals,
      uvs,
      index
    }
  }
}
