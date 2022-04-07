import React from 'react';

const Button = ({ id, value, children, onClick }) => {
    return (
        <button type="button" onClick={onClick} value={value} id={id}>
            {children}
        </button>
    );
};

export default Button;