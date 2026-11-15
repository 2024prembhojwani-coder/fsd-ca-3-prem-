import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "./FormField.jsx";

const EVENTS = ["Hackathon", "Tech Quiz", "Cultural Fest", "Sports Meet"];
const DEPARTMENTS = ["AI&DS", "CS", "IT", "EXTC"];
const EMPTY = { name: "", email: "", event: "", department: "", year: "" };

function validate(v) {
  const e = {};
  if (!/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(v.name.trim())) e.name = "Enter a valid name (2-50 letters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter a valid email.";
  if (!v.event) e.event = "Select an event.";
  if (!v.department) e.department = "Select a department.";
  if (!(Number(v.year) >= 1 && Number(v.year) <= 4)) e.year = "Year must be 1-4.";
  return e;
}

export default function RegistrationForm({ onAdd }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    try {
      setApiError("");
      await onAdd({
        ...values,
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        year: Number(values.year),
      });
    } catch (err) {
      setApiError(err.message);          // e.g. duplicate registration from the server
      return;
    }
    setSubmitted(true);                       // conditional rendering
    setValues(EMPTY);
    setTimeout(() => navigate("/registrations"), 1000);
  };

  return (
    <section className="card">
      <h2>Event Registration</h2>
      {apiError && <p className="error">{apiError}</p>}
      {submitted && <p className="success">Registration successful! Redirecting...</p>}
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Name" error={errors.name}>
          <input name="name" value={values.name} onChange={handleChange} />
        </FormField>
        <FormField label="Email" error={errors.email}>
          <input name="email" type="email" value={values.email} onChange={handleChange} />
        </FormField>
        <FormField label="Event" error={errors.event}>
          <select name="event" value={values.event} onChange={handleChange}>
            <option value="">-- Select --</option>
            {EVENTS.map((ev) => <option key={ev}>{ev}</option>)}
          </select>
        </FormField>
        <FormField label="Department" error={errors.department}>
          <select name="department" value={values.department} onChange={handleChange}>
            <option value="">-- Select --</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </FormField>
        <FormField label="Year" error={errors.year}>
          <input name="year" type="number" min="1" max="4" value={values.year} onChange={handleChange} />
        </FormField>
        <button className="btn" type="submit">Register</button>
      </form>
    </section>
  );
}
