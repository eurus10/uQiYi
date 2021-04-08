import Path, { PathProps } from '../Path';
import { VectorArray } from '../../core/vector';
declare class PolygonShape {
    points: VectorArray[];
    smooth?: number | 'spline';
    smoothConstraint?: VectorArray[];
}
interface PolygonProps extends PathProps {
    shape?: Partial<PolygonShape>;
}
declare class Polygon extends Path<PolygonProps> {
    shape: PolygonShape;
    constructor(opts?: PolygonProps);
    getDefaultShape(): PolygonShape;
    buildPath(ctx: CanvasRenderingContext2D, shape: PolygonShape): void;
}
export default Polygon;
