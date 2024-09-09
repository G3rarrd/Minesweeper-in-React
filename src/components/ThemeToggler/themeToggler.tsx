import { useEffect, useState } from 'react';

// Moon and Sun Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSun, faMoon}from "@fortawesome/free-solid-svg-icons";

import './themeToggler.css';

const ThemeToggler = () => {
    const [theme, setTheme] = useState<string>('dark');

    const moonIcon = <FontAwesomeIcon icon={faMoon} />;
    const sunIcon = <FontAwesomeIcon icon={faSun} />;

    const handleClick = () => {
        setTheme((prevTheme) => prevTheme === 'dark' ? 'light' : 'dark');
    }

    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme]);

    return (
        <>
        <div className='circleContainer' onClick={handleClick}>
            <span className={`circle ${theme}`}>{theme === 'dark' ? moonIcon : sunIcon }</span>
        </div>
        </>
    )
}

export default ThemeToggler;