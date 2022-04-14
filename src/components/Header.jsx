import React from 'react';

const Header = ({ type = 'h1', children }) => {
    const HeaderElmt = type;
    return <HeaderElmt>{children}</HeaderElmt>;
};

export default Header;