import { Geometry } from '~/@types/index';
export interface CylinderOptions {
    radiusTop?: number;
    radiusBottom?: number;
    height?: number;
    radialSegments?: number;
    heightSegments?: number;
    openEnded?: boolean;
    thetaLength?: number;
}
export default class CylinderGeometry implements Geometry {
    vertices: number[];
    indices: number[];
    normals: number[];
    uvs: number[];
    radiusTop: number;
    radiusBottom: number;
    height: number;
    radialSegments: number;
    heightSegments: number;
    openEnded: boolean;
    thetaLength: number;
    private _index;
    private _halfHeight;
    constructor({ radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaLength }?: CylinderOptions);
    generate(): void;
    private generateTorso;
    private generateCap;
}
