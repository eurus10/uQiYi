import { DefaultDataVisual } from '../data/List';
export interface LineDataVisual extends DefaultDataVisual {
    fromSymbol: string;
    toSymbol: string;
    fromSymbolSize: number;
    toSymbolSize: number;
    fromSymbolRotate: number;
    toSymbolRotate: number;
}
