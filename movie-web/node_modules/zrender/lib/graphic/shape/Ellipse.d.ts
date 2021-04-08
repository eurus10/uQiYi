import Path, { PathProps } from '../Path';
declare class EllipseShape {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
}
interface EllipseProps extends PathProps {
    shape?: Partial<EllipseShape>;
}
declare class Ellipse extends Path<EllipseProps> {
    shape: EllipseShape;
    constructor(opts?: EllipseProps);
    getDefaultShape(): EllipseShape;
    buildPath(ctx: CanvasRenderingContext2D, shape: EllipseShape): void;
}
export default Ellipse;
