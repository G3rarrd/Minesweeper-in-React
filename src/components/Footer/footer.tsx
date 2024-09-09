// Footer Children Components
import Difficulty from "../Difficulty/difficulty";
import ThemeToggler from "../ThemeToggler/themeToggler"

import './footer.css'

const Footer = (() => {
    return (
        <>
            <div className="footer">
                <Difficulty/>
                <ThemeToggler/>
            </div>
        </>
    );
})

export default Footer