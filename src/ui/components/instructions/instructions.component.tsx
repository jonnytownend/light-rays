import React, { useState } from 'react'
import './instructions.styles.scss'

const Instructions: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true)

    const handleButtonPress = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className={`container ${isOpen ? 'open' : ''}`}>
            <div className="buttonContainer">
                <div className="button" onClick={handleButtonPress}>
                    <div className={`buttonContent ${isOpen ? "" : "rotated"}`}>
                        <p>{'‹'}</p>
                    </div>
                </div>
            </div>
            <div className="instructionContainer">
                <h1>LIGHT RAYS</h1>
                <p>_______________________________</p>
                <p>Draw mirrors with the mouse.</p>
                <p>Move the sun with the arrow keys, or by dragging it.</p>
                <p>Press <code>C</code> to remove all mirrors.</p>
                <p>Press <code>U</code> to remove the last mirror drawn.</p>
                <a href="https://github.com/jonnytownend/light-rays" target="_blank" rel="noopener noreferrer">
                    Check out this project on GitHub.
                </a>
            </div>
        </div>
    )
}

export default Instructions