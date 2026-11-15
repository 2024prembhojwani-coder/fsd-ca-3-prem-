import { Link } from "react-router-dom";

export default function Home({ count }) {
  return (
    <section className="card">
      <h2>Welcome!</h2>
      <p>Register for Hackathon, Tech Quiz, Cultural Fest and Sports Meet.</p>
      <p><strong>{count}</strong> student{count !== 1 && "s"} registered so far.</p>
      <Link className="btn" to="/register">Register now</Link>
    </section>
  );
}
