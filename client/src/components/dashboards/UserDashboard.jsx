import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Auth from '../../utils/Auth';
import * as XLSX from 'xlsx'; 
import Navbar from '../Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [importError, setImportError] = useState(null); // State for import errors
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColumn, setFilterColumn] = useState(''); // Initial filter column
  const [sortDirection, setSortDirection] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Initial rows per page

  useEffect(() => {

    const fetchForms = async () => {
      try {
        const response = await axios.post('/user/forms',
          { adminId: user.adminId, userId: user._id }
        , {
          headers: Auth.authHeader(),
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

  const DeleteAll = async () => {
    try {
      await axios.delete(`/user/forms`, {
        headers: Auth.authHeader(),
      });

      setForms([]);
    } catch (error) {
      console.error('Error deleting all form submissions:', error);
    }

  };

  // Function to handle search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle filter column selection
  const handleFilterChange = (event) => {
    setFilterColumn(event.target.value);
  };

  // Function to handle sort direction selection
  const handleSortChange = (event) => {
    setSortDirection(event.target.value);
  };

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Filter, sort, and paginate data
  const filteredForms = forms.filter((form) => {
    // Search filter
    if (searchTerm) {
      if (!filterColumn) {
        return Object.values(form.formData).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      const searchTermLower = searchTerm.toLowerCase() || searchTerm.toString().toLowerCase();

      const formValue = form.formData[filterColumn].toLowerCase();
      return formValue.includes(searchTermLower);
    }
    return true;
  });

  // Sort data
  const sortedForms = [...filteredForms].sort((a, b) => {
    const columnValueA = a.formData[filterColumn];
    const columnValueB = b.formData[filterColumn];

    if (sortDirection === 'asc') {
      return columnValueA > columnValueB ? 1 : -1; 
    } else if (sortDirection === 'desc') {
      return columnValueA < columnValueB ? 1 : -1; 
    } else {
      return 0; 
    }
  });

  // Pagination
  const indexOfLastForm = currentPage * rowsPerPage;
  const indexOfFirstForm = indexOfLastForm - rowsPerPage;
  const currentForms = sortedForms.slice(indexOfFirstForm, indexOfLastForm);



// Function to delete a form submission
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
      const dataStartRow = 8 || 1; // Data starts from row 8 (index 7)

      for (let i = dataStartRow; i < data.length; i++) {
        const rowData = data[i];
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

        // Send data to the backend
        await axios.post('/user/submit-form', {
          adminId : user.adminId,
          userId: user._id,
          formData,
        }, {
          headers: Auth.authHeader(),
        });
      }

      // Refresh the form submissions
      const response = await axios.post('/user/forms', {
        adminId: user.adminId,
        userId: user._id,
      } ,{
        headers: Auth.authHeader(),
      });
      setForms(response.data);


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

     // Example data - adapt to your QMS data structure
     const totalForms = forms.length;
     const openActions = forms.filter(form => form.formData.etatAction === 'EN COURS').length;

     let clotureeActions = forms.filter(form => form.formData.etatAction === 'CLOTUREE').length;

     const actionClosureRate = (totalForms > 0) ? ((totalForms - openActions) / totalForms * 100).toFixed(2) : 0; 


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
    <Navbar />
    <div className=" mx-auto px-4 py-8">
      <h1 className="text-3xl text-+ font-bold mb-6">User Dashboard</h1>

  

      <div className="justify-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {/* Card 1: Total Forms */}
      <div className="bg-white rounded-lg shadow-lg p-6 bg-indigo-500"> 
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Total Forms</h3>
          <i className="fas fa-chart-line fa-2x text-white opacity-75"></i> {/* Font Awesome Icon */}
        </div>
        <p className="text-3xl font-bold text-white">{totalForms}</p> {/* Replace with your value */}
      </div>
      {/* Card 2: Closure rate */}
      <div className="bg-white rounded-lg shadow-lg p-6 bg-green-500">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Closure Rate</h3>
          <i className="fas fa-check-circle fa-2x text-white opacity-75"></i> {/* Font Awesome Icon */}
        </div>
        <p className="text-3xl font-bold text-white">{actionClosureRate}%</p> {/* Replace with your value */}
      </div>
      {/* Card 3: Closed Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6 bg-blue-500">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Closed Actions</h3>
          <i className="fas fa-check-circle fa-2x text-white opacity-75"></i> {/* Font Awesome Icon */}
        </div>
        <p className="text-3xl font-bold text-white">{clotureeActions}</p> {/* Replace with your value */}
      </div>

      {/* Card 4: Open Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6 bg-red-500"> 
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Open Actions</h3>
          <i className="fas fa-exclamation-circle fa-2x text-white opacity-75"></i> {/* Font Awesome Icon */}
        </div>
        <p className="text-3xl font-bold text-white">{openActions}</p> {/* Replace with your value */}
      </div>

      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">All Form Submissions</h2>
        {/* Display button add new form icon */}
        <div className="flex items-center mb-4 justify-end">
        <Link to="/user/forms" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          New Form
        </Link>
        </div>


        {/* Display a search Icon */}

        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 p-2 w-full"
            value={searchTerm}
            onChange={handleSearchChange} 
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        {/* Display filters   */}
        <div className="flex col items-center mb-4">
          <label>Filter:</label>
          <select className="m-2 border border-gray-300 p-2 w-1/3"  onChange={handleFilterChange}>
            <option value="">No.</option>
            
            <option value="date">Date</option>
            <option value="source">Source</option>
            <option value="process">Processus</option>
            <option value="site">Site</option>
            <option value="typeAction">Type d'action</option>
            <option value="etatAction">Etat de la fiche Action</option>
          </select>
          <label className="m-2">Sort:</label>
          <select className="border border-gray-300 p-2 w-1/3 ml-2"  onChange={handleSortChange}>
            <option value="">None</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <label className="m-2">Rows:</label>
          <select className="border border-gray-300 p-2 w-1/3 ml-2"  onChange={handleRowsPerPageChange}>
            <option value="1">1</option>
            <option value="5" selected>5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          
        </div>

        {/* Display Import Error (if any) */}
        {importError && <div className="text-red-500 mb-4">{importError}</div>}

        {currentForms.length === 0 ? (
          <p>No form submissions found.</p>
        ) : (
          <div className="overflow-x-auto overflow-y-scroll"> 
            <table className="table-auto w-full text-center h-96 overflow-y-scroll">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#f7cbac'}}>No.</th>
                  <th className="px-4 py-2 text-center bg-orange" style={{'background-color':'#f7cbac'}} >Date</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#f7cbac'}}>Source</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#f7cbac'}}>Processus</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#f7cbac'}}>Site</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#f7cbac'}}>Constat</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#f7cbac'}}>Type d'action</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#f7cbac'}}>Risque</th>

                  <th className="px-4 py-2 text-center" style={{'background-color':'#bdd7ee'}}>Responsable Traitement</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#bdd7ee'}}>Analyses Causes</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#bdd7ee'}}>Libellé Action</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#bdd7ee'}}>Date Prévue Réalisation</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#bdd7ee'}}>Date Vérification Efficacité</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#bdd7ee'}}>Critères Vérification Efficacité</th>
                  
                  <th className="px-4 py-2 text-center" style={{'background-color':'#a8d08d'}}>Vérification Efficacité</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#a8d08d'}}>Etat Action</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#a8d08d'}}>Date Clôture Action</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#a8d08d'}}>Plan Action</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#a8d08d'}}>DOC Enregistrement</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#a8d08d'}}>Necessity Maj RO</th>
                  <th className="px-4 py-2 text-center" style={{'background-color':'#a8d08d'}}>Necessity Modifier SMQ</th>
                  <th className="text-white px-4 py-2" style={{'background-color':'#ef4444'}} >Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm ">
                {currentForms.map((form) => (


                  <tr key={form._id}>
                    <td className="border px-4 py-2">{form.numId}</td>
                    <td className="border px-4 py-2" >{form.formData.date}</td>
                    <td className="border px-4 py-2">{form.formData.source}</td>
                    <td className="border px-4 py-2">{form.formData.process}</td>
                    <td className="border px-4 py-2">{form.formData.site}</td>
                    <td className="border px-4 py-2">{form.formData.constat}</td>
                    <td className="border px-4 py-2">{form.formData.typeAction}</td>
                    <td className="border px-4 py-2">{form.formData.risque}</td>
                    <td className="border px-4 py-2">{form.formData.responsableTraitement}</td>
                    <td className="border px-4 py-2">{form.formData.analysesCauses}</td>
                    <td className="border px-4 py-2">{form.formData.libelleAction}</td>
                    <td className="border px-4 py-2">{form.formData.datePrevueRealisation}</td>
                    <td className="border px-4 py-2">{form.formData.dateVerificationEfficacite}</td>
                    <td className="border px-4 py-2">{form.formData.criteresVerificationEfficacite}</td>
                    <td className="border px-4 py-2">{form.formData.verificationEfficacite}</td>
                    <td className="border px-4 py-2">{form.formData.etatAction}</td>
                    <td className="border px-4 py-2">{form.formData.dateClotureAction}</td>
                    <td className="border px-4 py-2">{form.formData.planAction ? 'OUI' : 'NON'}</td>
                    <td className="border px-4 py-2">{form.formData.docEnregistrement}</td>
                    <td className="border px-4 py-2">{form.formData.necessityMajRO ? 'OUI' : 'NON'}</td>
                    <td className="border px-4 py-2">{form.formData.necessityModifierSMQ}</td>
                    <td className="border  px-4 py-2 text-center whitespace-nowrap px-4 py-2">
                    <Link
                        to={`/user/forms/${form._id}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteSubmission(form._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Delete
                      </button>
                   
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> 
        )}
        {forms.length && (
        <div className="mt-4">
          {/* Pagination Buttons */}
          <nav aria-label="Page navigation example" className="flex justify-end">
            <ul className="inline-flex -space-x-px">
              <li className="page-item xl:mr-2">
                <button
                  className="page-link px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-700 focus:ring-offset-1 focus:ring-offset-gray-100 disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {/* ... (Pagination Buttons) */}
              <li className="page-item">
                <button
                  className="page-link px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-700 focus:ring-offset-1 focus:ring-offset-gray-100 disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(sortedForms.length / rowsPerPage)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
        {/* Display Import Error (if any) */}
        {importError && <div className="text-red-500 mb-4">{importError}</div>}

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
          {/* delete all */}
          <button
            onClick={() => DeleteAll()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Delete All
          </button>

        </div>
      </div>

    </div>
    </>
  );
};

export default UserDashboard;