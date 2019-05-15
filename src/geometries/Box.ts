import Geometry from './Geometry'

import Plane from './Plane'

export interface Options {
  width?: number
  height?: number
  depth?: number
  widthSegments?: number
  heightSegments?: number
  depthSegments?: number
}

export interface Face {
  [key: string]: number[]
}

export default class BoxGeometry extends Geometry {
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
    super()

    this.faces = {}
    this.width = width
    this.height = height
    this.depth = depth
    this.widthSegments = Math.floor(widthSegments)
    this.heightSegments = Math.floor(heightSegments)
    this.depthSegments = Math.floor(depthSegments)

    this.generate(this.width, this.height, this.depth, this.widthSegments, this.heightSegments, this.depthSegments) // prettier-ignore
  }

  public generate(
    width: number,
    height: number,
    depth: number,
    widthSegments: number,
    heightSegments: number,
    depthSegments: number
  ): void {
    let i = 0
    this.faces = {}

    this.faces.left = Plane.compute('z', 'y', 'x', -1, -1, depth, height, width, depthSegments, heightSegments, i) // prettier-ignore
    i += this.faces.left.vertices.length / 3
    this.faces.right = Plane.compute('z', 'y', 'x', 1, -1, depth, height, -width, depthSegments, heightSegments, i) // prettier-ignore
    i += this.faces.right.vertices.length / 3
    this.faces.top = Plane.compute('x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, i) // prettier-ignore
    i += this.faces.top.vertices.length / 3
    this.faces.bottom = Plane.compute('x', 'z', 'y', 1, -1, width, depth, -height, widthSegments, depthSegments, i) // prettier-ignore
    i += this.faces.bottom.vertices.length / 3
    this.faces.front = Plane.compute('x', 'y', 'z', -1, -1, width, height, -depth, widthSegments, heightSegments, i) // prettier-ignore
    i += this.faces.front.vertices.length / 3
    this.faces.back = Plane.compute('x', 'y', 'z', 1, -1, width, height, depth, widthSegments, heightSegments, i) // prettier-ignore
    i += this.faces.back.vertices.length / 3

    Object.keys(this.faces).forEach(
      (key: string): void => {
        const face: Face = this.faces[key]
        const { vertices, normals, textures, indices } = face

        this.vertices = this.vertices.concat(vertices)
        this.normals = this.normals.concat(normals)
        this.textures = this.textures.concat(textures)
        this.indices = this.indices.concat(indices)
      }
    )
  }
}
