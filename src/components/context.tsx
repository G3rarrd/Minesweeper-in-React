// Context.js
import React from 'react';
import Minesweeper, {Blocks, OpenedBlocksObj} from '../utils/Minesweeper';
import Queue from '../utils/queue';

export interface ContextProps {
    rowSize: number;
    colSize: number;
    mineCount: number;
    init: number;
    diff: string;
    emoji : string;
    blocks : Blocks[][];
    openedBlocks : Queue<OpenedBlocksObj[]>, 
    blocksLeft : number;
    gameState : string;
    flagsLeft : number;
    setRowSize: (value: number) => void;
    setColSize: (value: number) => void;
    setMineCount: (value: number) => void;
    setInit: (value: number) => void;
    setDiff: (value: string) => void;
    setEmoji: (value: string) => void;
    setBlocks : (value : Blocks[][]) => void;
    setOpenedBlocks: (value : Queue<OpenedBlocksObj[]>) => void;
    setBlocksLeft : (value : number) => void;
    setGameState : (value : string) => void;
    setFlagsLeft : (value : number) => void;
}

const minesweeper = new Minesweeper();
const queue = new Queue<OpenedBlocksObj[]>;
export const defaultValue: ContextProps = {
    rowSize: 9,
    colSize: 9,
    mineCount: 10,
    init: -1,
    diff: 'Easy',
    emoji : 'smiley',
    blocks : minesweeper.initBoard(9, 9),
    openedBlocks : queue, 
    blocksLeft : 81, 
    gameState : 'start',
    flagsLeft : 10,
    setRowSize: () => {},
    setColSize: () => {},
    setMineCount: () => {},
    setInit: () => {},
    setDiff: () => {},
    setEmoji: () => {},
    setBlocks: () => {},
    setOpenedBlocks: () => {},
    setBlocksLeft : () => {},
    setGameState : () => {},
    setFlagsLeft : () => {},
}


export const context = React.createContext<ContextProps>(defaultValue);

