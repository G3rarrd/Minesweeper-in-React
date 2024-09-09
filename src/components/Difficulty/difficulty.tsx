import  {useContext, useState, useEffect } from "react";

import {context, ContextProps} from '../context';

// Utils
import Minesweeper, {Blocks} from '../../utils/Minesweeper';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight, faCaretUp } from '@fortawesome/free-solid-svg-icons';

// CSS
import "./difficulty.css";

const Difficulty = () => {
    const m_sweeper : Minesweeper = new Minesweeper();
    const {diff, setFlagsLeft, setRowSize, setColSize, setMineCount, setInit, setDiff, setBlocks, setEmoji
        ,setBlocksLeft, setGameState}: ContextProps = useContext(context);

    const [showDifficulty, setShowDifficulty] = useState<boolean>(false);

    const difficultySettings = {
        easy : {rowSize: 9, colSize: 9, mineCount: 10, diff: "Easy"},
        medium : {rowSize: 16, colSize: 16, mineCount: 40, diff: "Medium"},
        hard : {rowSize: 24, colSize: 24, mineCount: 75, diff: "Hard"}
    }

    const clickDifficulty = (diffSelected : keyof typeof difficultySettings) : void =>  {
        const settings = difficultySettings[diffSelected];

        setInit(-1);
        setEmoji('smiley')
        setRowSize(settings.rowSize);
        setColSize(settings.colSize);
        setMineCount(settings.mineCount);
        setBlocksLeft(settings.rowSize * settings.colSize);
        setDiff(settings.diff); 
        setFlagsLeft(settings.mineCount);
        setGameState('start');  

        const newBlocks : Blocks[][] = m_sweeper.initBoard(settings.rowSize, settings.colSize);
        setBlocks(newBlocks);
    }

    const clickShowDifficulty = () : void => {
        setShowDifficulty((prevState) => !prevState);
        console.log(showDifficulty);
    }

    const retryIcon = <FontAwesomeIcon icon={faRotateRight} />;
    const caretDownIcon = <FontAwesomeIcon icon={faCaretUp} />;
    

    const placeRetryBtn = (diffOption : string ) => {
        return (diffOption == diff) ? retryIcon : '';
    }

    const removeDifficultySettings = () => {
        setShowDifficulty(false);
    }

    useEffect(() => {
        window.addEventListener('mouseup', removeDifficultySettings);

        return () => {
            window.removeEventListener('mouseup', removeDifficultySettings);
        }
    })

    return (
        <>
        <div className="difficulty-container" >
            
            <div className={`option-difficulty ${showDifficulty ? 'show' : ''}`}>
                <div>
                <button className="options" id="easy" onClick={() => clickDifficulty("easy")}>Easy {placeRetryBtn('Easy')}</button>
                <button className="options" id="medium" onClick={() => clickDifficulty("medium")}>Medium {placeRetryBtn('Medium')}</button>
                <button className="options" id="hard" onClick={() => clickDifficulty("hard")}>Hard {placeRetryBtn('Hard')}</button>
                </div>
            </div>

            <div  className="curDifficultyContainer" onClick={() => clickShowDifficulty()}>
                <button className="curDiff"> {diff} </button> 
                <span className="dropdownIcon"> {caretDownIcon} </span>
            </div>
        </div>
        </>
    );
}

export default Difficulty;