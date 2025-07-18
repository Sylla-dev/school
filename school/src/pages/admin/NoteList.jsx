import React, { useEffect, useState } from 'react';
import { getNotes, deleteNote } from '../../services/noteService';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { SiVbulletin } from 'react-icons/si';

export default function NoteList() {
  const [groupedNotes, setGroupedNotes] = useState({});
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getNotes();
      const notes = res.data;

      const groupByNiveau = notes.reduce((acc, note) => {
        const niveau = note.niveau || 'Autre';
        if (!acc[niveau]) acc[niveau] = [];
        acc[niveau].push(note);
        return acc;
      }, {});
      setGroupedNotes(groupByNiveau);
    } catch (error) {
      console.error("Erreur de chargement des notes", error);
    }
  };

  const confirmDelete = async () => {
    await deleteNote(selectedNoteId);
    setSelectedNoteId(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📊 Liste des Notes par Niveau</h1>
        <Link to="/admin/notes/new" className="btn btn-primary gap-2">
          <FaPlus /> Ajouter une note
        </Link>
      </div>

      {Object.keys(groupedNotes).map((niveau) => (
        <div key={niveau} className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-1">
            🎓 Niveau : {niveau.charAt(0).toUpperCase() + niveau.slice(1)}
          </h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full shadow-md text-sm">
              <thead className="bg-base-200">
                <tr>
                  <th>Élève</th>
                  <th>Matière</th>
                  <th>Semestre</th>
                  <th>Note</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedNotes[niveau].map((note) => (
                  <tr key={note.id}>
                    <td>{note.eleve_nom} {note.prenom}</td>
                    <td>{note.matiere_nom}</td>
                    <td>{note.semestre_nom}</td>
                    <td className="text-center font-bold">{note.note}</td>
                    <td className="flex justify-center gap-2">
                      <Link to={`/admin/notes/edit/${note.id}`} className="btn btn-sm btn-warning btn-outline">
                        <FaEdit />
                      </Link>
                      <button onClick={() => setSelectedNoteId(note.id)} className="btn btn-sm btn-error btn-outline">
                        <FaTrash />
                      </button>
                      <button onClick={() => navigate(`/admin/bulletin/${note.id}`)} className="btn btn-sm btn-info btn-outline">
                        <SiVbulletin />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Modal de confirmation DaisyUI */}
      <dialog id="deleteModal" className="modal" open={selectedNoteId !== null}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-red-600">Confirmation</h3>
          <p className="py-4">Voulez-vous vraiment supprimer cette note ?</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setSelectedNoteId(null)}>Annuler</button>
            <button className="btn btn-error" onClick={confirmDelete}>Supprimer</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedNoteId(null)}>close</button>
        </form>
      </dialog>
    </div>
  );
}
