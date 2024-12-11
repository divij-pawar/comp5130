import React from 'react';

function About() {
  return (
    <div className="container content-section about-page">
      <h1 className="page-title">About Switch</h1>
      <div className="page-content">
        <p>Created by Divij Pawar</p>
        <p>
          Welcome to <strong>Switch</strong>, a micro-marketplace designed specifically for your university community.
        </p>
        <p>
          At Switch, you can easily connect with other students to <strong>buy and sell</strong> various items like:
        </p>
        <ul>
          <li>Previous semester's textbooks</li>
          <li>Scientific instruments</li>
          <li>Calculators</li>
          <li>Stationery, electronics, and other student materials</li>
        </ul>
        <p>
          Our platform is designed to help you <strong>get rid of</strong> unused items or <strong>find great deals</strong> on things you need for your academic journey.
        </p>
        <p>
          Whether you're clearing out your dorm room or looking for secondhand materials, Switch is the perfect place for you.
        </p>
      </div>
      <h3 className="join-us">
        Hop on the trend and <strong>Join Us Now!</strong> 
        <a href="/signup" className="join-link">   Sign up</a> to start buying and selling today.
      </h3>
    </div>
  );
}

export default About;
