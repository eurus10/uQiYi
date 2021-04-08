import BoundingRect from 'zrender/lib/core/BoundingRect';
import View from '../View';
import Region from './Region';
import { NameMap } from './geoTypes';
import GlobalModel from '../../model/Global';
import { ParsedModelFinder } from '../../util/model';
import GeoModel from './GeoModel';
import { resizeGeoType } from './geoCreator';
declare class Geo extends View {
    dimensions: string[];
    type: string;
    readonly map: string;
    private _nameCoordMap;
    private _regionsMap;
    private _invertLongitute;
    readonly regions: Region[];
    aspectScale: number;
    model: GeoModel;
    resize: resizeGeoType;
    /**
     * For backward compatibility, the orginal interface:
     * `name, map, geoJson, specialAreas, nameMap` is kept.
     *
     * @param map Map type Specify the positioned areas by left, top, width, height.
     * @param [nameMap] Specify name alias
     */
    constructor(name: string, map: string, nameMap?: NameMap, invertLongitute?: boolean);
    /**
     * Whether contain the given [lng, lat] coord.
     */
    containCoord(coord: number[]): boolean;
    transformTo(x: number, y: number, width: number, height: number): void;
    getRegion(name: string): Region;
    getRegionByCoord(coord: number[]): Region;
    /**
     * Add geoCoord for indexing by name
     */
    addGeoCoord(name: string, geoCoord: number[]): void;
    /**
     * Get geoCoord by name
     */
    getGeoCoord(name: string): number[];
    getBoundingRect(): BoundingRect;
    dataToPoint(data: number[], noRoam?: boolean, out?: number[]): number[];
    convertToPixel(ecModel: GlobalModel, finder: ParsedModelFinder, value: number[]): number[];
    convertFromPixel(ecModel: GlobalModel, finder: ParsedModelFinder, pixel: number[]): number[];
}
export default Geo;
