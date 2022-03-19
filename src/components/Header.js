import React from 'react';
import moveoIcon from '../images/moveoIcon.webp';


export default function Header() {

    
    return (
        <nav className="header">
            <div className='header--logoText'>
                <img className='header--img' src={moveoIcon} alt='moveoIcon'></img>
                <h2>Users assignment</h2>
            </div>
        </nav>
    )
}