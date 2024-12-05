import React, { useState } from 'react';
import '../styles/Roadmap.css';

const RoadmapComponent = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  const timelinePoints = [
    {
        "id": 1,
        "title": "Foundation",
        "content": "Building a strong base in mathematics and fundamental engineering principles.",
        "flashcards": [
            {
                "title": "Skills or Technologies",
                "content": "Algebra, Calculus, Trigonometry, Physics (Mechanics, Thermodynamics), CAD basics (AutoCAD, SolidWorks introduction), Introduction to Engineering Drawing"
            },
            {
                "title": "Time to dedicate",
                "content": "1-2 years (High School + First year of College)"
            },
            {
                "title": "Why learn",
                "content": "These are the building blocks for all subsequent mechanical engineering concepts.  A solid foundation ensures success in later stages."
            }
        ]
    },
    {
        "id": 2,
        "title": "Core Principles",
        "content": "Mastering core mechanical engineering subjects and developing problem-solving skills.",
        "flashcards": [
            {
                "title": "Skills or Technologies",
                "content": "Statics, Dynamics, Thermodynamics, Fluid Mechanics, Material Science, Manufacturing Processes, Mechanical Design, Finite Element Analysis (FEA) basics"
            },
            {
                "title": "Time to dedicate",
                "content": "2-3 years (Undergraduate coursework)"
            },
            {
                "title": "Why learn",
                "content": "This stage equips you with the theoretical knowledge and analytical skills to tackle complex engineering problems."
            }
        ]
    },
    {
        "id": 3,
        "title": "Specialized Knowledge",
        "content": "Focusing on a specific area of mechanical engineering and developing advanced skills.",
        "flashcards": [
            {
                "title": "Skills or Technologies",
                "content": "Robotics, Automotive Engineering, HVAC,  Advanced CAD (SolidWorks, Creo, etc.), FEA software (ANSYS, Abaqus), Programming (Python, MATLAB), Control Systems"
            },
            {
                "title": "Time to dedicate",
                "content": "1-2 years (Undergraduate specialization, internships, electives)"
            },
            {
                "title": "Why learn",
                "content": "Specialization allows you to develop expertise in a high-demand area, increasing job prospects and career advancement opportunities."
            }
        ]
    },
    {
        "id": 4,
        "title": "Practical Experience",
        "content": "Gaining hands-on experience through internships, projects, and research.",
        "flashcards": [
            {
                "title": "Skills or Technologies",
                "content": "Project management, teamwork, communication, problem-solving in real-world scenarios, specific software proficiency based on chosen specialization, experimental techniques"
            },
            {
                "title": "Time to dedicate",
                "content": "1-3 years (Internships, capstone projects, research)"
            },
            {
                "title": "Why learn",
                "content": "Practical experience bridges the gap between theory and practice, enhancing your skills and making you a more attractive candidate to employers."
            }
        ]
    },
    {
        "id": 5,
        "title": "Professional Development",
        "content": "Continuous learning and career advancement through professional certifications, networking, and further education.",
        "flashcards": [
            {
                "title": "Skills or Technologies",
                "content": "Professional certifications (PE license, industry-specific certifications), advanced software proficiency, leadership skills, continuing education (Master's degree, specialized courses)"
            },
            {
                "title": "Time to dedicate",
                "content": "Lifelong commitment"
            },
            {
                "title": "Why learn",
                "content": "The field of mechanical engineering is constantly evolving, so continuous learning is crucial for staying competitive and advancing your career."
            }
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
                  </button>
                  <div className="point-content">
                    <h3>{point.title}</h3>
                    <p>{point.content}</p>
                  </div>
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