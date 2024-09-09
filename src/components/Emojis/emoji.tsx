import {useEffect, useContext, useRef} from 'react';

// 
import { Player } from '@lottiefiles/react-lottie-player'


import {context, ContextProps} from '../context';


import './emoji.css'

const Emoji = (() => {
    const emojisAvail : {[key : string] : [string, boolean]} = {
        smiley : ['https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/lottie.json', false],
        dead : ['https://fonts.gstatic.com/s/e/notoemoji/latest/1f635/lottie.json', true],
        celebrating : ['https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/lottie.json', true],
    }
    
    const {emoji,  openedBlocks} : ContextProps = useContext(context);
    const playerRef : React.RefObject<Player> = useRef<Player>(null);
    
    useEffect (() => {
        if (!playerRef || !playerRef.current) return;

        if (openedBlocks.size() > 1) {

            playerRef.current.play();
        }

    }, [openedBlocks]);

    // Animate the emoji
    return(
    <>
        <div className="emojiContainer">
            <Player
                ref={playerRef}
                src={emojisAvail[emoji][0]}
                className='player'
                
                autoplay={emojisAvail[emoji][1]}
                loop={emojisAvail[emoji][1]}
            />
        </div>
    </>
    )
});

export default Emoji;