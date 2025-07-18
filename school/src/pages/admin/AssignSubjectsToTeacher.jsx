import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaLink } from 'react-icons/fa';

export default function AssignSubjectsToTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' }); // {text: '', type: 'success'|'error'}

  useEffect(() => {
    axios.get('http://localhost:3000/api/enseignants')
      .then(res => setTeachers(res.data))
      .catch(() => setMessage({ text: "Erreur lors du chargement des enseignants.", type: "error" }));

    axios.get('http://localhost:3000/api/matieres')
      .then(res => setSubjects(res.data))
      .catch(() => setMessage({ text: "Erreur lors du chargement des matières.", type: "error" }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTeacher || selectedSubjects.length === 0) {
      setMessage({ text: "Sélectionnez un enseignant et au moins une matière.", type: "error" });
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/enseignant-matieres/assign', {
        enseignant_id: selectedTeacher,
        matiere_ids: selectedSubjects,
      });

      setMessage({ text: "Matières assignées avec succès !", type: "success" });
      setSelectedSubjects([]);
      setSelectedTeacher('');
    } catch (err) {
      setMessage({ text: "Erreur lors de l’assignation.", type: "error" });
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
        <FaLink /> Assigner des matières à un enseignant
      </h2>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">
            <span className="label-text font-semibold">Enseignant :</span>
          </label>
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">-- Sélectionnez un enseignant --</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>
                {t.nom} {t.prenom} ({t.specialite || 'Sans spécialité'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Matières :</span>
          </label>
          <select
            multiple
            value={selectedSubjects}
            onChange={(e) =>
              setSelectedSubjects(
                Array.from(e.target.selectedOptions, option => option.value)
              )
            }
            className="select select-bordered w-full h-40"
          >
            {subjects.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
          <span className="label-text-alt">Maintenez Ctrl (Cmd) pour sélectionner plusieurs matières.</span>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Lier les matières à l'enseignant
        </button>
      </form>
    </div>
  );
}
