import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Auth from '../../utils/Auth';
import * as XLSX from 'xlsx'; 
import Navbar from '../Navbar';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [importError, setImportError] = useState(null); // State for import errors

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get('/user/forms', {
          headers: Auth.authHeader(),
          params: { userId: user._id },
        });
        setForms(response.data);
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchForms();
    }
  }, [user]);

  const handleDeleteSubmission = async (submissionId) => {
    try {
      await axios.delete(`/user/delete-form/${submissionId}`, {
        headers: Auth.authHeader(),
      });
      setForms(forms.filter((form) => form._id !== submissionId));
    } catch (error) {
      console.error('Error deleting form submission:', error);
    }
  };


  // Function to export data to Excel
  const handleExportExcel = () => {
    // Map the form data to match the Excel column structure
    const exportData = forms.map(form => ({
      "Date": form.formData.date,
      "Source": form.formData.source,
      "Processus": form.formData.process,
      "SITE": form.formData.site, 
      "Constat  non-conformité  /              piste d'amélioration": form.formData.constat,
      "Type d'action C/AC / AA": form.formData.typeAction,
      "Responsable /pilote PRC": form.formData.responsableTraitement,
      "Analyses des causes": form.formData.analysesCauses,
      "Risque": form.formData.risque,
      "libéllé de l'action  et sous action": form.formData.libelleAction,
      "Date prévue de réalisation": form.formData.datePrevueRealisation,
      "Date de vérification de l'efficacité de l'action": form.formData.dateVerificationEfficacite,
      "critères de vérification de l'efficacité (y compris cas similaires)": form.formData.criteresVerificationEfficacite,
      "vérification de l'efficacité": form.formData.verificationEfficacite,
      "Etat de la fiche Action": form.formData.etatAction,
      "Date de  Clôture de la fiche: Actions  et sous actions( date)": form.formData.dateClotureAction,
      "PLAN D'ACTION OUI / NON": form.formData.planAction, 
      "DOC enregistrement ou planification": form.formData.docEnregistrement,
      "nécessité de mise à jour des R/O": form.formData.necessityMajRO, 
      "nécessité de modifier le SMQ": form.formData.necessityModifierSMQ,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Form Submissions");
    XLSX.writeFile(workbook, "form_submissions.xlsx");
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); 
        handleImportExcel(jsonData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        setImportError('Invalid Excel file. Please upload a valid .xlsx or .xls file.');
      }
    };

    if (file) {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleImportExcel = async (data) => {
    try {
      setImportError(null);
      const dataStartRow = 8; // Data starts from row 8 (index 7)

      for (let i = dataStartRow; i < data.length; i++) {
        const rowData = data[i];
        console.log('rowData:', rowData);
        // Create formData object with your specific field names and order
        const formData = {
          date: convertDate(rowData[0]),
          source: rowData[1] || '',
          process: rowData[2] || '',
          site: rowData[3] || '',
          constat: rowData[4] || '',
          typeAction: rowData[5] || '',
          responsableTraitement: rowData[6] || '',
          analysesCauses: rowData[7] || '',
          risque: rowData[8] || '',
          libelleAction: rowData[9] || '',
          datePrevueRealisation: convertDate(rowData[10]),
          dateVerificationEfficacite: convertDate(rowData[11]),
          criteresVerificationEfficacite: rowData[12] || '',
          verificationEfficacite: rowData[13] || '',
          etatAction: rowData[14] || '',
          dateClotureAction: convertDate(rowData[15]),
          planAction: rowData[16] === 'OUI', // Boolean
          docEnregistrement: rowData[17] || '',
          necessityMajRO: rowData[18] === 'OUI', // Boolean
          necessityModifierSMQ: rowData[19] || '',
        };

        console.log('formData:', formData);

        // Send data to the backend
        await axios.post('/user/submit-form', {
          userId: user._id,
          formData,
        }, {
          headers: Auth.authHeader(),
        });
      }

      // ... (Re-fetch forms to update the UI)

    } catch (error) {
      console.error('Error importing Excel data:', error);
      setImportError('An error occurred during import: ' + error.message); 
    }
  };
  const convertDate = (excelDateValue) => {
    if (excelDateValue) {
      // Handle Excel numerical date format
      if (typeof excelDateValue === 'number') {
        const excelEpoch = new Date(1899, 11, 30); 
        const milliseconds = excelDateValue * 24 * 60 * 60 * 1000; 
        const date = new Date(excelEpoch.getTime() + milliseconds);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      } else if (typeof excelDateValue === 'string') {
        // Handle dd-mm-yyyy and dd/mm/yyyy string formats
        const dateParts = excelDateValue.split(/[-/]/); // Split by hyphen or slash
        if (dateParts.length === 3) {
          const [day, month, year] = dateParts;
          // Ensure day and month are two digits
          return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
        } else {
          console.warn('Invalid date string format:', excelDateValue);
          return '';
        }
      } else {
        console.warn('Date value is not a number or string:', excelDateValue);
        return '';
      }
    } else {
      return ''; // Return empty string for empty cells
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">User Information</h2>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        
        <p><strong>Forms Submitted:</strong> {forms.length}</p>

        {/* edit prodile button */}
        <Link to="/profile" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">
          Edit Profile
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Submit a New Form</h2>
        <Link to="/user/forms" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Forms
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Your Form Submissions</h2>
        {/* Display Import Error (if any) */}
        {importError && <div className="text-red-500 mb-4">{importError}</div>}

        {forms.length === 0 ? (
          <p>No form submissions yet.</p>
        ) : (
          <table className="table-auto w-full h-auto mb-4 ">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Source</th>
                <th className="px-4 py-2 text-left">Processus</th>
                {/* Add other table headers as needed based on your form data */}
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            {/* 

    make table display scrollable

    <tbody className="text-sm max-h-96 overflow-y-scroll">
            
            */ }
            <tbody className="text-sm h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {forms.map((form) => (
                <tr key={form._id}>
                  <td className="border px-4 py-2">
                    {new Date(form.formData.date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{form.formData.source}</td>
                  <td className="border px-4 py-2">{form.formData.process}</td>
                  {/* Add other table cells as needed based on your form data */}
                  <td className="border px-4 py-2">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/user/forms/${form._id}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteSubmission(form._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            
          </table>
        )}
          {/* Export/Import Buttons */}
          <div className="flex justify-end mt-4">
          <button
            onClick={handleExportExcel}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Export to Excel
          </button>
          <input
            type="file"
            id="importExcel"
            accept=".xlsx, .xls"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <label
            htmlFor="importExcel"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Import from Excel
          </label>
        </div>
      </div>

    </div>
    </>
  );
};

export default UserDashboard;