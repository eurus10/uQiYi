
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
import { each, createHashMap } from 'zrender/lib/core/util';
import mapDataStorage from './mapDataStorage';
import geoJSONLoader from './geoJSONLoader';
import geoSVGLoader from './geoSVGLoader';
import BoundingRect from 'zrender/lib/core/BoundingRect';
var loaders = {
  geoJSON: geoJSONLoader,
  svg: geoSVGLoader
};
export default {
  load: function (mapName, nameMap, nameProperty) {
    var regions = [];
    var regionsMap = createHashMap();
    var nameCoordMap = createHashMap();
    var boundingRect;
    var mapRecords = retrieveMap(mapName);
    each(mapRecords, function (record) {
      var singleSource = loaders[record.type].load(mapName, record, nameProperty);
      each(singleSource.regions, function (region) {
        var regionName = region.name; // Try use the alias in geoNameMap

        if (nameMap && nameMap.hasOwnProperty(regionName)) {
          region = region.cloneShallow(regionName = nameMap[regionName]);
        }

        regions.push(region);
        regionsMap.set(regionName, region);
        nameCoordMap.set(regionName, region.center);
      });
      var rect = singleSource.boundingRect;

      if (rect) {
        boundingRect ? boundingRect.union(rect) : boundingRect = rect.clone();
      }
    });
    return {
      regions: regions,
      regionsMap: regionsMap,
      nameCoordMap: nameCoordMap,
      // FIXME Always return new ?
      boundingRect: boundingRect || new BoundingRect(0, 0, 0, 0)
    };
  },

  /**
   * @param hostKey For cache.
   * @return Roots.
   */
  makeGraphic: function (mapName, hostKey) {
    var mapRecords = retrieveMap(mapName);
    var results = [];
    each(mapRecords, function (record) {
      var method = loaders[record.type].makeGraphic;
      method && results.push(method(mapName, record, hostKey));
    });
    return results;
  },

  /**
   * @param hostKey For cache.
   */
  removeGraphic: function (mapName, hostKey) {
    var mapRecords = retrieveMap(mapName);
    each(mapRecords, function (record) {
      var method = loaders[record.type].makeGraphic;
      method && method(mapName, record, hostKey);
    });
  }
};

function mapNotExistsError(mapName) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Map ' + mapName + ' not exists. The GeoJSON of the map must be provided.');
  }
}

function retrieveMap(mapName) {
  var mapRecords = mapDataStorage.retrieveMap(mapName) || [];

  if (process.env.NODE_ENV !== 'production') {
    if (!mapRecords.length) {
      mapNotExistsError(mapName);
    }
  }

  return mapRecords;
}