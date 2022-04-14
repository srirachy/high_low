import React from 'react';

const Button = ({ disabled, value, children, onClick, className }) => {
    return (
        <button type="button" onClick={onClick} value={value} disabled={disabled} className={className}>
            {children}
        </button>
    );
};

export default Button;