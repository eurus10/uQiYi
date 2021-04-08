import { parseXML } from 'zrender/lib/tool/parseXML';
import { GeoSpecialAreas, GeoJSON, GeoJSONCompressed } from './geoTypes';
declare type SVGMapSource = 'string' | Document | SVGElement;
declare type GeoJSONMapSource = 'string' | GeoJSON | GeoJSONCompressed;
declare type MapInputObject = {
    geoJSON?: GeoJSONMapSource;
    geoJson?: GeoJSONMapSource;
    svg?: SVGMapSource;
    specialAreas?: GeoSpecialAreas;
};
export declare type MapRecord = GeoJSONMapRecord | SVGMapRecord;
export interface GeoJSONMapRecord {
    type: 'geoJSON';
    source: GeoJSONMapSource;
    specialAreas: GeoSpecialAreas;
    geoJSON: GeoJSON | GeoJSONCompressed;
}
export interface SVGMapRecord {
    type: 'svg';
    source: SVGMapSource;
    specialAreas: GeoSpecialAreas;
    svgXML: ReturnType<typeof parseXML>;
}
declare const _default: {
    /**
     * Compatible with previous `echarts.registerMap`.
     * @usage
     * ```js
     * $.get('USA.json', function (geoJson) {
     *     echarts.registerMap('USA', geoJson);
     *     // Or
     *     echarts.registerMap('USA', {
     *         geoJson: geoJson,
     *         specialAreas: {}
     *     })
     * });
     *
     * $.get('airport.svg', function (svg) {
     *     echarts.registerMap('airport', {
     *         svg: svg
     *     }
     * });
     *
     * echarts.registerMap('eu', [
     *     {svg: eu-topographic.svg},
     *     {geoJSON: eu.json}
     * ])
     * ```
     */
    registerMap: (mapName: string, rawDef: MapInputObject | MapRecord[] | GeoJSONMapSource, rawSpecialAreas?: GeoSpecialAreas) => MapRecord[];
    retrieveMap: (mapName: string) => MapRecord[];
};
export default _default;
