import * as graphic from '../../util/graphic';
import List from '../../data/List';
import { StageHandlerProgressParams, LabelOption, SymbolOptionMixin, ItemStyleOption, ZRColor, AnimationOptionMixin, ZRStyleProps, StatesOptionMixin, BlurScope, DisplayState } from '../../util/types';
import { CoordinateSystemClipArea } from '../../coord/CoordinateSystem';
import Model from '../../model/Model';
import { ScatterSeriesOption } from '../scatter/ScatterSeries';
interface UpdateOpt {
    isIgnore?(idx: number): boolean;
    clipShape?: CoordinateSystemClipArea;
    getSymbolPoint?(idx: number): number[];
    disableAnimation?: boolean;
}
interface SymbolLike extends graphic.Group {
    updateData(data: List, idx: number, scope?: SymbolDrawSeriesScope, opt?: UpdateOpt): void;
    fadeOut?(cb: () => void): void;
}
interface SymbolLikeCtor {
    new (data: List, idx: number, scope?: SymbolDrawSeriesScope, opt?: UpdateOpt): SymbolLike;
}
interface RippleEffectOption {
    period?: number;
    /**
     * Scale of ripple
     */
    scale?: number;
    brushType?: 'fill' | 'stroke';
    color?: ZRColor;
}
interface SymbolDrawStateOption {
    itemStyle?: ItemStyleOption;
    label?: LabelOption;
}
export interface SymbolDrawItemModelOption extends SymbolOptionMixin<object>, StatesOptionMixin<SymbolDrawStateOption, {
    emphasis?: {
        focus?: string;
        scale?: boolean;
    };
}>, SymbolDrawStateOption {
    cursor?: string;
    rippleEffect?: RippleEffectOption;
}
export interface SymbolDrawSeriesScope {
    emphasisItemStyle?: ZRStyleProps;
    blurItemStyle?: ZRStyleProps;
    selectItemStyle?: ZRStyleProps;
    focus?: string;
    blurScope?: BlurScope;
    symbolRotate?: ScatterSeriesOption['symbolRotate'];
    symbolOffset?: (number | string)[];
    labelStatesModels: Record<DisplayState, Model<LabelOption>>;
    itemModel?: Model<SymbolDrawItemModelOption>;
    hoverScale?: boolean;
    cursorStyle?: string;
    fadeIn?: boolean;
}
declare type ListForSymbolDraw = List<Model<SymbolDrawItemModelOption & AnimationOptionMixin>>;
declare class SymbolDraw {
    group: graphic.Group;
    private _data;
    private _SymbolCtor;
    private _seriesScope;
    private _getSymbolPoint;
    constructor(SymbolCtor?: SymbolLikeCtor);
    /**
     * Update symbols draw by new data
     */
    updateData(data: ListForSymbolDraw, opt?: UpdateOpt): void;
    isPersistent(): boolean;
    updateLayout(): void;
    incrementalPrepareUpdate(data: ListForSymbolDraw): void;
    /**
     * Update symbols draw by new data
     */
    incrementalUpdate(taskParams: StageHandlerProgressParams, data: ListForSymbolDraw, opt?: UpdateOpt): void;
    remove(enableAnimation?: boolean): void;
}
export default SymbolDraw;
