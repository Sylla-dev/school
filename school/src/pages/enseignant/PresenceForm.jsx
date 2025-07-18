import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserCheck, FaUserTimes, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PresenceForm() {
  const { id } = useParams();
  const coursId = id;
  const [groupedEleves, setGroupedEleves] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresences = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/presences/${coursId}`);
        const data = res.data;
        const formatted = {};

        for (const niveau in data) {
          formatted[niveau] = data[niveau].map(e => ({
            ...e,
            present: e.present === null ? true : Boolean(e.present),
            remarque: e.remarque || '',
          }));
        }

        setGroupedEleves(formatted);
      } catch (err) {
        console.error('Erreur lors du chargement des présences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPresences();
  }, [coursId]);

  const togglePresence = (niveau, index) => {
    const updated = { ...groupedEleves };
    updated[niveau][index].present = !updated[niveau][index].present;
    setGroupedEleves(updated);
  };

  const handleChange = (niveau, index, value) => {
    const updated = { ...groupedEleves };
    updated[niveau][index].remarque = value;
    setGroupedEleves(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allPresences = Object.values(groupedEleves).flat();

    try {
      await axios.post(`http://localhost:3000/api/presences/${coursId}`, {
        presences: allPresences,
      });
      alert('✅ Présences enregistrées avec succès.');
    } catch (error) {
      alert('❌ Erreur lors de l’enregistrement.');
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    Object.entries(groupedEleves).forEach(([niveau, eleves]) => {
      doc.text(`Niveau : ${niveau}`, 14, y);
      autoTable(doc, {
        startY: y + 5,
        head: [['Nom', 'Prénom', 'Présent', 'Remarque']],
        body: eleves.map(e => [
          e.nom,
          e.prenom,
          e.present ? '✔️' : '❌',
          e.remarque || '',
        ]),
      });
      y = doc.lastAutoTable.finalY + 10;
    });

    doc.save('feuille-presence.pdf');
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-lg text-gray-500">
        Chargement de la feuille de présence...
        <span className="loading loading-dots loading-md ml-2"></span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8 bg-white shadow rounded-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
          <FaUserCheck className="text-green-600" /> Feuille de présence
        </h2>
        <button
          type="button"
          onClick={handleExportPDF}
          className="btn btn-error btn-sm gap-2"
        >
          <FaFilePdf /> Export PDF
        </button>
      </div>

      {Object.entries(groupedEleves).map(([niveau, eleves]) => (
        <div key={niveau}>
          <h3 className="text-xl font-semibold text-blue-600 mb-3">
            📚 Niveau : {niveau}
          </h3>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full border border-base-300 rounded-box">
              <thead className="bg-base-200">
                <tr>
                  <th>Élève</th>
                  <th>Présence</th>
                  <th>Remarque</th>
                </tr>
              </thead>
              <tbody>
                {eleves.map((e, index) => (
                  <tr key={e.eleve_id}>
                    <td>{e.nom} {e.prenom}</td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => togglePresence(niveau, index)}
                        className={`btn btn-sm rounded-full ${
                          e.present ? 'btn-success' : 'btn-outline btn-error'
                        }`}
                        title={e.present ? 'Présent' : 'Absent'}
                      >
                        {e.present ? <FaUserCheck /> : <FaUserTimes />}
                      </button>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input input-bordered w-full input-sm"
                        placeholder="Remarque"
                        value={e.remarque}
                        onChange={(ev) => handleChange(niveau, index, ev.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="text-right">
        <button type="submit" className="btn btn-success text-white px-6">
          💾 Enregistrer les présences
        </button>
      </div>
    </form>
  );
}
