import Path, { PathProps } from '../Path';
declare class ArcShape {
    cx: number;
    cy: number;
    r: number;
    startAngle: number;
    endAngle: number;
    clockwise?: boolean;
}
interface ArcProps extends PathProps {
    shape?: Partial<ArcShape>;
}
declare class Arc extends Path<ArcProps> {
    shape: ArcShape;
    constructor(opts?: ArcProps);
    getDefaultStyle(): {
        stroke: string;
        fill: string;
    };
    getDefaultShape(): ArcShape;
    buildPath(ctx: CanvasRenderingContext2D, shape: ArcShape): void;
}
export default Arc;
