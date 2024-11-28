import React, { useState } from 'react';
import '../styles/Roadmap.css';

const RoadmapComponent = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  const timelinePoints = [
    {
      id: 1,
      title: "Point 1",
      content: "Sub-heading",
      flashcards: [
        { title: "Analysis", content: "Identify target market segments and needs" },
        { title: "Competition", content: "Analyze competitor strengths and weaknesses" },
        { title: "Opportunities", content: "Define unique value propositions" }
      ]
    },
    {
      id: 2,
      title: "Point 2",
      content: "Sub-Heading",
      flashcards: [
        { title: "Resources", content: "Allocate team members and budget" },
        { title: "Timeline", content: "Create project milestones and deadlines" },
        { title: "Assessment", content: "Identify potential challenges" }
      ]
    },
    {
      id: 3,
      title: "Point 3",
      content: "Sub-heading",
      flashcards: [
        { title: "Assesment", content: "Design system architecture" },
        { title: "Timeline", content: "Implement core functionalities" },
        { title: "Code Review", content: "Maintain code quality standards" }
      ]
    },
    {
      id: 4,
      title: "Point 4",
      content: "Sub-hrading",
      flashcards: [
        { title: "Unit Testing", content: "Test individual components" },
        { title: "Integration", content: "Verify system integration" },
        { title: "User Testing", content: "Conduct user acceptance testing" }
      ]
    },
    {
        id: 5,
        title: "Point 5",
        content: "Sub-hrading",
        flashcards: [
          { title: "Unit Testing", content: "Test individual components" },
          { title: "Integration", content: "Verify system integration" },
          { title: "User Testing", content: "Conduct user acceptance testing" }
        ]
      }
  ];

  return (
    <div className="timeline-container">
      <div className="timeline-wrapper">
        <div className="timeline-line">
          <div className="timeline-points">
            
            {timelinePoints.map((point) => (
              <div key={point.id} className="point-wrapper">            
                <button 
                  onClick={() => setSelectedPoint(selectedPoint === point.id ? null : point.id)}
                  className="timeline-point"
                >
                  <span>{point.id}</span>
                  <div className="point-content">
                  <h3>{point.title}</h3>
                  <p>{point.content}</p>
                </div>
                </button>
                
              </div>
            ))}
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