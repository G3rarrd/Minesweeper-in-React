// Header Children Components
import FlagCount from "../Flag_Count/flagCount";
import Emoji from "../Emojis/emoji";
import Timer from "../Timer/timer"

import "./header.css"

const Header = (() => {
    return (
        <>
            <div className="header">
                <FlagCount/>
                <Emoji/>
                <Timer/>
            </div>
        </>
    );
})

export default Header