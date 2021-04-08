import BoundingRect from 'zrender/lib/core/BoundingRect';
import { GeoJSON } from './geoTypes';
declare class Region {
    readonly geometries: {
        type: 'polygon';
        exterior: number[][];
        interiors?: number[][][];
    }[];
    readonly name: string;
    center: number[];
    properties: GeoJSON['features'][0]['properties'];
    private _rect;
    constructor(name: string, geometries: Region['geometries'], cp: GeoJSON['features'][0]['properties']['cp']);
    getBoundingRect(): BoundingRect;
    contain(coord: number[]): boolean;
    transformTo(x: number, y: number, width: number, height: number): void;
    cloneShallow(name: string): Region;
}
export default Region;
