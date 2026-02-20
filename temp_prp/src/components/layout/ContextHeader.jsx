import React from 'react';
import './ContextHeader.css';

const ContextHeader = ({ title, description }) => {
    return (
        <div className="context-header">
            <h1 className="context-title">{title}</h1>
            <p className="context-description">{description}</p>
        </div>
    );
};

export default ContextHeader;
