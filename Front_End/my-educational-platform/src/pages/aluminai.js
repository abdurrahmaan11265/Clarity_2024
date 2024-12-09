import React from 'react';
import { FaUser, FaInstagram, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import '../styles/aluminai.css';
import HeaderStudent from '../components/HeaderStudent';
import BackGroundAluminai from '../assests/background_aluminai.svg';

const AlumniCard = ({ name, description, instagram, whatsapp, linkedin }) => (
  <div className="alumni-card" >
    <div className="profile-picture">
      <FaUser />
    </div>
    <h2>{name}</h2>
    <p>{description}</p>
    <div className="social-icons">
      {instagram && (
        <a href={instagram} target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
      )}
      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp />
        </a>
      )}
      {linkedin && (
        <a href={linkedin} target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
      )}
    </div>
  </div>
);

const Aluminai = () => {
  const alumni = [
    {
      name: "John Doe",
      description: "Full Stack Developer | React Enthusiast",
      instagram: "https://instagram.com/johndoe",
      whatsapp: "https://wa.me/1234567890",
      linkedin: "https://linkedin.com/in/johndoe"
    },
    {
      name: "Jane Smith",
      description: "UX Designer | Creative Thinker",
      instagram: "https://instagram.com/janesmith",
      linkedin: "https://linkedin.com/in/meow"
    },
    {
      name: "Mike Johnson",
      description: "Data Scientist | AI Researcher",
      whatsapp: "https://wa.me/9876543210",
      linkedin: "https://linkedin.com/in/bowbow"
    }
  ];

  return (
    <div className="aluminai-page" >
      <HeaderStudent header_name={"Alumni"} />
      <div className="alumni-grid">
        {alumni.map((alum, index) => (
          <AlumniCard key={index} {...alum} />
        ))}
      </div>
    </div>
  );
};

export default Aluminai;

