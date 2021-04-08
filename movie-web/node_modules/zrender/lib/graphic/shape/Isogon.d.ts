import Path, { PathProps } from '../Path';
declare class IsogonShape {
    x: number;
    y: number;
    r: number;
    n: number;
}
interface IsogonProps extends PathProps {
    shape?: Partial<IsogonShape>;
}
declare class Isogon extends Path<IsogonProps> {
    shape: IsogonShape;
    constructor(opts?: IsogonProps);
    getDefaultShape(): IsogonShape;
    buildPath(ctx: CanvasRenderingContext2D, shape: IsogonShape): void;
}
export default Isogon;
