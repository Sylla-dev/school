import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBookOpen, FaChalkboardTeacher } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

export default function TeacherSubjectsList() {
  const [enseignants, setEnseignants] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger la liste des enseignants
  useEffect(() => {
    axios.get('http://localhost:3000/api/enseignants')
      .then(res => setEnseignants(res.data))
      .catch(err => console.error("Erreur chargement enseignants :", err));
  }, []);

  // Charger les matières lorsque l’enseignant change
  useEffect(() => {
    if (selectedId) {
      setLoading(true);
      axios.get(`http://localhost:3000/api/enseignant-matieres/${selectedId}`)
        .then(res => {
          setMatieres(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Erreur chargement matières assignées :', err);
          setMatieres([]);
          setLoading(false);
        });
    } else {
      setMatieres([]);
    }
  }, [selectedId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaChalkboardTeacher className="text-primary" />
          Sélectionnez un enseignant
        </h2>

        <select
          className="select select-bordered mt-3 w-full max-w-md"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Choisir un enseignant --</option>
          {enseignants.map((ens) => (
            <option key={ens.id} value={ens.id}>
              {ens.nom} {ens.prenom}
            </option>
          ))}
        </select>
      </div>

      {selectedId && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg font-semibold flex items-center gap-2 mb-2">
              <FaBookOpen className="text-secondary" />
              Matières de l’enseignant #{selectedId}
            </h3>

            {loading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <ImSpinner2 className="animate-spin" />
                Chargement des matières...
              </div>
            ) : matieres.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matieres.map((m) => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>{m.nom}</td>
                        <td>{m.description || 'Aucune'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="italic text-gray-500">Aucune matière assignée.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
