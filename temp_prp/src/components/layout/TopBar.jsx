import React from 'react';
import './TopBar.css';

const TopBar = ({ stepCurrent, stepTotal, status }) => {
    return (
        <div className="top-bar">
            <div className="top-bar-left">
                <span className="project-name">KodNest Premium Build System</span>
            </div>
            <div className="top-bar-center">
                <span className="step-indicator">Step {stepCurrent} / {stepTotal}</span>
            </div>
            <div className="top-bar-right">
                <span className={`status-badge status-${status.toLowerCase().replace(' ', '-')}`}>
                    {status}
                </span>
            </div>
        </div>
    );
};

export default TopBar;
