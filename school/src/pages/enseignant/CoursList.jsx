import React, { useEffect, useState } from 'react';
import { getCoursPaged, deleteCours, getClasses } from '../../services/courService';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaTrashAlt, FaEdit, FaUserMinus } from 'react-icons/fa';

export default function CoursList() {
  const [cours, setCours] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCours, setTotalCours] = useState(0);
  const navigate = useNavigate();

  const limit = 10;

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchCours();
  }, [selectedClasse, currentPage]);

  const fetchClasses = async () => {
    const res = await getClasses();
    setClasses(res.data);
  };

  const fetchCours = async () => {
    try {
      const res = await getCoursPaged({
        classe_id: selectedClasse || undefined,
        page: currentPage,
        limit,
      });
      setCours(res.data.cours);
      setTotalCours(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression du cours ?")) return;
    await deleteCours(id);
    fetchCours();
  };

  const totalPages = Math.ceil(totalCours / limit);

  const groupedCours = cours.reduce((groups, c) => {
    const niveau = c.classe_niveau || 'Sans niveau';
    if (!groups[niveau]) groups[niveau] = [];
    groups[niveau].push(c);
    return groups;
  }, {});

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📚 Liste des Cours</h1>
        <Link to="/teachers/cours/new" className="btn btn-primary gap-2">
          <FaPlus /> Ajouter
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label className="label-text">Filtrer par classe :</label>
        <select
          className="select select-bordered max-w-xs"
          value={selectedClasse}
          onChange={(e) => {
            setCurrentPage(1);
            setSelectedClasse(e.target.value);
          }}
        >
          <option value="">Toutes les classes</option>
          {Object.entries(
            classes.reduce((grouped, cls) => {
              if (!grouped[cls.niveau]) grouped[cls.niveau] = [];
              grouped[cls.niveau].push(cls);
              return grouped;
            }, {})
          ).map(([niveau, classesDuNiveau]) => (
            <optgroup key={niveau} label={niveau}>
              {classesDuNiveau.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.nom}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {Object.keys(groupedCours).length === 0 ? (
        <p className="text-center text-gray-500">Aucun cours disponible.</p>
      ) : (
        Object.entries(groupedCours).map(([niveau, coursDuNiveau]) => (
          <div key={niveau} className="mb-8">
            <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-1">{niveau}</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Classe</th>
                    <th>Matière</th>
                    <th>Enseignant</th>
                    <th>Date</th>
                    <th>Début</th>
                    <th>Fin</th>
                    <th>Contenu</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coursDuNiveau.map((c) => (
                    <tr key={c.id}>
                      <td>{c.classe_nom} ({c.classe_niveau})</td>
                      <td>{c.matiere_nom}</td>
                      <td>{c.enseignant_nom} {c.enseignant_prenom}</td>
                      <td>{new Date(c.date_cours).toLocaleDateString()}</td>
                      <td>{c.heure_debut}</td>
                      <td>{c.heure_fin}</td>
                      <td>{c.contenu}</td>
                      <td className="flex gap-2 justify-center">
                        <button onClick={() => navigate(`/teachers/cours/edit/${c.id}`)} className="btn btn-sm btn-outline btn-info">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="btn btn-sm btn-outline btn-error">
                          <FaTrashAlt />
                        </button>
                        <button onClick={() => navigate(`/teachers/presences/${c.id}`)} className="btn btn-sm btn-outline btn-success">
                          <FaUserMinus />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
