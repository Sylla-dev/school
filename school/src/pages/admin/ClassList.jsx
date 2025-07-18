import React, { useEffect, useState } from 'react';
import { getClasses, deleteClass } from '../../services/classeService';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({});
  const classesPerPage = 5;

  const navigate = useNavigate();

  const loadClasses = () => {
    getClasses()
      .then(res => setClasses(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette classe ?")) {
      deleteClass(id).then(loadClasses);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const filtered = classes.filter(c =>
    c.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Regroupement par niveau
  const groupedClasses = filtered.reduce((acc, classe) => {
    if (!acc[classe.niveau]) acc[classe.niveau] = [];
    acc[classe.niveau].push(classe);
    return acc;
  }, {});

  const niveaux = Object.keys(groupedClasses);

  // Pagination par niveau
  const getCurrentPage = (niveau) => pagination[niveau] || 1;
  const setPageForNiveau = (niveau, page) => {
    setPagination(prev => ({ ...prev, [niveau]: page }));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Liste des classes</h2>
        <input
          type="text"
          placeholder="Rechercher par nom..."
          className="input input-bordered input-sm w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPagination({}); // Reset pagination on search
          }}
        />
      </div>

      <div className="space-y-10">
        {niveaux.length === 0 && (
          <p className="text-center text-gray-500 mt-20">Aucune classe trouvée.</p>
        )}

        {niveaux.map(niveau => {
          const totalPages = Math.ceil(groupedClasses[niveau].length / classesPerPage);
          const currentPage = getCurrentPage(niveau);
          const startIdx = (currentPage - 1) * classesPerPage;
          const currentClasses = groupedClasses[niveau].slice(startIdx, startIdx + classesPerPage);

          return (
            <section key={niveau} className="bg-base-100 p-6 rounded-lg shadow-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-primary">{niveau}</h3>
                <button
                  onClick={() => navigate("/admin/classes/new")}
                  className="btn btn-success btn-sm gap-2"
                  aria-label="Ajouter une nouvelle classe"
                >
                  <FaPlus /> Nouvelle
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Année scolaire</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentClasses.map(c => (
                      <tr key={c.id} className="hover">
                        <td>{c.nom}</td>
                        <td>{c.annee_scolaire}</td>
                        <td className="text-center space-x-2">
                          <button
                            onClick={() => navigate(`/admin/classes/edit/${c.id}`)}
                            className="btn btn-primary btn-xs gap-1"
                            aria-label={`Modifier la classe ${c.nom}`}
                          >
                            <FaEdit /> Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="btn btn-error btn-xs gap-1"
                            aria-label={`Supprimer la classe ${c.nom}`}
                          >
                            <FaTrash /> Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setPageForNiveau(niveau, currentPage - 1)}
                    className="btn btn-outline btn-sm"
                  >
                    Précédent
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPageForNiveau(niveau, n)}
                      className={`btn btn-sm ${currentPage === n ? 'btn-primary' : 'btn-outline'}`}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setPageForNiveau(niveau, currentPage + 1)}
                    className="btn btn-outline btn-sm"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
