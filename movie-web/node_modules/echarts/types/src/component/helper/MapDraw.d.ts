import * as graphic from '../../util/graphic';
import ExtensionAPI from '../../core/ExtensionAPI';
import GeoModel from '../../coord/geo/GeoModel';
import MapSeries from '../../chart/map/MapSeries';
import GlobalModel from '../../model/Global';
import { Payload } from '../../util/types';
import GeoView from '../geo/GeoView';
import MapView from '../../chart/map/MapView';
declare class MapDraw {
    private uid;
    private _controller;
    private _controllerHost;
    readonly group: graphic.Group;
    /**
     * This flag is used to make sure that only one among
     * `pan`, `zoom`, `click` can occurs, otherwise 'selected'
     * action may be triggered when `pan`, which is unexpected.
     */
    private _mouseDownFlag;
    private _mapName;
    private _initialized;
    private _regionsGroup;
    private _backgroundGroup;
    constructor(api: ExtensionAPI);
    draw(mapOrGeoModel: GeoModel | MapSeries, ecModel: GlobalModel, api: ExtensionAPI, fromView: MapView | GeoView, payload: Payload): void;
    remove(): void;
    private _updateBackground;
    private _updateController;
    private _updateMapSelectHandler;
}
export default MapDraw;
