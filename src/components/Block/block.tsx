import  { memo } from "react";
import "./block.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBomb} from "@fortawesome/free-solid-svg-icons";

import {Blocks} from "../../utils/Minesweeper";
import flagIcon from '../../assets/red_flag.svg';

interface BlockProps {
    onBlockClick: () => void;
    id: string;
    value: Blocks;
    addFlagClick: (e : React.MouseEvent) => void;
}

const Block: React.FC<BlockProps> = ({value, onBlockClick, addFlagClick, id}) => {
    const bombIcon = <FontAwesomeIcon icon={faBomb}/>;
    const animDelay = value.animDelay;
    const animDelayStyle = {'--anim':`${animDelay}s`};
    return (
        <>
            <span className={`block ${(value.answer == 'M' && value.shown) ? 'mine' :''}`} id={id} key={id}>
                <span
                    onClick={onBlockClick} onContextMenu={addFlagClick}

                    className={value.shown ?  "blockOpen" : "blockClosed"}

                    style={animDelayStyle as React.CSSProperties}
                >{value.flagged ?  <img src={flagIcon} alt="flag" /> : '' }</span>
                {(value.shown && value.answer != '0') ? (value.answer == 'M') ? bombIcon : value.answer  : ''}
            </span>
        </>
    );
};

// Only render if the previous value is not equal to the current value 
const areEqual = (prevProps: BlockProps, nextProps: BlockProps) => {
    return (prevProps.value === nextProps.value);
};

// Exporting the component using React.memo for performance optimization
export default memo(Block, areEqual);
