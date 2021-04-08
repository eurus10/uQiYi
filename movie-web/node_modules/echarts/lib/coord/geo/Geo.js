
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/


/**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */

/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
import { __extends } from "tslib";
import * as zrUtil from 'zrender/lib/core/util';
import BoundingRect from 'zrender/lib/core/BoundingRect';
import View from '../View';
import geoSourceManager from './geoSourceManager';
import { SINGLE_REFERRING } from '../../util/model';

var Geo =
/** @class */
function (_super) {
  __extends(Geo, _super);
  /**
   * For backward compatibility, the orginal interface:
   * `name, map, geoJson, specialAreas, nameMap` is kept.
   *
   * @param map Map type Specify the positioned areas by left, top, width, height.
   * @param [nameMap] Specify name alias
   */


  function Geo(name, map, nameMap, invertLongitute) {
    var _this = _super.call(this, name) || this;

    _this.dimensions = ['lng', 'lat'];
    _this.type = 'geo';
    _this.map = map;
    var source = geoSourceManager.load(map, nameMap);
    _this._nameCoordMap = source.nameCoordMap;
    _this._regionsMap = source.regionsMap;
    _this._invertLongitute = invertLongitute == null ? true : invertLongitute;
    _this.regions = source.regions;
    _this._rect = source.boundingRect;
    return _this;
  }
  /**
   * Whether contain the given [lng, lat] coord.
   */


  Geo.prototype.containCoord = function (coord) {
    var regions = this.regions;

    for (var i = 0; i < regions.length; i++) {
      if (regions[i].contain(coord)) {
        return true;
      }
    }

    return false;
  };

  Geo.prototype.transformTo = function (x, y, width, height) {
    var rect = this.getBoundingRect();
    var invertLongitute = this._invertLongitute;
    rect = rect.clone();

    if (invertLongitute) {
      // Longitute is inverted
      rect.y = -rect.y - rect.height;
    }

    var rawTransformable = this._rawTransformable;
    rawTransformable.transform = rect.calculateTransform(new BoundingRect(x, y, width, height));
    rawTransformable.decomposeTransform();

    if (invertLongitute) {
      rawTransformable.scaleY = -rawTransformable.scaleY;
    }

    rawTransformable.updateTransform();

    this._updateTransform();
  };

  Geo.prototype.getRegion = function (name) {
    return this._regionsMap.get(name);
  };

  Geo.prototype.getRegionByCoord = function (coord) {
    var regions = this.regions;

    for (var i = 0; i < regions.length; i++) {
      if (regions[i].contain(coord)) {
        return regions[i];
      }
    }
  };
  /**
   * Add geoCoord for indexing by name
   */


  Geo.prototype.addGeoCoord = function (name, geoCoord) {
    this._nameCoordMap.set(name, geoCoord);
  };
  /**
   * Get geoCoord by name
   */


  Geo.prototype.getGeoCoord = function (name) {
    return this._nameCoordMap.get(name);
  };

  Geo.prototype.getBoundingRect = function () {
    return this._rect;
  };

  Geo.prototype.dataToPoint = function (data, noRoam, out) {
    if (typeof data === 'string') {
      // Map area name to geoCoord
      data = this.getGeoCoord(data);
    }

    if (data) {
      return View.prototype.dataToPoint.call(this, data, noRoam, out);
    }
  };

  Geo.prototype.convertToPixel = function (ecModel, finder, value) {
    var coordSys = getCoordSys(finder);
    return coordSys === this ? coordSys.dataToPoint(value) : null;
  };

  Geo.prototype.convertFromPixel = function (ecModel, finder, pixel) {
    var coordSys = getCoordSys(finder);
    return coordSys === this ? coordSys.pointToData(pixel) : null;
  };

  return Geo;
}(View);

;
zrUtil.mixin(Geo, View);

function getCoordSys(finder) {
  var geoModel = finder.geoModel;
  var seriesModel = finder.seriesModel;
  return geoModel ? geoModel.coordinateSystem : seriesModel ? seriesModel.coordinateSystem // For map series.
  || (seriesModel.getReferringComponents('geo', SINGLE_REFERRING).models[0] || {}).coordinateSystem : null;
}

export default Geo;