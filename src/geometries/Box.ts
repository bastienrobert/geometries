import { Geometry } from '~/@types/index'

import Plane from './Plane'

interface Options {
  width?: number
  height?: number
  depth?: number
  widthSegments?: number
  heightSegments?: number
  depthSegments?: number
}

interface Face {
  [key: string]: number[]
}

export default class BoxGeometry implements Geometry {
  public vertices: number[]
  public indices: number[]
  public normals: number[]
  public uvs: number[]

  public width: number
  public height: number
  public depth: number
  public widthSegments: number
  public heightSegments: number
  public depthSegments: number
  public faces: { [key: string]: Face }

  public constructor({
    width = 1,
    height = 1,
    depth = 1,
    widthSegments = 1,
    heightSegments = 1,
    depthSegments = 1
  }: Options = {}) {
    this.width = width
    this.height = height
    this.depth = depth
    this.widthSegments = Math.floor(widthSegments)
    this.heightSegments = Math.floor(heightSegments)
    this.depthSegments = Math.floor(depthSegments)

    this.faces = {}
    this.vertices = []
    this.indices = []
    this.normals = []
    this.uvs = []

    this.generate()
  }

  public generate(): void {
    let i = 0

    this.faces.left = Plane.compute('z', 'y', 'x', -1, -1, this.depth, this.height, this.width, this.depthSegments, this.heightSegments, i) // prettier-ignore
    i += this.faces.left.vertices.length / 3
    this.faces.right = Plane.compute('z', 'y', 'x', 1, -1, this.depth, this.height, -this.width, this.depthSegments, this.heightSegments, i) // prettier-ignore
    i += this.faces.right.vertices.length / 3
    this.faces.top = Plane.compute('x', 'z', 'y', 1, 1, this.width, this.depth, this.height, this.widthSegments, this.depthSegments, i) // prettier-ignore
    i += this.faces.top.vertices.length / 3
    this.faces.bottom = Plane.compute('x', 'z', 'y', 1, -1, this.width, this.depth, -this.height, this.widthSegments, this.depthSegments, i) // prettier-ignore
    i += this.faces.bottom.vertices.length / 3
    this.faces.front = Plane.compute('x', 'y', 'z', -1, -1, this.width, this.height, -this.depth, this.widthSegments, this.heightSegments, i) // prettier-ignore
    i += this.faces.front.vertices.length / 3
    this.faces.back = Plane.compute('x', 'y', 'z', 1, -1, this.width, this.height, this.depth, this.widthSegments, this.heightSegments, i) // prettier-ignore
    i += this.faces.back.vertices.length / 3

    for (let key in this.faces) {
      const face: Face = this.faces[key]
      const { vertices, indices, normals, uvs } = face

      this.vertices = this.vertices.concat(vertices)
      this.indices = this.indices.concat(indices)
      this.normals = this.normals.concat(normals)
      this.uvs = this.uvs.concat(uvs)
    }
  }
}
