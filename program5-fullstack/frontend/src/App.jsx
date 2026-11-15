// Program 5 - React frontend integrated with Express + PostgreSQL backend
import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import RegistrationForm from "./components/RegistrationForm.jsx";
import RegistrationList from "./components/RegistrationList.jsx";
import * as api from "./api.js";

export default function App() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setRegistrations(await api.getRegistrations());
    } catch (err) {
      setError("Could not load registrations: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addRegistration = async (data) => {
    const created = await api.createRegistration(data);   // throws on API error
    setRegistrations((prev) => [...prev, created]);
  };

  const deleteRegistration = async (id) => {
    try {
      await api.deleteRegistration(id);
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar count={registrations.length} />
      <main className="container">
        {error && <p className="error">{error} <button className="btn" onClick={load}>Retry</button></p>}
        {loading ? <p>Loading...</p> : (
          <Routes>
            <Route path="/" element={<Home count={registrations.length} />} />
            <Route path="/register" element={<RegistrationForm onAdd={addRegistration} />} />
            <Route path="/registrations" element={<RegistrationList items={registrations} onDelete={deleteRegistration} />} />
            <Route path="*" element={<h2>404 - Page not found</h2>} />
          </Routes>
        )}
      </main>
    </>
  );
}
