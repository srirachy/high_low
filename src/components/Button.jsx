import React from 'react';

const Button = ({ disabled, value, children, onClick }) => {
    return (
        <button type="button" onClick={onClick} value={value} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;