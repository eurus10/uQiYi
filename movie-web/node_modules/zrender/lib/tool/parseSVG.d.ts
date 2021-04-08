import Group from '../graphic/Group';
import { RectLike } from '../core/BoundingRect';
import { parseXML } from './parseXML';
interface SVGParserOption {
    width?: number;
    height?: number;
    ignoreViewBox?: boolean;
    ignoreRootClip?: boolean;
}
interface SVGParserResult {
    root: Group;
    width: number;
    height: number;
    viewBoxRect: RectLike;
    viewBoxTransform: {
        x: number;
        y: number;
        scale: number;
    };
}
export declare function makeViewBoxTransform(viewBoxRect: RectLike, width: number, height: number): {
    scale: number;
    x: number;
    y: number;
};
export declare function parseSVG(xml: string | Document | SVGElement, opt: SVGParserOption): SVGParserResult;
export { parseXML };
