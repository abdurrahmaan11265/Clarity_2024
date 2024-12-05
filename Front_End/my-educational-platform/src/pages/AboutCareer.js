import React, { useEffect, useState } from 'react';
import '../styles/AboutCareer.css';
import HeaderStudent from '../components/HeaderStudent'; 
import RoadmapComponent from '../components/Roadmap';

const fetchVideoTitle = async (videoUrl) => {
  const videoId = videoUrl.split('/embed/')[1];
  if (!videoId) return 'Unknown Title';

  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    const data = await response.json();
    return data.title; // Fetches the video title from YouTube's oEmbed API
  } catch (error) {
    console.error('Failed to fetch video title:', error);
    return 'Unknown Title';
  }
};

const AboutCareer = () => {
  const [animate, setAnimate] = useState(false);
  const [videos, setVideos] = useState([
    { videoUrl: 'https://www.youtube.com/embed/MRkNd_UrzUE', }, 
    { videoUrl: 'https://www.youtube.com/embed/UVN96JhDOmg' },
    { videoUrl: 'https://www.youtube.com/embed/bgC6ZLE8QhY'},
    { videoUrl: 'https://www.youtube.com/embed/BuhF_vMuXpI' },
    {videoUrl: 'https://www.youtube.com/embed/TUMmLkFKpEI' }
  ]);

  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    const updateVideoTitles = async () => {
      const updatedVideos = await Promise.all(
        videos.map(async (video) => {
          const fetchedTitle = await fetchVideoTitle(video.videoUrl);
          return { ...video, title: fetchedTitle };
        })
      );
      setVideos(updatedVideos);
    };

    updateVideoTitles();
  }, []);



  return (
    <div className="about-career-container">
      <div className={`hero ${animate ? 'animate' : ''}`}>
        <HeaderStudent header_name={"Career Analysis"}/>
      </div>

    <div className="content">
        
        <div className='career-breifing'>
            <h2 style={{color: 'black'}}>Career Name</h2>
            <h4 style={{color: '#2c2c2c', marginBottom: '0px !important', marginTop: '10px'}}>Current Average Salary: </h4>
            <h4 style={{color: '#2c2c2c', marginBottom: '0px !important', marginTop: '10px'}}>Career Description:</h4>
            <p style={{color: '#64748b'}}>The sun was setting over the rolling hills of the countryside, casting a warm orange glow over the landscape. A gentle breeze rustled the leaves of the trees, causing the branches to sway softly in the wind. In a nearby field, a group of cows lazily grazed on the lush green grass, their moos carrying on the breeze. As the stars began to twinkle in the night sky, a lone firefly flickered to life, its light dancing across the darkness like a tiny lantern. Meanwhile, in a small village nestled in the valley below, a young girl sat on a windowsill, her nose pressed against the glass as she gazed out at the peaceful scene unfolding before her.</p>
        </div>

        <h2 className='Section-Heading-Brefing-page'>Roadmap</h2>

        <RoadmapComponent />

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
                <tr>
                    <td>Web Development</td>
                    <td>75%</td>
                    <td>75%</td>
                </tr>
                <tr>
                    <td>Data Science</td>
                    <td>60%</td>
                    <td>60%</td>
                </tr>
                <tr>
                    <td>UI/UX Design</td>
                    <td>85%</td>
                    <td>85%</td>
                </tr>
            </tbody>
        </table>
        

        <h2 className='Section-Heading-Brefing-page' style={{marginBottom: '0px'}}>Related Resources</h2>
        
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

        <h2 className='Section-Heading-Brefing-page' style={{marginBottom: '0px'}}>Prominent People</h2>
        <div className="Prominent-People" >
          <div className='stat-card' style={{border: '1px solid var(--border-color)',width:"28%"}}>
            <h3>Name</h3>
            <p>Description</p>
          </div>
          <div className='stat-card' style={{border: '1px solid var(--border-color)',width:"28%"}}>
          <h3>Name</h3>
          <p>Description</p>
          </div>
          <div className='stat-card' style={{border: '1px solid var(--border-color)',width:"28%"}}>
          <h3>Name</h3>
          <p>Description</p>
          </div>

        </div>
        </div>

        
        
        
      </div>
    
  );
};

export default AboutCareer;
