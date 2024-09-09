import { useState, useEffect, useRef } from 'react';

// Context
import { context, defaultValue } from '../context.tsx'

// Components
import Block from '../Block/block.tsx';
import Header from "../Header/header.tsx";
import Footer from "../Footer/footer.tsx"

// Utils 
import Minesweeper, { Blocks, OpenedBlocksObj } from '../../utils/Minesweeper';
import Queue from '../../utils/queue.ts';
import Easings from '../../utils/easings.ts';

// CSS
import "./board.css";

export default function Board() {
    const m_sweeper: Minesweeper = new Minesweeper();
    const easing : Easings = new Easings();

    // Context States
    const [rowSize, setRowSize] = useState<number>(defaultValue.rowSize);
    const [colSize, setColSize] = useState<number>(defaultValue.colSize);
    const [mineCount, setMineCount] = useState<number>(defaultValue.mineCount);
    const [init, setInit] = useState<number>(defaultValue.init); // Gets the initial block id used to help set the mines on the board
    const [emoji, setEmoji] = useState<string>(defaultValue.emoji);
    const [board, setBoard] = useState<Blocks[][]>(defaultValue.blocks);
    const [diff, setDiff] = useState<string>(defaultValue.diff);
    const [blocksLeft, setBlocksLeft] = useState<number>(defaultValue.rowSize * defaultValue.colSize)
    const [gameState, setGameState] = useState<string>(defaultValue.gameState); // consists of start, playing, loss, won
    const [openedBlocks, setOpenedBlocks] = useState<Queue<OpenedBlocksObj[]>>(defaultValue.openedBlocks);
    const [flagsLeft, setFlagsLeft] = useState<number>(defaultValue.flagsLeft);

    // Helps in arranging the blocks in CSS Grid 
    const styleVariables = {
        "--col-count": colSize,
        "--row-count": rowSize,
    }

    const initRef = useRef<number>(init);
    const mineCountRef = useRef<number>(mineCount);
    const blocksRef = useRef<Blocks[][]>(board);
    const openedBlocksRef = useRef<Queue<OpenedBlocksObj[]>>(openedBlocks);
    const gameStateRef = useRef<string>(gameState);
    const flagsLeftRef = useRef<number>(flagsLeft);

    // Use parent state not child state that is 
    // holding the previous state because it did not render 
    useEffect(() => {
        initRef.current = init;
        mineCountRef.current = mineCount;
        blocksRef.current = board;
        openedBlocksRef.current = openedBlocks;
        flagsLeftRef.current = flagsLeft;
        gameStateRef.current = gameState;
    }, [init, mineCount, board, openedBlocks, gameState, flagsLeft]);

    useEffect(() => {
        if (blocksLeft == mineCount){
            setEmoji('celebrating');
            setGameState('won');
        }
            
    }, [blocksLeft])

    // Block Click to start game
    useEffect(() => {
        if (initRef.current > -1) {
            blockRevealSetup(init)
        }
    }, [init])


    // Block Click Function
    function handleBlockClick(id: number): void {
        if (initRef.current == -1) {
            const deepCopy = JSON.parse(JSON.stringify(blocksRef.current));
            const mineLocations: [number, number][] = m_sweeper.get_mineLocations(blocksRef.current, mineCountRef.current, id)
            const newBlocks: Blocks[][] = m_sweeper.setBoard(deepCopy, mineCountRef.current, mineLocations);
            setBoard(newBlocks);
            setInit(id);
            setGameState('playing');
            return;
        }

        if (gameStateRef.current !== 'playing') return;

        blockRevealSetup(id);
    }

    // Right click To add a flag to the selected block 
    function handleAddFlagClick(e: React.MouseEvent, id: number): void {
        e.preventDefault();

        let curFlagsLeft : number = flagsLeftRef.current;
        if(gameState != 'playing') return;
        
        const curBlocks: Blocks[][] = blocksRef.current;
        
        const [toRow, toCol] : [number, number] = m_sweeper.convertIdToRowCol(curBlocks, id);

        // Shallow copying the 2d Matrix then copying the required row for efficient mutability
        const newBlocks = [...curBlocks];
        newBlocks[toRow] = [...newBlocks[toRow]];

        newBlocks[toRow][toCol] = { ...newBlocks[toRow][toCol] };

        // Helps Limit the flags to the mine count
        if (!newBlocks[toRow][toCol].flagged && curFlagsLeft > 0) {
            newBlocks[toRow][toCol].flagged = true;
            curFlagsLeft--;

        } else if(newBlocks[toRow][toCol].flagged) {
            newBlocks[toRow][toCol].flagged = false;
            curFlagsLeft++;
        }

        setBoard(newBlocks);
        setFlagsLeft(curFlagsLeft);
    }

    // Helper function to get the blocks that are to be shown
    const blockRevealSetup = (id: number)  => {
        const curBlocks: Blocks[][] = blocksRef.current;

        // Convert the id to row and column
        const [toRow, toCol]: [number, number] = m_sweeper.convertIdToRowCol(curBlocks, id);

        if (curBlocks[toRow][toCol].shown || curBlocks[toRow][toCol].flagged) return curBlocks;

        let newOpenedBlocks: Queue<OpenedBlocksObj[]> = new Queue<OpenedBlocksObj[]>();

        if (curBlocks[toRow][toCol].answer == "M") {
            newOpenedBlocks = m_sweeper.revealMines(curBlocks, toRow, toCol);
        } else {
            newOpenedBlocks = m_sweeper.revealNumbers(curBlocks, toRow, toCol);
        }

        setOpenedBlocks(newOpenedBlocks);

        return curBlocks;
    }

    // Function to reveal the blocks  
    const revealBlocks = () : void => {
        // Deep copy of the current board
        const newBoard : Blocks[][] = JSON.parse(JSON.stringify(blocksRef.current));
        
        let delay : number = 0; // setting the delay interval of each block at each level

        const tmpOpenedBlocks = openedBlocksRef.current;
        const size : number = tmpOpenedBlocks.size();
        
        let blocksRemoved : number = 0; // Store the count of the blocks removed

        const firstBlock  : OpenedBlocksObj[] | undefined = tmpOpenedBlocks.front(); 

        if (firstBlock === undefined) return;

        const {row, col} = firstBlock[0];
        
        const mineHit = newBoard[row][col].answer === 'M'; 

        while (!tmpOpenedBlocks.empty()) {
            const blocksOpened : OpenedBlocksObj[] | undefined = tmpOpenedBlocks.front(); 

            if (blocksOpened == undefined) continue;

            for (const block of blocksOpened) {
                const {row, col} = block;
                newBoard[row][col].shown = true;
                newBoard[row][col].animDelay = easing.easeInQuad(delay/size);
                blocksRemoved++;
            }
            delay++;
            tmpOpenedBlocks.pop();
        }
        if (!mineHit) {
            setBlocksLeft((prevBlocksLeft)=>prevBlocksLeft - blocksRemoved);
        } else {
            setEmoji('dead');
            setGameState('loss');
        }

        setBoard(newBoard);
    }

    // Reveal the blocks that can be opened
    useEffect(() => {
        revealBlocks();
    },[openedBlocks])

    return (
        <context.Provider value={{
            rowSize, setRowSize,
            colSize, setColSize,
            mineCount, setMineCount,
            init, setInit,
            diff, setDiff,
            emoji, setEmoji,
            blocks: board, setBlocks: setBoard,
            openedBlocks, setOpenedBlocks,
            blocksLeft, setBlocksLeft,
            gameState, setGameState,
            flagsLeft, setFlagsLeft,
        }}>

            <div style={styleVariables as React.CSSProperties} className="boardContainer">
                <Header />
                <div className="board">
                    {board.map((row, rowIndex) => (
                        row.map((block, blocckIndex) => {
                            const blockId: number = rowIndex * board[0].length + blocckIndex;
                            
                            return (
                                <Block
                                    id={`${blockId}`}
                                    key={`${blockId}`}
                                    value={block}
                                    addFlagClick={(e: React.MouseEvent) => handleAddFlagClick(e, blockId)}
                                    onBlockClick={() => handleBlockClick(blockId)}
                                />
                            )
                        })
                    ))}
                    <div className={`blockBoard ${(['won', 'loss'].includes(gameState)) ? 'on' : ''}`}></div>
                </div>
                <Footer />
            </div>

        </context.Provider>
    );
}
