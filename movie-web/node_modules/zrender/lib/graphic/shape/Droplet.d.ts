import Path, { PathProps } from '../Path';
declare class DropletShape {
    cx: number;
    cy: number;
    width: number;
    height: number;
}
interface DropletProps extends PathProps {
    shape?: Partial<DropletShape>;
}
declare class Droplet extends Path<DropletProps> {
    shape: DropletShape;
    constructor(opts?: DropletProps);
    getDefaultShape(): DropletShape;
    buildPath(ctx: CanvasRenderingContext2D, shape: DropletShape): void;
}
export default Droplet;
