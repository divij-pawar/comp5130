// About.js
import React from 'react';
import '../styles/home.css';
import Navbar from '../components/Navbar';


const About = () => {
  return (
    <div className="content-section about-page">
      <Navbar /> {}
      <h1>About</h1>
      <br />
      <h6>
        <div>
          <p>
            Created by Divij Pawar
            <br />
          </p>
        </div>
        Switch is a local marketplace for your institution.
        <br />
        <b>Meet sellers and buyers</b> through our unique platform to help yourself{' '}
        <b>get rid of your previous semester's books, scientific instruments, calculators, and other material you have.</b>
      </h6>
      <h5>Hop on the trend, Join us <a href="/register">Now!</a></h5>
    </div>
  );
};

export default About;
