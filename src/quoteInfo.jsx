import React from 'react';
import './App.css';

// React only passes a single props object, not separate arguments, so these two need to be put into a single props object: {}
const QuoteInfo = ({quote, author}) => {
    return (
        <div className='quote-container font-rajdhani' style={{height: "100%"}}>


            <h2 className="quote">"{quote}"</h2>

            <h2 className="text-right w-full mt-2 pr-5 author">{author}</h2>
        </div>
    );
};
export default QuoteInfo;