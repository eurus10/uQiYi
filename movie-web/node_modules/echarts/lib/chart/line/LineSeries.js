
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
import createListFromArray from '../helper/createListFromArray';
import SeriesModel from '../../model/Series';

var LineSeriesModel =
/** @class */
function (_super) {
  __extends(LineSeriesModel, _super);

  function LineSeriesModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = LineSeriesModel.type;
    _this.hasSymbolVisual = true;
    _this.legendSymbol = 'line';
    return _this;
  }

  LineSeriesModel.prototype.getInitialData = function (option) {
    if (process.env.NODE_ENV !== 'production') {
      var coordSys = option.coordinateSystem;

      if (coordSys !== 'polar' && coordSys !== 'cartesian2d') {
        throw new Error('Line not support coordinateSystem besides cartesian and polar');
      }
    }

    return createListFromArray(this.getSource(), this, {
      useEncodeDefaulter: true
    });
  };

  LineSeriesModel.type = 'series.line';
  LineSeriesModel.dependencies = ['grid', 'polar'];
  LineSeriesModel.defaultOption = {
    zlevel: 0,
    z: 3,
    coordinateSystem: 'cartesian2d',
    legendHoverLink: true,
    clip: true,
    label: {
      position: 'top'
    },
    endLabel: {
      show: false,
      valueAnimation: true,
      distance: 8
    },
    lineStyle: {
      width: 2,
      type: 'solid'
    },
    emphasis: {
      scale: true,
      lineStyle: {
        width: 'bolder'
      }
    },
    // areaStyle: {
    // origin of areaStyle. Valid values:
    // `'auto'/null/undefined`: from axisLine to data
    // `'start'`: from min to data
    // `'end'`: from data to max
    // origin: 'auto'
    // },
    // false, 'start', 'end', 'middle'
    step: false,
    // Disabled if step is true
    smooth: false,
    smoothMonotone: null,
    symbol: 'emptyCircle',
    symbolSize: 4,
    symbolRotate: null,
    showSymbol: true,
    // `false`: follow the label interval strategy.
    // `true`: show all symbols.
    // `'auto'`: If possible, show all symbols, otherwise
    //           follow the label interval strategy.
    showAllSymbol: 'auto',
    // Whether to connect break point.
    connectNulls: false,
    // Sampling for large data. Can be: 'average', 'max', 'min', 'sum', 'lttb'.
    sampling: 'none',
    animationEasing: 'linear',
    // Disable progressive
    progressive: 0,
    hoverLayerThreshold: Infinity
  };
  return LineSeriesModel;
}(SeriesModel);

export default LineSeriesModel;