
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
import { createHashMap, isString, isArray, each, assert } from 'zrender/lib/core/util';
import { parseXML } from 'zrender/lib/tool/parseXML';
var storage = createHashMap();
export default {
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
  registerMap: function (mapName, rawDef, rawSpecialAreas) {
    var records;

    if (isArray(rawDef)) {
      records = rawDef;
    } else if (rawDef.svg) {
      records = [{
        type: 'svg',
        source: rawDef.svg,
        specialAreas: rawDef.specialAreas
      }];
    } else {
      // Backward compatibility.
      var geoSource = rawDef.geoJson || rawDef.geoJSON;

      if (geoSource && !rawDef.features) {
        rawSpecialAreas = rawDef.specialAreas;
        rawDef = geoSource;
      }

      records = [{
        type: 'geoJSON',
        source: rawDef,
        specialAreas: rawSpecialAreas
      }];
    }

    each(records, function (record) {
      var type = record.type;
      type === 'geoJson' && (type = record.type = 'geoJSON');
      var parse = parsers[type];

      if (process.env.NODE_ENV !== 'production') {
        assert(parse, 'Illegal map type: ' + type);
      }

      parse(record);
    });
    return storage.set(mapName, records);
  },
  retrieveMap: function (mapName) {
    return storage.get(mapName);
  }
};
var parsers = {
  geoJSON: function (record) {
    var source = record.source;
    record.geoJSON = !isString(source) ? source : typeof JSON !== 'undefined' && JSON.parse ? JSON.parse(source) : new Function('return (' + source + ');')();
  },
  // Only perform parse to XML object here, which might be time
  // consiming for large SVG.
  // Although convert XML to zrender element is also time consiming,
  // if we do it here, the clone of zrender elements has to be
  // required. So we do it once for each geo instance, util real
  // performance issues call for optimizing it.
  svg: function (record) {
    record.svgXML = parseXML(record.source);
  }
};