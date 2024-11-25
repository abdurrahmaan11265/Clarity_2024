import React from 'react';
import Question from './Question';

const Category = ({ category }) => {
    return (
        <div className="category-container">
            <h2>{category.category}</h2>
            {category.questions.map(question => (
                <Question key={question._id} question={question} />
            ))}
        </div>
    );
};

export default Category;