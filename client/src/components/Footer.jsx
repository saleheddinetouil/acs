import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/4 px-4 mb-6 md:mb-0">
            <h4 className="text-lg font-bold mb-4">About Us</h4>
            <p className="text-sm">ACS QMS is a company specialized in Quality Management Systems. We provide consulting services and training to help you get your ISO certification.</p>
          </div>
          <div className="w-full md:w-1/4 px-4 mb-6 md:mb-0">
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <p className="text-sm font-medium">Phone: +1 123 456 789</p>
            <p className="text-sm font-medium">Email:
              <a href="mailto:testacsqms@gmail.com" className="text-blue-400 hover:underline">
                contact@acsqms.tn 
              </a>
            </p>
          </div>
          <div className="w-full md:w-1/4 px-4 mb-6 md:mb-0">
            <h4 className="text-lg font-bold mb-4">Address</h4>
            <p className="text-sm font-medium">ACS</p>
            <p className="text-sm font-medium">L'Aouina, Diar Sokra D472</p>
    
          </div>
          <div className="w-full md:w-1/4 px-4 mb-6 md:mb-0">
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4 items-center justify-start">
              <a href="#" className="hover:text-blue-400">
                <i className="fab fa-facebook-f text-2xl"></i>
              </a>
              <a href="#" className="hover:text-blue-400">
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              <a href="https://www.linkedin.com/in/ab-consulting-et-services-benhamad-03b43424/" className="hover:text-blue-400">

                <i className="fab fa-linkedin-in text-2xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 text-center mt-8">
        <p className="text-sm">
          © {new Date().getFullYear()} ACS QMS. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;