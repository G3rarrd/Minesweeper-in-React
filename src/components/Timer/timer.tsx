import {useState, useEffect, useContext} from 'react';
import {context, ContextProps} from '../context';

import './timer.css'

export default function Timer(){
    const [time, setTime] = useState<number>(0);

    const { gameState } : ContextProps = useContext(context)

    useEffect(() => {
        if (gameState === 'start') setTime(0);

        if (gameState !== 'playing') return;
        
        const timeoutId = setTimeout(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000)

        return () => clearTimeout(timeoutId);
    }, [time, gameState])

    return (
        <>
            <div className="timerContainer">
                <span className='timer'>{time}</span>
            </div>
        </>
    )
}