import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaLayerGroup } from "react-icons/fa";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ eleves: 0, enseignants: 0, matieres: 0, classes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://school-school-backend.onrender.com/dashboard/stats');
        setStats(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const data = [
    { name: "Élèves", total: stats.eleves, color: "#3b82f6" },
    { name: "Enseignants", total: stats.enseignants, color: "#10b981" },
    { name: "Matières", total: stats.matieres, color: "#facc15" },
    { name: "Classes", total: stats.classes, color: "#ef4444" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-4 text-lg font-semibold">Chargement des statistiques...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-xl mx-auto mt-10">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-base-200">
      <div className="flex-1 flex flex-col">
        <header className="p-6 bg-base-100 border-b shadow-sm">
          <h1 className="text-3xl font-bold text-primary mb-6">Tableau de bord admin</h1>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="card bg-blue-500 text-white shadow-lg">
              <div className="card-body flex items-center gap-4">
                <FaUserGraduate size={36} />
                <div>
                  <h2 className="card-title text-lg">Élèves</h2>
                  <p className="text-3xl font-extrabold">{stats.eleves}</p>
                </div>
              </div>
            </div>

            <div className="card bg-green-500 text-white shadow-lg">
              <div className="card-body flex items-center gap-4">
                <FaChalkboardTeacher size={36} />
                <div>
                  <h2 className="card-title text-lg">Enseignants</h2>
                  <p className="text-3xl font-extrabold">{stats.enseignants}</p>
                </div>
              </div>
            </div>

            <div className="card bg-yellow-400 text-white shadow-lg">
              <div className="card-body flex items-center gap-4">
                <FaBook size={36} />
                <div>
                  <h2 className="card-title text-lg">Matières</h2>
                  <p className="text-3xl font-extrabold">{stats.matieres}</p>
                </div>
              </div>
            </div>

            <div className="card bg-red-500 text-white shadow-lg">
              <div className="card-body flex items-center gap-4">
                <FaLayerGroup size={36} />
                <div>
                  <h2 className="card-title text-lg">Classes</h2>
                  <p className="text-3xl font-extrabold">{stats.classes}</p>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-8 bg-base-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Statistiques visuelles</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {data.map((entry) => (
                  <Bar key={entry.name} dataKey="total" fill={entry.color} name={entry.name} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </section>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-base-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
