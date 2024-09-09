import { useContext } from 'react'

import {context, ContextProps} from '../context';

import './flagCount.css'
import flagIcon from '../../assets/red_flag.svg';

const FlagCount = () => {
    const {flagsLeft} : ContextProps = useContext(context);

    return (
        <>
            <div className='flagCountContainer'>
                <span className="flagIcon"> <img src={flagIcon} alt="flag" /> </span>
                <span className='flagsLeft'>{flagsLeft}</span>
            </div>
        </>
    )
}

export default FlagCount;