import { Geometry } from '~/@types/index';
interface Options {
    width?: number;
    height?: number;
    depth?: number;
    widthSegments?: number;
    heightSegments?: number;
    depthSegments?: number;
}
interface Face {
    [key: string]: number[];
}
export default class BoxGeometry implements Geometry {
    vertices: number[];
    indices: number[];
    normals: number[];
    uvs: number[];
    width: number;
    height: number;
    depth: number;
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
    faces: {
        [key: string]: Face;
    };
    constructor({ width, height, depth, widthSegments, heightSegments, depthSegments }?: Options);
    generate(): void;
}
export {};
