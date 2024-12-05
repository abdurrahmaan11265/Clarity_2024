import React, { useState, useEffect } from 'react';
import '../styles/Roadmap.css';
import { getCareerStages } from '../services/api';

const RoadmapComponent = ({ careerName }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [timelinePoints, setTimelinePoints] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchCareerStages = async () => {
      try {
        const response = await getCareerStages(careerName);
        setTimelinePoints(response);
      } catch (error) {
        console.error('Error fetching career stages:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (careerName) {
      fetchCareerStages();
    }
  }, [careerName]);

  return (
    <div className="timeline-container">
      <div className="timeline-wrapper">
        <div className="timeline-line">
          <div className="timeline-points">
            {loading ? ( // Check if loading
              <p>Loading...</p> // Display loading message
            ) : (
              timelinePoints.map((point) => (
                <div key={point.id} className="point-wrapper">
                  <button
                    onClick={() => setSelectedPoint(selectedPoint === point.id ? null : point.id)}
                    className="timeline-point"
                  >
                    <span>{point.id}</span>
                  </button>
                  <div className="point-content">
                    <h3>{point.title}</h3>
                    <p>{point.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flashcards-container">
          {selectedPoint && (
            <div className="flashcards-grid">
              {timelinePoints
                .find(point => point.id === selectedPoint)
                .flashcards.map((card, index) => (
                  <div
                    key={index}
                    className={`flashcard fade-in-up-${index + 1}`}
                  >
                    <h4>{card.title}</h4>
                    <p>{card.content}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapComponent;