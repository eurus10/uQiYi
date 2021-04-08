
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
import * as zrUtil from 'zrender/lib/core/util';
import RoamController from './RoamController';
import * as roamHelper from '../../component/helper/roamHelper';
import { onIrrelevantElement } from '../../component/helper/cursorHelper';
import * as graphic from '../../util/graphic';
import { enableHoverEmphasis, DISPLAY_STATES } from '../../util/states';
import geoSourceManager from '../../coord/geo/geoSourceManager';
import { getUID } from '../../util/component';
import Transformable from 'zrender/lib/core/Transformable';
import { setLabelStyle, getLabelStatesModels } from '../../label/labelStyle';
import { getECData } from '../../util/innerStore';
import { createOrUpdatePatternFromDecal } from '../../util/decal';

function getFixedItemStyle(model) {
  var itemStyle = model.getItemStyle();
  var areaColor = model.get('areaColor'); // If user want the color not to be changed when hover,
  // they should both set areaColor and color to be null.

  if (areaColor != null) {
    itemStyle.fill = areaColor;
  }

  return itemStyle;
}

var MapDraw =
/** @class */
function () {
  function MapDraw(api) {
    var group = new graphic.Group();
    this.uid = getUID('ec_map_draw'); // @ts-ignore FIXME:TS

    this._controller = new RoamController(api.getZr());
    this._controllerHost = {
      target: group
    };
    this.group = group;
    group.add(this._regionsGroup = new graphic.Group());
    group.add(this._backgroundGroup = new graphic.Group());
  }

  MapDraw.prototype.draw = function (mapOrGeoModel, ecModel, api, fromView, payload) {
    var isGeo = mapOrGeoModel.mainType === 'geo'; // Map series has data. GEO model that controlled by map series
    // will be assigned with map data. Other GEO model has no data.

    var data = mapOrGeoModel.getData && mapOrGeoModel.getData();
    isGeo && ecModel.eachComponent({
      mainType: 'series',
      subType: 'map'
    }, function (mapSeries) {
      if (!data && mapSeries.getHostGeoModel() === mapOrGeoModel) {
        data = mapSeries.getData();
      }
    });
    var geo = mapOrGeoModel.coordinateSystem;

    this._updateBackground(geo);

    var regionsGroup = this._regionsGroup;
    var group = this.group;
    var transformInfo = geo.getTransformInfo(); // No animation when first draw or in action

    var isFirstDraw = !regionsGroup.childAt(0) || payload;
    var targetScaleX;
    var targetScaleY;

    if (isFirstDraw) {
      group.transform = transformInfo.roamTransform;
      group.decomposeTransform();
      group.dirty();
    } else {
      var target = new Transformable();
      target.transform = transformInfo.roamTransform;
      target.decomposeTransform();
      var props = {
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        x: target.x,
        y: target.y
      };
      targetScaleX = target.scaleX;
      targetScaleY = target.scaleY;
      graphic.updateProps(group, props, mapOrGeoModel);
    }

    regionsGroup.removeAll();
    var nameMap = zrUtil.createHashMap();
    var isVisualEncodedByVisualMap = data && data.getVisual('visualMeta') && data.getVisual('visualMeta').length > 0;
    zrUtil.each(geo.regions, function (region) {
      // Consider in GeoJson properties.name may be duplicated, for example,
      // there is multiple region named "United Kindom" or "France" (so many
      // colonies). And it is not appropriate to merge them in geo, which
      // will make them share the same label and bring trouble in label
      // location calculation.
      var regionGroup = nameMap.get(region.name) || nameMap.set(region.name, new graphic.Group());
      var compoundPath = new graphic.CompoundPath({
        segmentIgnoreThreshold: 1,
        shape: {
          paths: []
        }
      });
      regionGroup.add(compoundPath);
      var regionModel = mapOrGeoModel.getRegionModel(region.name) || mapOrGeoModel; // @ts-ignore FIXME:TS fix the "compatible with each other"?

      var itemStyleModel = regionModel.getModel('itemStyle'); // @ts-ignore FIXME:TS fix the "compatible with each other"?

      var emphasisModel = regionModel.getModel('emphasis');
      var emphasisItemStyleModel = emphasisModel.getModel('itemStyle'); // @ts-ignore FIXME:TS fix the "compatible with each other"?

      var blurItemStyleModel = regionModel.getModel(['blur', 'itemStyle']); // @ts-ignore FIXME:TS fix the "compatible with each other"?

      var selectItemStyleModel = regionModel.getModel(['select', 'itemStyle']); // NOTE: DONT use 'style' in visual when drawing map.
      // This component is used for drawing underlying map for both geo component and map series.

      var itemStyle = getFixedItemStyle(itemStyleModel);
      var emphasisItemStyle = getFixedItemStyle(emphasisItemStyleModel);
      var blurItemStyle = getFixedItemStyle(blurItemStyleModel);
      var selectItemStyle = getFixedItemStyle(selectItemStyleModel);
      var dataIdx; // Use the itemStyle in data if has data

      if (data) {
        dataIdx = data.indexOfName(region.name); // Only visual color of each item will be used. It can be encoded by visualMap
        // But visual color of series is used in symbol drawing
        //
        // Visual color for each series is for the symbol draw

        var style = data.getItemVisual(dataIdx, 'style');
        var decal = data.getItemVisual(dataIdx, 'decal');

        if (isVisualEncodedByVisualMap && style.fill) {
          itemStyle.fill = style.fill;
        }

        if (decal) {
          itemStyle.decal = createOrUpdatePatternFromDecal(decal, api);
        }
      }

      var sx = transformInfo.rawScaleX;
      var sy = transformInfo.rawScaleY;
      var offsetX = transformInfo.rawX;
      var offsetY = transformInfo.rawY;

      var transformPoint = function (point) {
        return [point[0] * sx + offsetX, point[1] * sy + offsetY];
      };

      zrUtil.each(region.geometries, function (geometry) {
        if (geometry.type !== 'polygon') {
          return;
        }

        var points = [];

        for (var i = 0; i < geometry.exterior.length; ++i) {
          points.push(transformPoint(geometry.exterior[i]));
        }

        compoundPath.shape.paths.push(new graphic.Polygon({
          segmentIgnoreThreshold: 1,
          shape: {
            points: points
          }
        }));

        for (var i = 0; i < (geometry.interiors ? geometry.interiors.length : 0); ++i) {
          var interior = geometry.interiors[i];
          var points_1 = [];

          for (var j = 0; j < interior.length; ++j) {
            points_1.push(transformPoint(interior[j]));
          }

          compoundPath.shape.paths.push(new graphic.Polygon({
            segmentIgnoreThreshold: 1,
            shape: {
              points: points_1
            }
          }));
        }
      });
      compoundPath.setStyle(itemStyle);
      compoundPath.style.strokeNoScale = true;
      compoundPath.culling = true;
      compoundPath.ensureState('emphasis').style = emphasisItemStyle;
      compoundPath.ensureState('blur').style = blurItemStyle;
      compoundPath.ensureState('select').style = selectItemStyle;
      var showLabel = false;

      for (var i = 0; i < DISPLAY_STATES.length; i++) {
        var stateName = DISPLAY_STATES[i]; // @ts-ignore FIXME:TS fix the "compatible with each other"?

        if (regionModel.get(stateName === 'normal' ? ['label', 'show'] : [stateName, 'label', 'show'])) {
          showLabel = true;
          break;
        }
      }

      var isDataNaN = data && isNaN(data.get(data.mapDimension('value'), dataIdx));
      var itemLayout = data && data.getItemLayout(dataIdx); // In the following cases label will be drawn
      // 1. In map series and data value is NaN
      // 2. In geo component
      // 4. Region has no series legendSymbol, which will be add a showLabel flag in mapSymbolLayout

      if (isGeo || isDataNaN && showLabel || itemLayout && itemLayout.showLabel) {
        var query = !isGeo ? dataIdx : region.name;
        var labelFetcher = void 0; // Consider dataIdx not found.

        if (!data || dataIdx >= 0) {
          labelFetcher = mapOrGeoModel;
        }

        var centerPt = transformPoint(region.center);
        var textEl = new graphic.Text({
          x: centerPt[0],
          y: centerPt[1],
          // FIXME
          // label rotation is not support yet in geo or regions of series-map
          // that has no data. The rotation will be effected by this `scale`.
          // So needed to change to RectText?
          scaleX: 1 / group.scaleX,
          scaleY: 1 / group.scaleY,
          z2: 10,
          silent: true
        });
        setLabelStyle(textEl, getLabelStatesModels(regionModel), {
          labelFetcher: labelFetcher,
          labelDataIndex: query,
          defaultText: region.name
        }, {
          normal: {
            align: 'center',
            verticalAlign: 'middle'
          }
        });
        compoundPath.setTextContent(textEl);
        compoundPath.setTextConfig({
          local: true
        });
        compoundPath.disableLabelAnimation = true;

        if (!isFirstDraw) {
          // Text animation
          graphic.updateProps(textEl, {
            scaleX: 1 / targetScaleX,
            scaleY: 1 / targetScaleY
          }, mapOrGeoModel);
        }
      } // setItemGraphicEl, setHoverStyle after all polygons and labels
      // are added to the rigionGroup


      if (data) {
        data.setItemGraphicEl(dataIdx, regionGroup);
      } else {
        var regionModel_1 = mapOrGeoModel.getRegionModel(region.name); // Package custom mouse event for geo component

        getECData(compoundPath).eventData = {
          componentType: 'geo',
          componentIndex: mapOrGeoModel.componentIndex,
          geoIndex: mapOrGeoModel.componentIndex,
          name: region.name,
          region: regionModel_1 && regionModel_1.option || {}
        };
      }

      var groupRegions = regionGroup.__regions || (regionGroup.__regions = []);
      groupRegions.push(region); // @ts-ignore FIXME:TS fix the "compatible with each other"?

      regionGroup.highDownSilentOnTouch = !!mapOrGeoModel.get('selectedMode');
      enableHoverEmphasis(regionGroup, emphasisModel.get('focus'), emphasisModel.get('blurScope'));
      regionsGroup.add(regionGroup);
    });

    this._updateController(mapOrGeoModel, ecModel, api);

    this._updateMapSelectHandler(mapOrGeoModel, regionsGroup, api, fromView);
  };

  MapDraw.prototype.remove = function () {
    this._regionsGroup.removeAll();

    this._backgroundGroup.removeAll();

    this._controller.dispose();

    this._mapName && geoSourceManager.removeGraphic(this._mapName, this.uid);
    this._mapName = null;
    this._controllerHost = null;
  };

  MapDraw.prototype._updateBackground = function (geo) {
    var mapName = geo.map;

    if (this._mapName !== mapName) {
      zrUtil.each(geoSourceManager.makeGraphic(mapName, this.uid), function (root) {
        this._backgroundGroup.add(root);
      }, this);
    }

    this._mapName = mapName;
  };

  MapDraw.prototype._updateController = function (mapOrGeoModel, ecModel, api) {
    var geo = mapOrGeoModel.coordinateSystem;
    var controller = this._controller;
    var controllerHost = this._controllerHost; // @ts-ignore FIXME:TS

    controllerHost.zoomLimit = mapOrGeoModel.get('scaleLimit');
    controllerHost.zoom = geo.getZoom(); // roamType is will be set default true if it is null
    // @ts-ignore FIXME:TS

    controller.enable(mapOrGeoModel.get('roam') || false);
    var mainType = mapOrGeoModel.mainType;

    function makeActionBase() {
      var action = {
        type: 'geoRoam',
        componentType: mainType
      };
      action[mainType + 'Id'] = mapOrGeoModel.id;
      return action;
    }

    controller.off('pan').on('pan', function (e) {
      this._mouseDownFlag = false;
      roamHelper.updateViewOnPan(controllerHost, e.dx, e.dy);
      api.dispatchAction(zrUtil.extend(makeActionBase(), {
        dx: e.dx,
        dy: e.dy
      }));
    }, this);
    controller.off('zoom').on('zoom', function (e) {
      this._mouseDownFlag = false;
      roamHelper.updateViewOnZoom(controllerHost, e.scale, e.originX, e.originY);
      api.dispatchAction(zrUtil.extend(makeActionBase(), {
        zoom: e.scale,
        originX: e.originX,
        originY: e.originY
      }));
      var group = this.group;

      this._regionsGroup.traverse(function (el) {
        var textContent = el.getTextContent();

        if (textContent) {
          textContent.scaleX = 1 / group.scaleX;
          textContent.scaleY = 1 / group.scaleY;
          textContent.markRedraw();
        }
      });
    }, this);
    controller.setPointerChecker(function (e, x, y) {
      return geo.getViewRectAfterRoam().contain(x, y) && !onIrrelevantElement(e, api, mapOrGeoModel);
    });
  };

  MapDraw.prototype._updateMapSelectHandler = function (mapOrGeoModel, regionsGroup, api, fromView) {
    var mapDraw = this;
    regionsGroup.off('mousedown'); // @ts-ignore FIXME:TS resolve type conflict

    if (mapOrGeoModel.get('selectedMode')) {
      regionsGroup.on('mousedown', function () {
        mapDraw._mouseDownFlag = true;
      });
      regionsGroup.on('click', function (e) {
        if (!mapDraw._mouseDownFlag) {
          return;
        }

        mapDraw._mouseDownFlag = false;
      });
    }
  };

  return MapDraw;
}();

;
export default MapDraw;