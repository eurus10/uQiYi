import Path, { PathProps } from '../Path';
declare class RoseShape {
    cx: number;
    cy: number;
    r: number[];
    k: number;
    n: number;
}
interface RoseProps extends PathProps {
    shape?: Partial<RoseShape>;
}
declare class Rose extends Path<RoseProps> {
    shape: RoseShape;
    constructor(opts?: RoseProps);
    getDefaultStyle(): {
        stroke: string;
        fill: string;
    };
    getDefaultShape(): RoseShape;
    buildPath(ctx: CanvasRenderingContext2D, shape: RoseShape): void;
}
export default Rose;
