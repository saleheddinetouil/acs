import React from 'react';

const Services = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service 1: Sourcing */}
          <div className="bg-white rounded-md shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Vehicle Sourcing
            </h3>
            <p className="text-gray-600">
              We help you find the perfect vehicle from trusted suppliers worldwide, 
              ensuring quality and meeting your specific requirements.
            </p>
          </div>

          {/* Service 2: Shipping & Logistics */}
          <div className="bg-white rounded-md shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Shipping & Logistics
            </h3>
            <p className="text-gray-600">
              We handle all aspects of international shipping, customs clearance, and 
              domestic transportation, delivering your vehicle safely and efficiently.
            </p>
          </div>

          {/* Service 3: Compliance & Documentation */}
          <div className="bg-white rounded-md shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Compliance & Documentation
            </h3>
            <p className="text-gray-600">
              We ensure all import regulations are met, handling necessary 
              paperwork and documentation for a smooth and hassle-free import process. 
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;