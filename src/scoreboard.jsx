import React from 'react';

const Scoreboard = ({ correct, incorrect }) => {
    return (
        <div className="scorecard">
            <h2 className='game-subtitle' >Score</h2>
            <h2 className='game-subtitle' >{correct} - {incorrect}</h2>
        </div>
    );
};

export default Scoreboard;