import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaChalkboardTeacher, FaBook, FaSchool, FaClock, FaDoorOpen, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function EmploiDuTempsForm() {
  const [form, setForm] = useState({
    enseignant_id: "",
    matiere_id: "",
    jour_semaine: "Lundi",
    heure_debut: "08:00",
    heure_fin: "09:00",
    salle: "",
    classe_id: ""
  });

  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3000/api/classes"),
      axios.get("http://localhost:3000/api/enseignants"),
      axios.get("http://localhost:3000/api/matieres"),
    ])
      .then(([resClasses, resEnseignants, resMatieres]) => {
        setClasses(resClasses.data);
        setEnseignants(resEnseignants.data);
        setMatieres(resMatieres.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erreur lors du chargement des données.");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification simple : heure_debut < heure_fin
    if (form.heure_debut >= form.heure_fin) {
      toast.warning("L'heure de début doit être antérieure à l'heure de fin.");
      return;
    }

    setLoading(true);
    axios.post("http://localhost:3000/api/emplois", form)
      .then(() => {
        toast.success("Créneau ajouté avec succès !");
        setForm({
          enseignant_id: "",
          matiere_id: "",
          jour_semaine: "Lundi",
          heure_debut: "08:00",
          heure_fin: "09:00",
          salle: "",
          classe_id: ""
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erreur lors de l'enregistrement.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-6 p-6 bg-white shadow-xl rounded-xl space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
        <FaSave /> Ajouter un créneau
      </h2>

      {/* Classe */}
      <div>
        <label className="label font-semibold flex items-center gap-2">
          <FaSchool /> Classe
        </label>
        <select
          name="classe_id"
          value={form.classe_id}
          onChange={(e) => setForm({ ...form, classe_id: e.target.value })}
          required
          className="select select-bordered w-full"
        >
          <option value="">-- Choisir une classe --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
      </div>

      {/* Enseignant */}
      <div>
        <label className="label font-semibold flex items-center gap-2">
          <FaChalkboardTeacher /> Enseignant
        </label>
        <select
          value={form.enseignant_id}
          onChange={(e) => setForm({ ...form, enseignant_id: e.target.value })}
          required
          className="select select-bordered w-full"
        >
          <option value="">-- Choisir un enseignant --</option>
          {enseignants.map((e) => (
            <option key={e.id} value={e.id}>{e.nom}</option>
          ))}
        </select>
      </div>

      {/* Matière */}
      <div>
        <label className="label font-semibold flex items-center gap-2">
          <FaBook /> Matière
        </label>
        <select
          value={form.matiere_id}
          onChange={(e) => setForm({ ...form, matiere_id: e.target.value })}
          required
          className="select select-bordered w-full"
        >
          <option value="">-- Choisir une matière --</option>
          {matieres.map((m) => (
            <option key={m.id} value={m.id}>{m.nom}</option>
          ))}
        </select>
      </div>

      {/* Jour */}
      <div>
        <label className="label font-semibold flex items-center gap-2">
          <FaClock /> Jour de la semaine
        </label>
        <select
          value={form.jour_semaine}
          onChange={(e) => setForm({ ...form, jour_semaine: e.target.value })}
          className="select select-bordered w-full"
        >
          {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map((j) => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>
      </div>

      {/* Horaires */}
      <div>
        <label className="label font-semibold flex items-center gap-2">
          <FaClock /> Horaire
        </label>
        <div className="flex gap-4">
          <input
            type="time"
            value={form.heure_debut}
            onChange={(e) => setForm({ ...form, heure_debut: e.target.value })}
            className="input input-bordered w-full"
            required
          />
          <input
            type="time"
            value={form.heure_fin}
            onChange={(e) => setForm({ ...form, heure_fin: e.target.value })}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      {/* Salle */}
      <div>
        <label className="label font-semibold flex items-center gap-2">
          <FaDoorOpen /> Salle
        </label>
        <input
          type="text"
          value={form.salle}
          onChange={(e) => setForm({ ...form, salle: e.target.value })}
          placeholder="Ex: B203"
          className="input input-bordered w-full"
          required
        />
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          type="submit"
          disabled={loading}
          className={`btn btn-success w-full flex items-center justify-center gap-2 ${loading && "btn-disabled"}`}
        >
          <FaSave />
          {loading ? "Ajout en cours..." : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
