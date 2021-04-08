import * as matrix from 'zrender/lib/core/matrix';
import BoundingRect from 'zrender/lib/core/BoundingRect';
import Transformable from 'zrender/lib/core/Transformable';
import { CoordinateSystemMaster, CoordinateSystem } from './CoordinateSystem';
import GlobalModel from '../model/Global';
import { ParsedModelFinder } from '../util/model';
declare class View extends Transformable implements CoordinateSystemMaster, CoordinateSystem {
    readonly type: string;
    static dimensions: string[];
    readonly dimensions: string[];
    readonly name: string;
    zoomLimit: {
        max?: number;
        min?: number;
    };
    private _roamTransformable;
    protected _rawTransformable: Transformable;
    private _center;
    private _zoom;
    protected _rect: BoundingRect;
    private _viewRect;
    private _rawTransform;
    constructor(name?: string);
    setBoundingRect(x: number, y: number, width: number, height: number): BoundingRect;
    /**
     * @return {module:zrender/core/BoundingRect}
     */
    getBoundingRect(): BoundingRect;
    setViewRect(x: number, y: number, width: number, height: number): void;
    /**
     * Transformed to particular position and size
     */
    transformTo(x: number, y: number, width: number, height: number): void;
    /**
     * Set center of view
     */
    setCenter(centerCoord?: number[]): void;
    setZoom(zoom: number): void;
    /**
     * Get default center without roam
     */
    getDefaultCenter(): number[];
    getCenter(): number[];
    getZoom(): number;
    getRoamTransform(): matrix.MatrixArray;
    /**
     * Remove roam
     */
    private _updateCenterAndZoom;
    /**
     * Update transform from roam and mapLocation
     */
    protected _updateTransform(): void;
    getTransformInfo(): {
        roamTransform: number[];
        rawScaleX: number;
        rawScaleY: number;
        rawX: number;
        rawY: number;
    };
    getViewRect(): BoundingRect;
    /**
     * Get view rect after roam transform
     */
    getViewRectAfterRoam(): BoundingRect;
    /**
     * Convert a single (lon, lat) data item to (x, y) point.
     */
    dataToPoint(data: number[], noRoam?: boolean, out?: number[]): number[];
    /**
     * Convert a (x, y) point to (lon, lat) data
     */
    pointToData(point: number[]): number[];
    convertToPixel(ecModel: GlobalModel, finder: ParsedModelFinder, value: number[]): number[];
    convertFromPixel(ecModel: GlobalModel, finder: ParsedModelFinder, pixel: number[]): number[];
    /**
     * @implements
     */
    containPoint(point: number[]): boolean;
}
export default View;
