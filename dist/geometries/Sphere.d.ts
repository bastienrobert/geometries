import { Geometry } from '~/@types/index';
export interface SphereOptions {
    radius?: number;
    widthSegments?: number;
    heightSegments?: number;
}
export default class SphereGeometry implements Geometry {
    vertices: number[];
    indices: number[];
    normals: number[];
    uvs: number[];
    widthSegments: number;
    heightSegments: number;
    radius: number;
    constructor({ radius, widthSegments, heightSegments }?: SphereOptions);
    generate(): void;
}
