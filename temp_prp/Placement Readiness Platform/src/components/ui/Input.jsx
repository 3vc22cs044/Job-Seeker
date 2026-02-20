import React from 'react';
import './Input.css';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && <label className="input-label">{label}</label>}
            <input
                className={`input-field ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <span className="input-error-msg">{error}</span>}
        </div>
    );
};

export default Input;
