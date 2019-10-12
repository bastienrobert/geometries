import { Geometry } from '~/@types/index';
export interface PlaneOptions {
    width?: number;
    height?: number;
    widthSegments?: number;
    heightSegments?: number;
}
export interface PlaneComputeOptions {
    [key: string]: number[];
}
export default class Plane implements Geometry {
    vertices: number[];
    index: number[];
    normals: number[];
    uvs: number[];
    width: number;
    height: number;
    widthSegments: number;
    heightSegments: number;
    constructor({ width, height, widthSegments, heightSegments }?: PlaneOptions);
    generate(): void;
    static compute(u: string, v: string, w: string, udir: number, vdir: number, width: number, height: number, depth: number, gridX: number, gridY: number, firstIndex?: number): PlaneComputeOptions;
}
