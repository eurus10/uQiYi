import Path, { PathProps } from '../Path';
declare class SectorShape {
    cx: number;
    cy: number;
    r0: number;
    r: number;
    startAngle: number;
    endAngle: number;
    clockwise: boolean;
    cornerRadius: number;
    innerCornerRadius: number;
}
interface SectorProps extends PathProps {
    shape?: Partial<SectorShape>;
}
declare class Sector extends Path<SectorProps> {
    shape: SectorShape;
    constructor(opts?: SectorProps);
    getDefaultShape(): SectorShape;
    buildPath(ctx: CanvasRenderingContext2D, shape: SectorShape): void;
    isZeroArea(): boolean;
}
export default Sector;
