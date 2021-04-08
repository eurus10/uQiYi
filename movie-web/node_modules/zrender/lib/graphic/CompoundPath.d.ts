import Path from './Path';
import PathProxy from '../core/PathProxy';
interface CompoundPathShape {
    paths: Path[];
}
export default class CompoundPath extends Path {
    type: string;
    shape: CompoundPathShape;
    private _updatePathDirty;
    beforeBrush(): void;
    buildPath(ctx: PathProxy | CanvasRenderingContext2D, shape: CompoundPathShape): void;
    afterBrush(): void;
    getBoundingRect(): import("../core/BoundingRect").default;
}
export {};
