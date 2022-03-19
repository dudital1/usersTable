import React from 'react';
import moveoIcon from '../images/moveoIcon.webp';


export default function Header() {
    return (
        <nav className="header">
            <div className='header--logoText'>
                <img className='header--img' src={moveoIcon} alt='moveoIcon'></img>
                <h3>Users assignment</h3>
            </div>
        </nav>
    )
}