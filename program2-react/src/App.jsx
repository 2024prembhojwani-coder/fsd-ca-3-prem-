// Program 2 - React: College Event Registration
// CO3: functional components, JSX, props, state, useState/useEffect, conditional rendering, events, React Router.
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import RegistrationForm from "./components/RegistrationForm.jsx";
import RegistrationList from "./components/RegistrationList.jsx";

const STORAGE_KEY = "event-registrations";
const SAMPLE = [
  { id: 1, name: "Aarav Shah", email: "aarav@college.edu", event: "Hackathon", department: "AI&DS", year: 3 },
  { id: 2, name: "Diya Patil", email: "diya@college.edu", event: "Tech Quiz", department: "CS", year: 2 },
];

export default function App() {
  // State lives in the parent and is passed down using props
  const [registrations, setRegistrations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : SAMPLE;
  });

  // useEffect: persist whenever registrations change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
  }, [registrations]);

  const addRegistration = (data) =>
    setRegistrations((prev) => [...prev, { id: Date.now(), ...data }]);

  const deleteRegistration = (id) =>
    setRegistrations((prev) => prev.filter((r) => r.id !== id));

  return (
    <>
      <Navbar count={registrations.length} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home count={registrations.length} />} />
          <Route
            path="/register"
            element={<RegistrationForm onAdd={addRegistration} existing={registrations} />}
          />
          <Route
            path="/registrations"
            element={<RegistrationList items={registrations} onDelete={deleteRegistration} />}
          />
          <Route path="*" element={<h2>404 - Page not found</h2>} />
        </Routes>
      </main>
    </>
  );
}
