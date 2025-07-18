import React, { useEffect, useState } from 'react';
import { Eye, List, Calendar, Edit, Trash } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from 'axios';

const daysMap = {
  Lundi: 1,
  Mardi: 2,
  Mercredi: 3,
  Jeudi: 4,
  Vendredi: 5,
  Samedi: 6,
  Dimanche: 0
};

export default function EmploiDuTempsManager() {
  const [groupedClasses, setGroupedClasses] = useState({});
  const [selectedClassId, setSelectedClassId] = useState('');
  const [courses, setCourses] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Chargement des classes
  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:3000/api/classes")
      .then(res => {
        const grouped = res.data.reduce((acc, classe) => {
          if (!acc[classe.niveau]) acc[classe.niveau] = [];
          acc[classe.niveau].push(classe);
          return acc;
        }, {});
        setGroupedClasses(grouped);

        const firstLevel = Object.keys(grouped)[0];
        if (firstLevel && grouped[firstLevel][0]) {
          setSelectedClassId(grouped[firstLevel][0].id);
        } else {
          setSelectedClassId('');
        }
      })
      .catch(() => setError("Erreur lors du chargement des classes."))
      .finally(() => setLoading(false));
  }, []);

  // Chargement des cours selon la classe sélectionnée
  useEffect(() => {
    if (!selectedClassId) {
      setCourses([]);
      return;
    }
    setLoading(true);
    setError('');
    axios.get(`http://localhost:3000/api/emplois/classe/${selectedClassId}`)
      .then(res => setCourses(res.data))
      .catch(() => setError("Erreur lors du chargement des cours."))
      .finally(() => setLoading(false));
  }, [selectedClassId]);

  // Calcul date de la semaine en fonction du jour (Lundi -> date de ce lundi dans la semaine courante)
  const getDateForDay = (dayName) => {
    const dayIndex = daysMap[dayName];
    if (dayIndex === undefined) return null;
    const now = new Date();
    const diff = dayIndex - now.getDay();
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);
    return targetDate.toISOString().split('T')[0];
  };

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <h1 className='text-2xl font-semibold'>Emploi du Temps</h1>

        <select
          aria-label="Sélectionner une classe"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className='p-2 border rounded-xl w-full sm:w-64 cursor-pointer'
        >
          {Object.keys(groupedClasses).length === 0 && <option>Aucune classe disponible</option>}
          {Object.entries(groupedClasses).map(([level, classes]) => (
            <optgroup label={`Niveau ${level}`} key={level}>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className='flex gap-4 mb-4'>
        <button
          onClick={() => setViewMode("table")}
          className={`btn btn-sm btn-outline ${viewMode === "table" ? "btn-primary" : ""} flex items-center gap-2`}
          aria-pressed={viewMode === "table"}
          aria-label="Afficher en mode tableau"
        >
          <List size={18} /> Tableau
        </button>

        <button
          onClick={() => setViewMode("calendar")}
          className={`btn btn-sm btn-outline ${viewMode === "calendar" ? "btn-primary" : ""} flex items-center gap-2`}
          aria-pressed={viewMode === "calendar"}
          aria-label="Afficher en mode calendrier"
        >
          <Calendar size={18} /> Calendrier
        </button>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {!loading && !error && selectedClassId && courses.length === 0 && (
        <p className="text-gray-600">Aucun cours trouvé pour cette classe.</p>
      )}

      {!loading && !error && selectedClassId && courses.length > 0 && (
        viewMode === "table" ? (
          <div className='overflow-auto border rounded-lg shadow' id='emploi-table'>
            <table className='min-w-full text-sm'>
              <thead className='bg-primary text-primary-content'>
                <tr>
                  <th className='p-2 border'>Jour</th>
                  <th className='p-2 border'>Heure</th>
                  <th className='p-2 border'>Matière</th>
                  <th className='p-2 border'>Enseignant</th>
                  <th className='p-2 border'>Salle</th>
                  <th className='p-2 border'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id} className="hover:bg-gray-100">
                    <td className='p-2 border'>{c.jour_semaine}</td>
                    <td className='p-2 border'>{c.heure_debut} - {c.heure_fin}</td>
                    <td className='p-2 border'>{c.matiere}</td>
                    <td className='p-2 border'>{c.enseignant}</td>
                    <td className='p-2 border'>{c.salle}</td>
                    <td className='p-2 border flex gap-2'>
                      <button aria-label='Modifier' className='btn btn-xs btn-primary'><Edit size={16} /></button>
                      <button aria-label='Supprimer' className='btn btn-xs btn-error'><Trash size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView='timeGridWeek'
            allDaySlot={false}
            events={courses.map(c => {
              const date = getDateForDay(c.jour_semaine);
              return {
                title: `${c.matiere} - ${c.enseignant}`,
                start: date ? `${date}T${c.heure_debut}` : null,
                end: date ? `${date}T${c.heure_fin}` : null,
                allDay: false
              };
            }).filter(e => e.start !== null)}
            height='auto'
            slotMinTime='08:00:00'
            slotMaxTime='18:00:00'
            locale='fr'
            nowIndicator={true}
          />
        )
      )}
    </div>
  );
}
