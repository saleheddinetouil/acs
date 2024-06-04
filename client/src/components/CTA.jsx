import React from 'react';

const CTA = () => {
    const navigate = () => {
        window.location.href = '/signup';
    };
    return (
        <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
            Ready to get your quality management system in order?
            </h2>
            <p className="mb-6">
            Sign up for an account today and get started!
            </p>
            <button className="bg-white text-blue-600 py-2 px-6 rounded-full"onClick={navigate} >
            Sign up
            </button>
        </div>
        </section>
    );
    }

export default CTA;