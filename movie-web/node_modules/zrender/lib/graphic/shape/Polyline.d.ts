import Path, { PathProps } from '../Path';
import { VectorArray } from '../../core/vector';
declare class PolylineShape {
    points: VectorArray[];
    percent?: number;
    smooth?: number | 'spline';
    smoothConstraint?: VectorArray[];
}
interface PolylineProps extends PathProps {
    shape?: Partial<PolylineShape>;
}
declare class Polyline extends Path<PolylineProps> {
    shape: PolylineShape;
    constructor(opts?: PolylineProps);
    getDefaultStyle(): {
        stroke: string;
        fill: string;
    };
    getDefaultShape(): PolylineShape;
    buildPath(ctx: CanvasRenderingContext2D, shape: PolylineShape): void;
}
export default Polyline;
