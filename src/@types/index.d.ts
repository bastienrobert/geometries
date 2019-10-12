export interface Geometry {
  vertices: number[]
  index: number[]
  normals: number[]
  uvs: number[]
  generate(): void
}
