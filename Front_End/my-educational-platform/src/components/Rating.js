import React, { useState, useEffect } from 'react';
import '../styles/Rating.css';
import Button from './Button';

const Rating = ({ initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [storedRating, setStoredRating] = useState(null);

  useEffect(() => {
    const savedRating = localStorage.getItem('rating');
    if (savedRating) {
      setRating(parseInt(savedRating));
      setStoredRating(parseInt(savedRating));
    }
  }, []); // Runs only on component mount

  const resetStoredRating = () => {
    setStoredRating(null);
    setRating(0);
    localStorage.removeItem('rating');
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Rating: ${rating}, Feedback: ${feedback}`);
    document.querySelector('.feedback-form').style.display = 'none';
    localStorage.setItem('rating', rating.toString());
    setStoredRating(rating);
  };

  return (
    <div className="rating-container">
      <h3>Rate your counsellor:</h3>
      <div className="stars">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={starValue}
              className={`star ${starValue <= (hover || rating) ? 'filled' : ''}`}
              onClick={() => handleRatingChange(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          );
        })}
      </div>
      <p style={{ marginBottom: '10px' }}>
        {storedRating ? `Current rating is: ${storedRating} star${storedRating !== 1 ? 's' : ''}` : 'Add your rating'}
      </p>
      <form onSubmit={handleSubmit} className="feedback-form">
        {!storedRating && (
          <div className="feedback-container">
            <label htmlFor="feedback">Additional feedback:</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Share your thoughts about the counselling session..."
            />
          </div>
        )}
        {storedRating ? (
          <div onClick={resetStoredRating}>
            <Button displayText="Change Rating and Feedback" />
          </div>
        ) : (
          <Button displayText="Submit" />
        )}
      </form>
    </div>
  );
};

export default Rating;