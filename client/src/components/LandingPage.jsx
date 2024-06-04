import React from 'react';
import Navbar from './Navbar';
import CTA from './CTA';
import Services from './Services';
import ContactForm from './ContactForm';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <CTA />
      <Services />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default LandingPage;