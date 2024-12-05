import React, { useEffect, useState } from 'react';
import '../styles/AboutCareer.css';
import HeaderStudent from '../components/HeaderStudent';
import RoadmapComponent from '../components/Roadmap';
import { useSearchParams } from 'react-router-dom';
import { fetchYouTubeVideos, getSkillsComparison } from '../services/api';
import { useAuth } from '../AuthContext';

const AboutCareer = () => {
  const [searchParams] = useSearchParams();
  const { authToken, userData } = useAuth();
  const careerName = searchParams.get('careerName');
  const careerDescription = searchParams.get('careerDescription');
  const careerSalary = searchParams.get('careerSalary');
  const [animate, setAnimate] = useState(false);
  const [videos, setVideos] = useState([
    { videoUrl: 'https://www.youtube.com/embed/O3m14PVOq_g', },
    { videoUrl: 'https://www.youtube.com/embed/4e6KSaCxcHs' },
    { videoUrl: 'https://www.youtube.com/embed/Jl4Waz8TmyU' },
    { videoUrl: 'https://www.youtube.com/embed/DAtXIY3iwvg' },
    { videoUrl: 'https://www.youtube.com/embed/MIjH8MCbONI' }
  ]);
  const [skillsComparison, setSkillsComparison] = useState([]);
  const [prominentFigures, setProminentFigures] = useState([]);

  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      const queries = [
        `What is ${careerName}`,
        `A day in the life of ${careerName}`,
        `Roadmap to becoming a ${careerName}`,
        `How much does a ${careerName} earn`,
        `What attributes does a ${careerName} have`
      ];

      try {
        const videoData = await Promise.all(queries.map(query => fetchYouTubeVideos(query)));
        const updatedVideos = videoData.map((data, index) => ({
          videoUrl: `https://www.youtube.com/embed/${data[0].id.videoId}`,
          title: data[0].snippet.title
        }));
        setVideos(updatedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    const fetchSkillsComparison = async () => {
      try {
        const { skillsComparison, prominentFigures } = await getSkillsComparison(userData._id, careerName, authToken);
        setSkillsComparison(skillsComparison);
        setProminentFigures(prominentFigures);
      } catch (error) {
        console.error("Error fetching skills comparison:", error);
      }
    };

    fetchVideos();
    fetchSkillsComparison();
  }, [careerName]);

  return (
    <div className="about-career-container">
      <div className={`hero ${animate ? 'animate' : ''}`}>
        <HeaderStudent header_name={"Career Analysis"} />
      </div>

      <div className="content">
        <div className='career-breifing'>
          <h2 style={{ color: 'black' }}>{careerName}</h2>
          <h4 style={{ color: '#2c2c2c', marginBottom: '0px !important', marginTop: '10px' }}>Current Average Salary: {careerSalary}</h4>
          <h4 style={{ color: '#2c2c2c', marginBottom: '0px !important', marginTop: '10px' }}>Career Description:</h4>
          <p style={{ color: '#64748b' }}>{careerDescription}</p>
        </div>

        <h2 className='Section-Heading-Brefing-page'>Roadmap</h2>
        <RoadmapComponent careerName={careerName} />

        <h2 className='Section-Heading-Brefing-page'>Skill Sets Required</h2>
        <table className='salary-table'>
          <thead>
            <tr>
              <th>Skill Name</th>
              <th>Percent Required</th>
              <th>Current Proficiency</th>
            </tr>
          </thead>
          <tbody>
            {skillsComparison.map(skill => (
              <tr key={skill.skillName}>
                <td>{skill.skillName}</td>
                <td>{skill.avgPercentage}%</td>
                <td>{skill.currentPercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className='Section-Heading-Brefing-page' style={{ marginBottom: '0px' }}>Related Resources</h2>
        <div className="video-list">
          <div className="videos">
            {videos.map((video, index) => (
              <div key={video.videoUrl} className={`video-card ${animate ? 'animate' : ''}`} style={{ animationDelay: `${0.6 + index * 0.2}s` }}>
                <div className="video-thumbnail" style={{ position: 'relative' }}>
                  <iframe
                    src={video.videoUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <h4>{video.title}</h4>
              </div>
            ))}
          </div>
        </div>

        <h2 className='Section-Heading-Brefing-page' style={{ marginBottom: '0px' }}>Prominent People</h2>
        <div className="Prominent-People">
          {prominentFigures.map((figure, index) => (
            <div key={index} className='stat-card' style={{ border: '1px solid var(--border-color)', width: "28%" }}>
              <h3>{figure.name}</h3>
              <p>{figure.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutCareer;