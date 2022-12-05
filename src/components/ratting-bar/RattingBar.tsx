import React from 'react'

const RattingBar = ({ ratting = 0, className = '' }) => (
    <div className={`star-rating inline-flex items-center text-xl text-orange-400 relative translate-x-[-6px] ${className}`}>
        <span>☆</span>
        <span>☆</span>
        <span>☆</span>
        <span>☆</span>
        <span>☆</span>
        <div className="absolute top-0 overflow-hidden whitespace-nowrap" style={{ width: ((ratting / 5) * 100) + '%' }}>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
        </div>
    </div>
);

export default RattingBar;