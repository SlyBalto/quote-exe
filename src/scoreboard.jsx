import React from 'react';
import "boxicons/css/boxicons.min.css"; // Import Boxicons CSS

const correctColor = "#00CA6C"; // Correct color
const incorrectColor = "#F00040"; // Incorrect color

const Scoreboard = ({ correct, incorrect }) => {
    return (
        <div className="scorecard">
            <h2 className='game-subtitle'>Score</h2>
            
            <h2 className='game-subtitle' style={{ display: 'flex', alignItems: 'center' }}>
                <i className="bx bx-check" style={{ color: correctColor, fontSize: "40px" }}></i>
                {correct} <span style={{ margin: '0 5px' }}></span>
                <i className="bx bx-x" style={{ color: incorrectColor, fontSize: "40px" }}></i>
                {incorrect}
            </h2>
        </div>
    );
};

export default Scoreboard;
