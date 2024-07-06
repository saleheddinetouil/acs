import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from '../../utils/Auth';

const FormHistory = () => {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 

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

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>

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

      {/* Pagination */}
      {itemsPerPage < history.length && (
      <div className="mt-4 flex justify-center">
        <ul className="flex">
          {/* Previous button */}
          <li className={`mr-2 ${currentPage === 1 ? 'disabled' : ''}`}>
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
          </li>
          {/* Page numbers */}
          {Array.from({ length: Math.ceil(history.length / itemsPerPage) }, (_, i) => (
            <li key={i + 1} className={`mr-2 ${currentPage === i + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          
          <li className={`${currentPage === Math.ceil(history.length / itemsPerPage) ? 'disabled' : ''}`}>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(history.length / itemsPerPage)}>
              Next
            </button>
          </li>
        </ul>
      </div>
      )}
    </div>
  );
};

export default FormHistory;