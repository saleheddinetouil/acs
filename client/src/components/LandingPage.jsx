import React from 'react';
import Navbar from './Navbar'; // Assuming you have a Navbar component

import Footer from './Footer'; // Assuming you have a Footer component



// Import your icon library (e.g., Font Awesome, Heroicons)
// Example for Font Awesome:
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDatabase,
  faCogs,
  faChartLine,
  faCheckCircle,
  faFileAlt,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate } from 'react-router-dom';

const LandingPage = () => {

  return (
    <div>
      {/* add loading bars tailwindcss
      <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
*/}
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Streamline Your Quality Management
          </h1>
          <p className="text-lg mb-8">
            Simplify processes, gain control, and drive continuous improvement
            with our powerful QMS solution.
          </p>
          <Link className="bg-white text-blue-500 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 shadow-md transform transition duration-300 hover:scale-105" to="/signup">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Key Features for Effective Quality Control
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Centralized Data Management */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"> 
              <div className="mb-4 text-blue-500">
                <FontAwesomeIcon icon={faDatabase} size="3x" /> {/* Icon */}
              </div>
              <h3 className="text-xl font-bold mb-4">
                Centralized Data Management
              </h3>
              <p className="text-gray-700 text-center">
                Manage all your quality data in one central location for easy
                access, tracking, and analysis.
              </p>
            </div>

            {/* Feature 2: Automated Workflows */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <div className="mb-4 text-purple-500">
                <FontAwesomeIcon icon={faCogs} size="3x" /> {/* Icon */}
              </div>
              <h3 className="text-xl font-bold mb-4">
                Automated Workflows
              </h3>
              <p className="text-gray-700 text-center">
                Streamline your quality processes with automated workflows for
                non-conformances, corrective actions, and audits.
              </p>
            </div>

            {/* Feature 3: Real-Time Reporting */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <div className="mb-4 text-green-500">
                <FontAwesomeIcon icon={faChartLine} size="3x" /> {/* Icon */}
              </div>
              <h3 className="text-xl font-bold mb-4">
                Real-Time Reporting and Analytics
              </h3>
              <p className="text-gray-700 text-center">
                Gain insights into your quality performance with real-time
                reporting and powerful analytics dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Benefits of a Robust QMS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1: Increased Efficiency */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <div className="mb-4 text-yellow-500">
                <FontAwesomeIcon icon={faCheckCircle} size="3x" /> {/* Icon */}
              </div>
              <h3 className="text-xl font-bold mb-4">Increased Efficiency</h3>
              <p className="text-gray-700 text-center">
                Simplify and automate tasks, reducing manual effort and
                improving overall operational efficiency.
              </p>
            </div>

            {/* Benefit 2: Improved Compliance */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <div className="mb-4 text-red-500">
                <FontAwesomeIcon icon={faFileAlt} size="3x" /> {/* Icon */}
              </div>
              <h3 className="text-xl font-bold mb-4">Improved Compliance</h3>
              <p className="text-gray-700 text-center">
                Ensure compliance with industry standards and regulations,
                reducing the risk of audits and penalties.
              </p>
            </div>

            {/* Benefit 3: Enhanced Customer Satisfaction */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <div className="mb-4 text-indigo-500">
                <FontAwesomeIcon icon={faUsers} size="3x" /> {/* Icon */}
              </div>
              <h3 className="text-xl font-bold mb-4">
                Enhanced Customer Satisfaction
              </h3>
              <p className="text-gray-700 text-center">
                Deliver higher-quality products and services, leading to
                increased customer satisfaction and loyalty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-500 text-white py-12 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-10">
            Start Optimizing Your Quality Management Today
          </h2>
          <Link className=" bg-white text-blue-500 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 shadow-md transform transition duration-300 hover:scale-105" to="/signup">
            Request a Demo
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;