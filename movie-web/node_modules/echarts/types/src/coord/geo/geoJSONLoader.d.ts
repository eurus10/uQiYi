import { GeoJSONMapRecord } from './mapDataStorage';
import BoundingRect from 'zrender/lib/core/BoundingRect';
import Region from './Region';
declare type MapRecordInner = {
    parsed: {
        regions: Region[];
        boundingRect: BoundingRect;
    };
};
declare const _default: {
    load(mapName: string, mapRecord: GeoJSONMapRecord, nameProperty: string): MapRecordInner['parsed'];
};
export default _default;
