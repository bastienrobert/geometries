export interface Geometry {
  vertices: number[]
  indices: number[]
  normals: number[]
  uvs: number[]
  generate(): void
}
