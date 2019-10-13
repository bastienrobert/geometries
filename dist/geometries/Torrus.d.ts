import { Geometry } from '~/@types/index';
export interface TorrusOptions {
    radius?: number;
    tube?: number;
    radialSegments?: number;
    tubularSegments?: number;
    arc?: number;
}
export default class TorrusGeometry implements Geometry {
    vertices: number[];
    indices: number[];
    normals: number[];
    uvs: number[];
    radius: number;
    tube: number;
    radialSegments: number;
    tubularSegments: number;
    arc: number;
    constructor({ radius, tube, radialSegments, tubularSegments, arc }?: TorrusOptions);
    generate(): void;
}
