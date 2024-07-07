import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import Auth from '../../../utils/Auth';
import Navbar from '../../Navbar';

const QMSForm = () => {
  const { user } = useContext(AuthContext);
  const { formSubmissionId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ecart');

  const [formData, setFormData] = useState({
    date: '',
    source: '',
    process: '',
    site: '',
    constat: '',
    typeAction: '',
    risque: '',
    responsableTraitement: '',
    analysesCauses: '',
    libelleAction: '',
    datePrevueRealisation: '',
    dateVerificationEfficacite: '',
    criteresVerificationEfficacite: '',
    verificationEfficacite: '',
    etatAction: '',
    dateClotureAction: '',
    planAction: 'NON',
    docEnregistrement: '',
    necessityMajRO: 'NON',
    necessityModifierSMQ: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormSubmission = async () => {
      if (formSubmissionId) {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `/user/forms/${formSubmissionId}`,
            
            {

              headers: Auth.authHeader(),
            }
          );
          setFormData({
            ...response.data.formData, // Directly set the formData from the response
          });
        } catch (error) {
          console.error('Error fetching form submission:', error);
          setError('Error fetching form submission.');
        } finally {
          setIsLoading(false);
        }
      } else {
        // Set default date to today in "dd-mm-yyyy" format
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        setFormData((prevData) => ({
          ...prevData,
          date: `${day}/${month}/${year}`,
        }));
      }
    };

    fetchFormSubmission();
  }, [formSubmissionId]);

  // Dropdown options based on "CAHIER DE CHARGE"
  const sourceOptions = [
    'Audit tierce partie',
    'Audit interne',
    'Recommandation',
    'Réunion',
    'Revue Direction',
    'Personnel',
    'Dysfonctionnement',
    'Réclamation',
    'NC prestation',
    'Autres',
  ];

  const processOptions = [
    'Direction et AC',
    'Commercial',
    'Exploitation',
    'Achats',
    'Infrastructure',
    'Ressources Humaines',
    // Add more processes if needed
  ];

  const siteOptions = ['RADES' || 'Rades' || 'RADES'.toLowerCase() ,'SOUSSE'|| 'Sousse' || 'SOUSSE'.toLowerCase(),'SFAX'|| 'Sfax' || 'SFAX'.toLowerCase()];

  const typeActionOptions = ['C', 'AC', 'AA'];

  const risqueOptions = [
    'NC légales et réglementaire'.toLocaleLowerCase(),
    'Client non satisfait',
    'Pérennité organisme',
    'Qualité service affectée',
    'Processus n\'est pas bien suivi et évalué', 
    'Amélioration non assurée',
    'Perte des connaissances',
    'Perturbation dans la réalisation',
    'Mesure non appropriée',
    'Autres',
  ];

  const etatActionOptions = ['EN COURS', 'CLOTUREE', 'REPORTEE'];

  const planActionOptions = ['OUI', 'NON'];
  const necessityMajROOptions = ['OUI', 'NON'];

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      if (formSubmissionId) {
        // Update existing form submission
        await axios.put(`/user/update-form/${formSubmissionId}`, { userId:user._id, formData }, {
          headers: Auth.authHeader(),
        });
      } else {
        // Submit new form submission
        await axios.post('/user/submit-form', { 
          adminId : user.adminId,
          userId: user._id,
          formData 
        }, {
          headers: Auth.authHeader(),
        });
      }
      navigate('/'+Auth.getRole()); // Redirect to user dashboard after submission
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Error submitting form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

   // Modified handleDateChange to work with all date formats
   const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Function to convert date to "dd-mm-yyyy" format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 w-96">
        <h1 className="text-3xl font-bold mb-4">
          {formSubmissionId ? 'Edit/View QMS Form' : 'New QMS Form'}
        </h1>
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6 justify-center">
          <button 
            onClick={() => setActiveTab('ecart')}
            className={`py-2 px-4 font-medium text-gray-700 ${activeTab === 'ecart' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Écarts
          </button>
          <button 
            onClick={() => setActiveTab('critere')}
            className={`py-2 px-4 font-medium text-gray-700 ${activeTab === 'critere' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Critères d’évaluations
          </button>
          <button 
            onClick={() => setActiveTab('efficacite')}
            className={`py-2 px-4 font-medium text-gray-700 ${activeTab === 'efficacite' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Efficacité des actions
          </button>
        </div>
        {error && <div className="text-red-500 mb-4 text-left">{error}</div>}
        {isLoading && <div>Loading...</div>}
        {!isLoading && activeTab === 'ecart' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {/* Date */}
            <div className="mb-4 text-left">
              <label
                htmlFor="date"
                className="block text-gray-700 font-bold mb-2"
              >
                Date:
              </label>
              <input
                disabled={Auth.getRole() !== 'user'}  
                type="date"
                
                id="date"
                name="date"
                value={formData.date} 
                onChange={handleDateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              />
            </div>

            {/* Source (Dropdown) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="source"
                className="block text-gray-700 font-bold mb-2"
              >
                Source:
              </label>
              <select
                disabled={Auth.getRole() !== 'user'}  
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              >
                <option value="">Select Source</option>
                {sourceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Process (Dropdown) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="process"
                className="block text-gray-700 font-bold mb-2"
              >
                Processus:
              </label>
              <select
                disabled={Auth.getRole() !== 'user'}  
                id="process"
                name="process"
                value={formData.process}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              >
                <option value="">Select Process</option>
                {processOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Site (Dropdown) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="site"
                className="block text-gray-700 font-bold mb-2"
              >
                Site:
              </label>
              <select
                disabled={Auth.getRole() !== 'user'}  
                id="site"
                name="site"
                value={formData.site}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              >
                <option value="">Select Site</option>
                {siteOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Constat (Text Input) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="constat"
                className="block text-gray-700 font-bold mb-2"
              >
                Constat:
              </label>
              <input
                disabled={Auth.getRole() !== 'user'}  

                type="text"
                id="constat"
                name="constat"
                value={formData.constat}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              />
            </div>

            {/* Type Action (Dropdown) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="typeAction"
                className="block text-gray-700 font-bold mb-2"
              >
                Type d'Action:
              </label>
              <select
                disabled={Auth.getRole() !== 'user'}  
                id="typeAction"
                name="typeAction"
                value={formData.typeAction}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              >
                <option value="">Select Type d'Action</option>
                {typeActionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Risque (Dropdown) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="risque"
                className="block text-gray-700 font-bold mb-2"
              >
                Risque:
              </label>
              <select
                disabled={Auth.getRole() !== 'user'}  
                id="risque"
                name="risque"
                value={formData.risque.toLocaleLowerCase()}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              >
                <option value="">Select Risque</option>
                {risqueOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={Auth.getRole() !== 'user'}  
            >
              {formSubmissionId ? 'Save Changes' : 'Submit Form'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/'+Auth.getRole())}
              className="ml-4 bg-gray-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>

          </form>
        )}
        {!isLoading && activeTab === 'critere' && (

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            
            <div className="mb-4 text-left">
              <label
                htmlFor="responsableTraitement"
                className="block text-gray-700 font-bold mb-2"
              >
                Responsable de Traitement:
              </label>
              <input
                disabled={Auth.getRole() !== 'user'}  
                type="text"
                id="responsableTraitement"
                name="responsableTraitement"
                value={formData.responsableTraitement}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              />
            </div>

            {/* Analyses Causes (Text Input) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="analysesCauses"
                className="block text-gray-700 font-bold mb-2"
              >
                Analyse des Causes:
              </label>
              <input
                disabled={Auth.getRole() !== 'user'}  
                type="text"
                id="analysesCauses"
                name="analysesCauses"
                value={formData.analysesCauses}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              />
            </div>

            {/* Libellé de l'Action (Text Input) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="libelleAction"
                className="block text-gray-700 font-bold mb-2"
              >
                Libellé de l'Action:
              </label>
              <input
                disabled={Auth.getRole() !== 'user'}  
                type="text"
                id="libelleAction"
                name="libelleAction"
                value={formData.libelleAction}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              />
            </div>

            {/* Date prévue de réalisation (Date Input) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="datePrevueRealisation"
                className="block text-gray-700 font-bold mb-2"
              >
                Date prévue de réalisation:
              </label>
              <input
                disabled={Auth.getRole() !== 'user'}  
                type="date"
                id="datePrevueRealisation"
                name="datePrevueRealisation"
                value={formatDate(formData.datePrevueRealisation)} // Format the date
                onChange={handleDateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              />
            </div>

            {/* Date de vérification de l'efficacité (Date Input) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="dateVerificationEfficacite"
                className="block text-gray-700 font-bold mb-2"
              >
                Date de vérification de l'efficacité:
              </label>
              <input
                disabled={Auth.getRole() !== 'user'}  
                type="date"
                id="dateVerificationEfficacite"
                name="dateVerificationEfficacite"
                value={formatDate(formData.dateVerificationEfficacite)}
                onChange={handleDateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              />
            </div>

            {/* Critères de vérification de l'efficacité (Text Input) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="criteresVerificationEfficacite"
                className="block text-gray-700 font-bold mb-2"
              >
                Critères de vérification de l'efficacité:
              </label>
              <input
                disabled={Auth.getRole() !== 'user'}  
                type="text"
                id="criteresVerificationEfficacite"
                name="criteresVerificationEfficacite"
                value={formData.criteresVerificationEfficacite}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {formSubmissionId ? 'Save Changes' : 'Submit Form'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/'+Auth.getRole())}
              className="ml-4 bg-gray-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            
            </form>
        
        )}
        {!isLoading && activeTab === 'efficacite' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            
            {/* Etat de l'Action (Dropdown) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="etatAction"
                className="block text-gray-700 font-bold mb-2"
              >
                État de l'Action:
              </label>
              <select
                disabled={Auth.getRole() !== 'user'}  
                id="etatAction"
                name="etatAction"
                value={formData.etatAction}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              >
                <option value="">Select État de l'Action</option>
                {etatActionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Date de Clôture de l'Action (Date Input) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="dateClotureAction"
                className="block text-gray-700 font-bold mb-2"
              >
                Date de Clôture de l'Action:
              </label>
              <input
                disabled={Auth.getRole() !== 'user'}  
                type="date"
                id="dateClotureAction"
                name="dateClotureAction"
                value={formatDate(formData.dateClotureAction)}
                onChange={handleDateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              />
            </div>

            {/* Plan d'Action (Dropdown) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="planAction"
                className="block text-gray-700 font-bold mb-2"
              >
                Plan d'Action:
              </label>
              <select
                disabled={Auth.getRole() !== 'user'}  
                id="planAction"
                name="planAction"
                value={formData.planAction}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              >
                {planActionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Documents d'Enregistrement (Text Input) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="docEnregistrement"
                className="block text-gray-700 font-bold mb-2"
              >
                Documents d'Enregistrement:
              </label>
              <input
                disabled={Auth.getRole() !== 'user'}  
                type="text"
                id="docEnregistrement"
                name="docEnregistrement"
                value={formData.docEnregistrement}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              />
            </div>

            {/* Nécessité de mise à jour des R/O (Dropdown) */}
            <div className="mb-4 text-left">
              <label
                htmlFor="necessityMajRO"
                className="block text-gray-700 font-bold mb-2"
              >
                Nécessité de mise à jour des R/O:
              </label>
              <select
                disabled={Auth.getRole() !== 'user'}  
                id="necessityMajRO"
                name="necessityMajRO"
                value={formData.necessityMajRO}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              >
                {necessityMajROOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Nécessité de modifier le SMQ (Text Input) */}
            <div className="mb-6  text-left">
              <label
                htmlFor="necessityModifierSMQ"
                className="block text-gray-700 font-bold mb-2"
              >
                Nécessité de modifier le SMQ:
              </label>
              <input
                disabled={Auth.getRole() !== 'user'}  
                type="text"
                id="necessityModifierSMQ"
                name="necessityModifierSMQ"
                value={formData.necessityModifierSMQ}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {formSubmissionId ? 'Save Changes' : 'Submit Form'}
            </button>
            <button 
               disabled={Auth.getRole() !== 'user'}  
              type="button"
              onClick={() => navigate('/'+Auth.getRole())}
              className="ml-4 bg-gray-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>

            </form>


          )}
      </div>
    </>
  );
};

export default QMSForm;