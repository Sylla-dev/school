import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaAward, FaUser, FaGraduationCap } from 'react-icons/fa';

export default function BulletinEleve() {
  const [eleves, setEleves] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [bulletin, setBulletin] = useState(null);

  useEffect(() => {
    axios.get('https://school-school-backend.onrender.com/eleves')
      .then(res => {
        setEleves(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedId) {
      axios.get(`https://school-school-backend.onrender.com/bulletins/${selectedId}`)
        .then(res => setBulletin(res.data))
        .catch(err => console.error(err));
    } else {
      setBulletin(null);
    }
  }, [selectedId]);

  const groupBySemestre = (notes) => {
    return notes.reduce((acc, note) => {
      if (!acc[note.semestre_nom]) acc[note.semestre_nom] = [];
      acc[note.semestre_nom].push(note);
      return acc;
    }, {});
  };

  // Aplatir la structure des élèves si besoin (selon format de ta donnée)
  const tousLesEleves = Array.isArray(eleves) ? eleves : Object.values(eleves).flat();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary">Bulletin scolaire par élève</h1>

      {/* Sélecteur élève */}
      <select
        className="select select-bordered w-full max-w-sm"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">-- Sélectionnez un élève --</option>
        {tousLesEleves.map(e => (
          <option key={e.id} value={e.id}>
            {e.nom} {e.prenom}
          </option>
        ))}
      </select>

      {/* Affichage bulletin */}
      {bulletin && (
        <div className="card bg-base-100 shadow-md border border-base-300 p-6 print:bg-white print:border-none print:shadow-none rounded-lg">
          {/* Infos générales */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaUser className="text-primary" /> {bulletin.notes[0].eleve_nom} {bulletin.notes[0].eleve_prenom}
              </h2>
              <p className="flex items-center gap-2 mt-1">
                <FaGraduationCap className="text-primary" /> Classe : {bulletin.notes[0].classe_nom}
              </p>
              <p className="mt-1">Année scolaire : {bulletin.notes[0].annee_scolaire}</p>
            </div>
          </div>

          {/* Notes par semestre */}
          {Object.entries(groupBySemestre(bulletin.notes)).map(([semestre, notes]) => {
            const rang = bulletin.rangs.find(r => r.semestre_id === notes[0].semestre_id);
            const appreciation = bulletin.appreciations.find(a => a.semestre_id === notes[0].semestre_id);

            return (
              <div key={semestre} className="mb-8">
                <h3 className="text-lg font-bold mb-3 border-b border-primary pb-1">{semestre}</h3>

                <table className="table table-zebra w-full text-sm">
                  <thead>
                    <tr>
                      <th>Matière</th>
                      <th className="text-center">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map((n, idx) => (
                      <tr key={idx}>
                        <td>{n.matiere_nom}</td>
                        <td className="text-center">{n.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex flex-wrap gap-6 items-center">
                  <p className="font-semibold">Moyenne : {rang?.moyenne ?? '—'}</p>
                  <p className="font-semibold flex items-center gap-2">
                    <FaAward className="text-yellow-500" /> Rang : {rang?.rang ?? '—'} / {rang?.total ?? '—'}
                  </p>
                  <p className="italic">Appréciation : {appreciation?.appreciation || 'Aucune'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
