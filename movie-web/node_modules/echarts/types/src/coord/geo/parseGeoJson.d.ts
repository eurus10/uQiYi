import Region from './Region';
import { GeoJSONCompressed, GeoJSON } from './geoTypes';
export default function parseGeoJSON(geoJson: GeoJSON | GeoJSONCompressed, nameProperty: string): Region[];
