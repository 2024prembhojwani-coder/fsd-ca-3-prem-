// Program 1 - College Event Registration (HTML + CSS + JS)
// CO1: DOM manipulation, events, validation.  CO2: Fetch API, async/await, HTTP methods, JSON.

const DATA_URL = "events.json";                       // GET  -> sample data (JSON)
const API_URL  = "https://jsonplaceholder.typicode.com/posts"; // POST -> demo of JSON request/response

let registrations = [];
let nextId = 1;

const $ = (id) => document.getElementById(id);
const form = $("regForm"), tbody = $("tbody"), statusEl = $("status");

/* ---------- Validation ---------- */
const rules = {
  name:       (v) => (/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(v) ? "" : "Enter a valid name (2-50 letters)."),
  email:      (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address."),
  event:      (v) => (v ? "" : "Please select an event."),
  department: (v) => (v ? "" : "Please select a department."),
  year:       (v) => (Number.isInteger(+v) && +v >= 1 && +v <= 4 ? "" : "Year must be between 1 and 4."),
};

function validateField(field) {
  const el = $(field);
  const msg = rules[field](el.value.trim());
  $(field + "Err").textContent = msg;
  el.classList.toggle("invalid", !!msg);
  return !msg;
}
const validateAll = () => Object.keys(rules).map(validateField).every(Boolean);

Object.keys(rules).forEach((f) => $(f).addEventListener("blur", () => validateField(f)));

/* ---------- Rendering (DOM manipulation) ---------- */
function setStatus(msg, ok = true) {
  statusEl.textContent = msg;
  statusEl.className = ok ? "ok" : "fail";
}

function render() {
  const q = $("search").value.trim().toLowerCase();
  const ev = $("filterEvent").value;
  const rows = registrations.filter((r) =>
    (!ev || r.event === ev) &&
    (!q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q))
  );

  tbody.innerHTML = "";
  rows.forEach((r) => {
    const tr = document.createElement("tr");
    [r.id, r.name, r.email, r.event, r.department, r.year].forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val;               // textContent avoids XSS
      tr.appendChild(td);
    });
    const td = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.className = "del";
    btn.addEventListener("click", () => removeRegistration(r.id));
    td.appendChild(btn);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
  $("count").textContent = `Showing ${rows.length} of ${registrations.length} registrations`;
}

function refreshEventFilter() {
  const current = $("filterEvent").value;
  const events = [...new Set(registrations.map((r) => r.event))].sort();
  $("filterEvent").innerHTML = '<option value="">All events</option>' +
    events.map((e) => `<option>${e}</option>`).join("");
  $("filterEvent").value = events.includes(current) ? current : "";
}

/* ---------- Fetch API (GET) ---------- */
async function loadRegistrations() {
  try {
    setStatus("Loading...");
    const res = await fetch(DATA_URL, { method: "GET", headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    registrations = await res.json();
    nextId = Math.max(0, ...registrations.map((r) => r.id)) + 1;
    refreshEventFilter();
    render();
    setStatus("Data loaded with GET (JSON).");
  } catch (err) {
    setStatus("Could not load data: " + err.message, false);
  }
}

/* ---------- Fetch API (POST with JSON body) ---------- */
async function addRegistration(data) {
  try {
    setStatus("Submitting...");
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const echoed = await res.json();                 // server response (JSON)
    console.log("POST response:", echoed);
  } catch (err) {
    // Offline / blocked network: still keep the record locally so the demo works.
    console.warn("POST failed, saving locally:", err.message);
  }
  registrations.push({ id: nextId++, ...data });
  refreshEventFilter();
  render();
  setStatus("Registration added (POST sent with JSON body).");
}

/* ---------- Delete (DELETE method demo) ---------- */
async function removeRegistration(id) {
  if (!confirm("Delete this registration?")) return;
  try {
    await fetch(`${API_URL}/1`, { method: "DELETE" }); // demo endpoint
  } catch (e) { /* ignore network errors for demo */ }
  registrations = registrations.filter((r) => r.id !== id);
  refreshEventFilter();
  render();
  setStatus("Registration deleted (DELETE).");
}

/* ---------- Events ---------- */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateAll()) return setStatus("Please fix the errors above.", false);

  const data = {
    name: $("name").value.trim(),
    email: $("email").value.trim().toLowerCase(),
    event: $("event").value,
    department: $("department").value,
    year: Number($("year").value),
  };
  if (registrations.some((r) => r.email === data.email && r.event === data.event))
    return setStatus("This email is already registered for that event.", false);

  await addRegistration(data);
  form.reset();
});

$("search").addEventListener("input", render);
$("filterEvent").addEventListener("change", render);
$("reload").addEventListener("click", loadRegistrations);

loadRegistrations();
