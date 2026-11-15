import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegistrationList({ items, onDelete }) {
  const [query, setQuery] = useState("");
  const filtered = items.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.event.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="card">
      <h2>Registrations</h2>
      <input
        className="search"
        placeholder="Search by name or event..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filtered.length === 0 ? (
        <p>No registrations found. <Link to="/register">Add one</Link></p>
      ) : (
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Event</th><th>Dept</th><th>Year</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td><td>{r.email}</td><td>{r.event}</td>
                <td>{r.department}</td><td>{r.year}</td>
                <td><button className="btn danger" onClick={() => onDelete(r.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
