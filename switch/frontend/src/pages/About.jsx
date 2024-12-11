import React from 'react';

function About() {
  return (
    <div className="container content-section about-page">
      <h1 className="page-title">About</h1>
      <br />
      <div className="page-content">
        <p>Created by Divij Pawar</p>
        <p>
          Switch is a micro-marketplace for your university.
          <br />
          <b>Meet sellers and buyers</b> through our unique platform to help yourself{' '}
          <b>get rid of your previous semester's books, scientific instruments, calculators, and other material you have.</b>
        </p>
      </div>
      <h5 className="join-us">Hop on the trend, Join us <a href="/signup">Now!</a></h5>
    </div>
  );
}

export default About;
