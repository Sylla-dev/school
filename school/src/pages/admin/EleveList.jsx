import React, { useEffect, useState } from 'react';
import { getEleves, deleteEleve } from "../../services/eleveService";
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

export default function EleveList() {
  const [groupedEleves, setGroupedEleves] = useState({});
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({});
  const perPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    getEleves().then((res) => {
      setGroupedEleves(res.data);
      const initialPagination = {};
      Object.keys(res.data).forEach(niveau => {
        initialPagination[niveau] = 1;
      });
      setPagination(initialPagination);
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      await deleteEleve(id);
      loadData();
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handlePageChange = (niveau, page) => {
    setPagination(prev => ({
      ...prev,
      [niveau]: page
    }));
  };

  const filterEleves = (eleves) =>
    eleves.filter((e) =>
      `${e.nom} ${e.prenom} ${e.classe_nom}`.toLowerCase().includes(search)
    );

  return (
    <div className='p-4 sm:p-6 ma max-w-7xl mx-auto'>
      {/* Titre + bouton ajout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Liste des élèves</h1>
        <Link
          to='/admin/eleves/new'
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm sm:text-base'
        >
          <FaPlus /> Ajouter un élève
        </Link>
      </div>

      {/* Recherche */}
      <input
        type='text'
        placeholder='🔍 Rechercher par nom, prénom ou classe...'
        value={search}
        onChange={handleSearch}
        className='mb-8 w-64 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-wrap'
      />

      {/* Liste par niveau */}
      {Object.entries(groupedEleves).map(([niveau, eleves]) => {
        const filtered = filterEleves(eleves);
        const totalPages = Math.ceil(filtered.length / perPage);
        const currentPage = pagination[niveau] || 1;
        const startIndex = (currentPage - 1) * perPage;
        const currentEleves = filtered.slice(startIndex, startIndex + perPage);

        if (filtered.length === 0) return null;

        return (
          <div key={niveau} className="mb-4">
            <h2 className="text-lg font-semibold mb-3 text-blue-700">{niveau}</h2>

            {/* Tableau responsive */}
            <div className="overflow-x-auto md:flex flex-wrap">
              <table className='table'>
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className='p-2 text-left'>Matricule</th>
                    <th className='p-2 text-left'>Nom</th>
                    <th className='p-2 text-left'>Prénom</th>
                    <th className='p-2 text-left'>Naissance</th>
                    <th className='p-2 text-left'>Sexe</th>
                    <th className='p-2 text-left'>Classe</th>
                    <th className='p-2 text-center'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEleves.map((e) => (
                    <tr key={e.id} className="border-t hover:bg-gray-50">
                      <td className='p-2'>{e.matricule}</td>
                      <td className='p-2'>{e.nom}</td>
                      <td className='p-2'>{e.prenom}</td>
                      <td className='p-2'>{new Date(e.date_naissance).toLocaleDateString()}</td>
                      <td className='p-2'>{e.sexe}</td>
                      <td className='p-2'>{e.classe_nom}</td>
                      <td className='p-2'>
                        <div className='flex justify-center gap-3'>
                          <button
                            onClick={() => navigate(`/admin/eleves/edit/${e.id}`)}
                            className='text-blue-600 hover:text-blue-800'
                            title='Modifier'
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(e.id)}
                            className='text-red-600 hover:text-red-800'
                            title='Supprimer'
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination mobile-friendly */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => handlePageChange(niveau, n)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === n
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    } transition`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
