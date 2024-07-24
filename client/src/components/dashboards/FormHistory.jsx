import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from '../../utils/Auth';

const FormHistory = () => {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 
  const [searchQuery, setSearchQuery] = useState(''); // State for search
  const [searchBy, setSearchBy] = useState('formId'); // State for search type

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`/admin/form-history`, {
          headers: Auth.authHeader(),
        });
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching form history:', error);
      }
    };
    fetchHistory();
  }, []);

  // Filter the history based on searchQuery and searchBy
  const filteredHistory = history.filter(entry => {
    if (searchBy === 'formId') {
      return entry.formSubmissionId && entry.formSubmissionId.toString().includes(searchQuery);
    } else if (searchBy === 'userId') {
      return entry.userId && 
        (entry.userId.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
         entry.userId.lastName.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return true; // If no search, show all
  });

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search type change (formId or user)
  const handleSearchTypeChange = (e) => {
    setSearchBy(e.target.value);
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4 text-right">
        <input 
          type="text" 
          placeholder="Search by Form Id or User" 
          value={searchQuery} 
          onChange={handleSearchInputChange} 
          className="border rounded px-3 py-2 mr-2" 
        />

        {/* Search By Dropdown */}
        <select value={searchBy} onChange={handleSearchTypeChange} className="border rounded px-2 py-1">
          <option value="formId">Form Id</option>
          <option value="userId">User</option>
        </select>
      </div>

      {/* History Table */}
      <table className="table-auto w-full mb-4 bg-white shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2">Form Id</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Action</th>
            <th className="px-4 py-2">Timestamp</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map(entry => (
            <tr key={entry._id}>
              <td className="border px-4 py-2">{entry.formSubmissionId || '-'}</td>
              <td className="border px-4 py-2">{entry.userId ? `${entry.userId.firstName} ${entry.userId.lastName}` : '-'}</td>
              <td className="border px-4 py-2">{entry.action}</td>
              <td className="border px-4 py-2">{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default FormHistory;