import Model from '../../model/Model';
import ComponentModel from '../../model/Component';
import { ComponentOption, BoxLayoutOptionMixin, BorderOptionMixin, ColorString, ItemStyleOption, LabelOption, LayoutOrient, CommonTooltipOption } from '../../util/types';
import { Dictionary } from 'zrender/lib/core/types';
import GlobalModel from '../../model/Global';
declare type SelectorType = 'all' | 'inverse';
export interface LegendSelectorButtonOption {
    type?: SelectorType;
    title?: string;
}
interface DataItem {
    name?: string;
    icon?: string;
    textStyle?: LabelOption;
    tooltip?: unknown;
}
export interface LegendTooltipFormatterParams {
    componentType: 'legend';
    legendIndex: number;
    name: string;
    $vars: ['name'];
}
export interface LegendOption extends ComponentOption, BoxLayoutOptionMixin, BorderOptionMixin {
    mainType?: 'legend';
    show?: boolean;
    orient?: LayoutOrient;
    align?: 'auto' | 'left' | 'right';
    backgroundColor?: ColorString;
    /**
     * Border radius of background rect
     * @default 0
     */
    borderRadius?: number | number[];
    /**
     * Padding between legend item and border.
     * Support to be a single number or an array.
     * @default 5
     */
    padding?: number | number[];
    /**
     * Gap between each legend item.
     * @default 10
     */
    itemGap?: number;
    /**
     * Width of legend symbol
     */
    itemWidth?: number;
    /**
     * Height of legend symbol
     */
    itemHeight?: number;
    /**
     * Color when legend item is not selected
     */
    inactiveColor?: ColorString;
    /**
     * Border color when legend item is not selected
     */
    inactiveBorderColor?: ColorString;
    itemStyle?: ItemStyleOption;
    /**
     * Legend label formatter
     */
    formatter?: string | ((name: string) => string);
    textStyle?: LabelOption;
    selectedMode?: boolean | 'single' | 'multiple';
    /**
     * selected map of each item. Default to be selected if item is not in the map
     */
    selected?: Dictionary<boolean>;
    /**
     * Buttons for all select or inverse select.
     * @example
     *  selector: [{type: 'all or inverse', title: xxx}]
     *  selector: true
     *  selector: ['all', 'inverse']
     */
    selector?: (LegendSelectorButtonOption | SelectorType)[] | boolean;
    selectorLabel?: LabelOption;
    emphasis?: {
        selectorLabel?: LabelOption;
    };
    /**
     * Position of selector buttons.
     */
    selectorPosition?: 'auto' | 'start' | 'end';
    /**
     * Gap between each selector button
     */
    selectorItemGap?: number;
    /**
     * Gap between selector buttons group and legend main items.
     */
    selectorButtonGap?: number;
    data?: (string | DataItem)[];
    symbolKeepAspect?: boolean;
    /**
     * Tooltip option
     */
    tooltip?: CommonTooltipOption<LegendTooltipFormatterParams>;
}
declare class LegendModel<Ops extends LegendOption = LegendOption> extends ComponentModel<Ops> {
    static type: string;
    type: string;
    static readonly dependencies: string[];
    readonly layoutMode: {
        readonly type: "box";
        readonly ignoreSize: true;
    };
    private _data;
    private _availableNames;
    init(option: Ops, parentModel: Model, ecModel: GlobalModel): void;
    mergeOption(option: Ops, ecModel: GlobalModel): void;
    _updateSelector(option: Ops): void;
    optionUpdated(): void;
    _updateData(ecModel: GlobalModel): void;
    getData(): Model<DataItem>[];
    select(name: string): void;
    unSelect(name: string): void;
    toggleSelected(name: string): void;
    allSelect(): void;
    inverseSelect(): void;
    isSelected(name: string): boolean;
    getOrient(): {
        index: 0;
        name: 'horizontal';
    };
    getOrient(): {
        index: 1;
        name: 'vertical';
    };
    static defaultOption: LegendOption;
}
export default LegendModel;
