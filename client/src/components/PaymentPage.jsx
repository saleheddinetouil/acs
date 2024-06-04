import React, { useState, useContext, useEffect } from 'react';
import {  Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Auth from '../utils/Auth';
import Navbar from './Navbar';


const PaymentPage = () => {
  const { user } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState(null); 
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  

  useEffect(() => {
    if (user && user.isPaid) {
      
      setPaymentStatus('paid'); // If admin is already paid, set status
      setTimeout(() => window.location.reload(), 3000); // Reload page after 3 seconds
    }
  }, [user]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setPaymentStatus(null); // Reset payment status when method changes
    setCardDetails({ 
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
    });
  };

  const handleCardDetailsChange = (event) => {
    const { name, value } = event.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleSubmitPayment = async (event) => {
    event.preventDefault();
    setPaymentStatus('processing');

    try {
      if (paymentMethod === 'cash') {
        // Send request to backend to notify superadmin about cash payment
        await axios.post('/admin/notify-cash-payment', { adminId: user._id }, {
          headers: Auth.authHeader(),
        });
        setPaymentStatus('pending'); // Set payment status to pending approval
      } else if (paymentMethod === 'card') {
        // Placeholder card validation (replace with actual validation logic)
        if (
          cardDetails.cardNumber.length === 16 &&
          cardDetails.expiryMonth >= 1 &&
          cardDetails.expiryMonth <= 12 &&
          cardDetails.expiryYear >= new Date().getFullYear() &&
          cardDetails.cvv.length === 3
        ) {
          // Send card details to backend for processing (replace with actual payment gateway integration)
          await axios.post('/admin/process-card-payment', {user,cardDetails}, {
            headers: Auth.authHeader(),
          });
          setPaymentStatus('paid');
        } else {
          throw new Error('Invalid card details.');
        }
      } else if (paymentMethod === 'wire_transfer') {
        // Send request to backend to notify superadmin about wire transfer
        await axios.post('/admin/notify-wire-transfer', { adminId: user._id }, {
          headers: Auth.authHeader(),
        });
        setPaymentStatus('pending'); // Set payment status to pending approval
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Payment</h1>

      {paymentStatus === 'paid' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Your account is active!
        </div>
        
      )}

      {paymentStatus === 'pending' && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Payment pending verification. Your account will be activated shortly.
        </div>
      )}

      {paymentStatus === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          An error occurred during payment. Please try again.
        </div>
      )}

      {paymentStatus !== 'paid' && ( 
        <form onSubmit={handleSubmitPayment} className="bg-white rounded-lg shadow-md p-6">
          {/* Payment Method Selection */}
          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block text-gray-700 font-bold mb-2">
              Select Payment Method:
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Method</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="wire_transfer">Wire Transfer</option>
            </select>
          </div>

          {/* Card Payment Form (Conditional) */}
          {paymentMethod === 'card' && (
            <div>
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-gray-700 font-bold mb-2">
                  Card Number:
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="expiryMonth" className="block text-gray-700 font-bold mb-2">
                  Expiry Month:
                </label>
                <input
                  type="number"
                  id="expiryMonth"
                  name="expiryMonth"
                  min="1"
                  max="12"
                  value={cardDetails.expiryMonth}
                  onChange={handleCardDetailsChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="expiryYear" className="block text-gray-700 font-bold mb-2">
                  Expiry Year:
                </label>
                <input
                  type="number"
                  id="expiryYear"
                  name="expiryYear"
                  min={new Date().getFullYear()} 
                  value={cardDetails.expiryYear}
                  onChange={handleCardDetailsChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cvv" className="block text-gray-700 font-bold mb-2">
                  CVV:
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  maxLength="3" 
                  value={cardDetails.cvv}
                  onChange={handleCardDetailsChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
          )}

          {/* Wire Transfer Information (Conditional) */}
          {paymentMethod === 'wire_transfer' && (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-bold mb-2">Bank Account Details:</h3>
              <p>Bank Name: [Bank Name]</p>
              <p>Account Number: [Account Number]</p>
              <p>SWIFT Code: [SWIFT Code]</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={paymentStatus === 'processing'} 
          >
            {paymentStatus === 'processing' ? 'Processing...' : 'Submit Payment'} 
          </button>
        </form>
      )}
    </div>
    </>
  );
};

export default PaymentPage;