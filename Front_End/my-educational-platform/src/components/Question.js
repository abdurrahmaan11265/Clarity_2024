import React from 'react';
import Option from './Option';

const Question = ({ question }) => {
    return (
        <div className="question">
            <h2>{question.question}</h2>
            <div className="options">
                {question.options.map((option, index) => (
                    <Option key={index} option={option} />
                ))}
            </div>
        </div>
    );
};

export default Question;