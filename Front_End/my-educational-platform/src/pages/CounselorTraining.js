import React, { useEffect, useState } from 'react';
import '../styles/CounselorTraining.css';
import HeaderStudent from '../components/HeaderStudent'; 

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

const CounselorTraining = () => {
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

  const stats = [
    { 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      label: 'Workshop Attend',
      value: '28'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
      label: 'Video Available',
      value: videos.length
    }
  ];

  return (
    <div className="counselor-training">
      <div className={`hero ${animate ? 'animate' : ''}`}>
        <HeaderStudent header_name={"Traningg"} />
      </div>

      <div className="content">
        <div className="stats">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`stat-card ${animate ? 'animate' : ''}`} style={{animationDelay: `${index * 0.2}s`}}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="video-list">
        <h2>Training Videos</h2>
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
        </div>
        
        
      </div>
    
  );
};

export default CounselorTraining;
