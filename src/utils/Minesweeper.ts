import Random from "./random.ts";
import Queue from '../utils/queue';

export interface Blocks {
    shown : boolean;
    answer : string;
    flagged : boolean;
    animDelay : number;
}

export interface OpenedBlocksObj {
    row : number,
    col : number,
    value : string,
}

class Minesweeper {

    private directions : [number, number][];

    constructor() {
        this.directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    }

    // Helper function for this.get_mineLocations
    public get_blocks(board : Blocks[][], firstClickId : number ) : [number, number][]{ 
        const blocksFilter : Set<string> = new Set<string>();

        const [row, col] : [number, number] = this.convertIdToRowCol(board, firstClickId );

        const rowSize : number = board.length;
        const colSize : number = board[0].length; 
        

        // This ensures that the first clicked block is never a bomb
        // and its neighbors do not include bombs.
        blocksFilter.add(`${row},${col}`)
        for (const [rowOffset, colOffset] of this.directions) {
            const newRow : number = row + rowOffset;
            const newCol : number = col + colOffset;

            if (newRow >= 0 && newRow < rowSize && newCol >= 0 && newCol < colSize ) {
                blocksFilter.add(`${newRow},${newCol}`);
            }
        }

        const blocks : [number, number][] = [];
        for (let i = 0; i < rowSize; i++) {
            for (let j = 0; j < colSize; j++) {
                if (!blocksFilter.has(`${i},${j}`))
                    blocks.push([i, j])
            }
        }

        // blocks that may contain a mine
        return blocks;
    }

    // Choosing random locations where the bomb will be placed
    public get_mineLocations(board : Blocks[][], mineCount : number,  firstClickId : number): [number, number][] {
        const random = new Random<[number, number]>();
        return random.sample(this.get_blocks(board,  firstClickId), mineCount);
    }

    // Initializing the board
    public initBoard(rowSize : number, colSize : number) : Blocks[][]{
        const board : Blocks[][] =  Array.from({ length: rowSize}, 
            () => Array.from({length : colSize}, () => ({
                shown : false, 
                answer : '0',
                flagged : false,
                animDelay : -1,
        })))
        return board;
    }


    // Placing bombs on the empty board
    public setBoard(board : Blocks[][], mineCount : number, mineLocations : [number, number][]) : Blocks[][]{
        for (let i = 0; i < mineCount; i++) {
            const row : number = mineLocations[i][0];
            const col : number =  mineLocations[i][1];

            board[row][col].answer = "M";
            this.neighbors(board, row, col);
        }
        return board;
    }

    public neighbors(board : Blocks[][], mineLocationRow : number , mineLocationCol : number ) : void{
        const rowSize : number = board.length;
        const colSize : number = board[0].length;

        for (const [rowOffset, colOffset] of this.directions) {
            const newRow : number = mineLocationRow + rowOffset;
            const newCol : number = mineLocationCol + colOffset;
            if (newRow >= 0 && newRow < rowSize && newCol >= 0 && newCol < colSize && 
                board[newRow][newCol].answer != "M") {
                    const num : number = +board[newRow][newCol].answer + 1;
                    board[newRow][newCol].answer = `${num}`;
            }
        }        
    }

    // Reveal all the bombs in a BFS manner when a bomb has been clicked on 
    public revealMines(board : Blocks[][] , row : number, col : number) : Queue<OpenedBlocksObj[]> {
        const colSize : number = board[0].length;
        const rowSize : number   = board.length;

        const start : [number, number] = [row, col] 

        const queue : Queue<[number, number]> = new Queue<[number, number]>();
        const visited : Set<string> = new Set(); 
        
        const openedBlocksLevel : Queue<OpenedBlocksObj[]> = new Queue<OpenedBlocksObj[]>();
        
        queue.push(start);
        visited.add(`${row},${col}`);

        // BFS to reveal the bombs.
        while (!queue.empty()) {
            const qLen : number = queue.size();
            const level : OpenedBlocksObj[] = [];

            for (let i : number = 0; i < qLen; i++ ) {
                const value : [number, number] | undefined = queue.front();
                queue.pop();

                if (value == undefined) continue;

                const curRow : number = value[0];
                const curCol : number = value[1]; 

                if (board[curRow][curCol].answer == "M") {
                    level.push({row : curRow, col : curCol,  value : 'M'});
                }

                for (const [rowOffset , colOffset] of this.directions) {
                    const newRow: number = curRow + rowOffset;
                    const newCol: number = curCol + colOffset;
    
                    const key : string = `${newRow},${newCol}`;
    
                    if (newRow >= 0 && newRow < rowSize && newCol >= 0 && newCol < colSize && !visited.has(key) && 
                    !board[newRow][newCol].flagged ) {
                        visited.add(key);  // Mark the cell as visited here 
                        queue.push([newRow, newCol]);  // Then push to queue
                    } 
                }
            }

            if (level.length) openedBlocksLevel.push(level);

            
        }
        return openedBlocksLevel;
    }

    // Revealing the numbers that was clicked on 
    public revealNumbers(board: Blocks[][], row: number, col: number): Queue<OpenedBlocksObj[]> { 
        const colSize = board[0].length;
        const rowSize = board.length;
    
        const start: [number, number] = [row, col];
    
        const queue: Queue<[number, number]> = new Queue<[number, number]>();
        const visited: Set<string> = new Set(); 
        
        const openedBlocksLevel: Queue<OpenedBlocksObj[]> = new  Queue<OpenedBlocksObj[]>() ;
        
        queue.push(start);
        while (!queue.empty()) {
            const openedBlocks: OpenedBlocksObj[] = [];
            const currentLevelSize = queue.size();  // Store the size before the loop

            for (let i: number = 0; i < currentLevelSize; i++) {
                const value: [number, number] | undefined = queue.front();
                queue.pop(); 
                
                if (value == undefined) continue;
                
                const curRow: number = value[0];
                const curCol: number = value[1];
    
                const num: string = board[curRow][curCol].answer;
                
                
                openedBlocks.push({ row: curRow, col: curCol, value: (num === "0") ? '' : num });
                visited.add(`${curRow}:${curCol}`);

                // If current block is not zero, do not expand further
                if (board[curRow][curCol].answer != "0") {
                    continue;
                }
    
                // Explore neighboring cells
                for (const [rowOffset, colOffset] of this.directions) {
                    
                    const newRow: number = curRow + rowOffset;
                    const newCol: number = curCol + colOffset;
    
                    const newKey = `${newRow}:${newCol}`;
    
                    if (newRow >= 0 && newRow < rowSize && newCol >= 0 && newCol < colSize && 
                        board[newRow][newCol].answer != "M" && !visited.has(newKey) && 
                            !board[newRow][newCol].flagged && !board[newRow][newCol].shown) 
                        {
                            visited.add(newKey);  // Mark the cell as visited here
                            queue.push([newRow, newCol]);  // Then push to queue
                        } 
                }
            }
            openedBlocksLevel.push(openedBlocks);
        }    
        return openedBlocksLevel;
    }



    public convertIdToRowCol(board : Blocks[][], id : number) : [number, number] {
        const colSize : number = board[0].length;
        const toRow : number = Math.floor(id / colSize);
        const toCol : number = id % colSize;
        return [toRow, toCol];
    }

    public printBoard(board : Blocks[][], showAnswer: boolean = false) :void {
        const rowSize : number = board.length;
        const colSize : number = board[0].length;

        for (let i = 0; i < rowSize; i++) {
            let output : string = "";
            for (let j = 0; j < colSize; j++) {
                output += (showAnswer) ? board[i][j].answer + " " : board[i][j].shown + " ";
            }
            console.log(output);
        }
        console.log();
    }
    

    
    
}

export default Minesweeper;