import React from 'react';

const Option = ({ option }) => {
    return (
        <label className="option">
            <input type="checkbox" />
            {option}
        </label>
    );
};

export default Option;