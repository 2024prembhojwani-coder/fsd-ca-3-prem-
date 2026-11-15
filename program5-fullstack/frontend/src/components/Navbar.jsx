import { NavLink } from "react-router-dom";

export default function Navbar({ count }) {
  return (
    <nav className="navbar">
      <h1>College Events</h1>
      <div>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/register">Register</NavLink>
        <NavLink to="/registrations">Registrations ({count})</NavLink>
      </div>
    </nav>
  );
}
