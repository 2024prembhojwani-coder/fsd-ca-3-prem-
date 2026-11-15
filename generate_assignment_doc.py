import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

doc = docx.Document()

# Set standard 1-inch margins
for section in doc.sections:
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)

# Configure base styles
style_normal = doc.styles['Normal']
style_normal.font.name = 'Calibri'
style_normal.font.size = Pt(10)
style_normal.font.color.rgb = RGBColor(0x22, 0x22, 0x22)

def add_header_block():
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_title = p.add_run("FULL STACK DEVELOPMENT – PROGRAMMING EXERCISE\n")
    run_title.bold = True
    run_title.font.size = Pt(16)
    run_title.font.color.rgb = RGBColor(0x1B, 0x36, 0x5D)
    
    run_sub = p.add_run("Individual Practical Assignment | B.E. (AI & DS) | Semester V\n")
    run_sub.font.size = Pt(11)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(0x55, 0x55, 0x55)
    
    # Metadata table
    table = doc.add_table(rows=2, cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = 'Table Grid'
    
    cells = table.rows[0].cells
    cells[0].text = "Student Roll No.:"
    cells[0].paragraphs[0].runs[0].bold = True
    cells[1].text = "04"
    cells[2].text = "Student Name:"
    cells[2].paragraphs[0].runs[0].bold = True
    cells[3].text = "Prem KK Bhojwani"
    
    cells2 = table.rows[1].cells
    cells2[0].text = "Subject:"
    cells2[0].paragraphs[0].runs[0].bold = True
    cells2[1].text = "Full Stack Development: Web Dev"
    cells2[2].text = "Topic & Programs:"
    cells2[2].paragraphs[0].runs[0].bold = True
    cells2[3].text = "College Event Registration (5 Programs)"
    
    doc.add_paragraph().paragraph_format.space_after = Pt(12)

def add_code_file(filename, filepath):
    if not os.path.exists(filepath):
        return
    p_header = doc.add_paragraph()
    p_header.paragraph_format.space_before = Pt(8)
    p_header.paragraph_format.space_after = Pt(2)
    run_fname = p_header.add_run(f"File: {filename}")
    run_fname.bold = True
    run_fname.font.size = Pt(10.5)
    run_fname.font.color.rgb = RGBColor(0x00, 0x4D, 0x80)

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            code = f.read()
    except Exception:
        with open(filepath, 'r', encoding='latin1') as f:
            code = f.read()

    # Add code block with distinct styling
    p_code = doc.add_paragraph()
    p_code.paragraph_format.space_before = Pt(0)
    p_code.paragraph_format.space_after = Pt(6)
    p_code.paragraph_format.line_spacing = 1.05
    run_code = p_code.add_run(code)
    run_code.font.name = 'Consolas'
    run_code.font.size = Pt(8.5)
    run_code.font.color.rgb = RGBColor(0x1F, 0x23, 0x28)

def add_image_if_exists(image_path, caption=None):
    if os.path.exists(image_path):
        if caption:
            p_cap = doc.add_paragraph()
            p_cap.paragraph_format.space_before = Pt(6)
            p_cap.paragraph_format.space_after = Pt(2)
            r = p_cap.add_run(caption)
            r.bold = True
            r.font.size = Pt(9.5)
            r.font.color.rgb = RGBColor(0x33, 0x33, 0x33)
        p_img = doc.add_paragraph()
        p_img.paragraph_format.space_before = Pt(2)
        p_img.paragraph_format.space_after = Pt(10)
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p_img.add_run()
        run.add_picture(image_path, width=Inches(6.5))

add_header_block()

# ----------------- PROGRAM 1 -----------------
p1_q = doc.add_paragraph()
p1_q.paragraph_format.space_before = Pt(12)
p1_q.paragraph_format.space_after = Pt(4)
r = p1_q.add_run("1. Build a browser-based college event registration interface using HTML, CSS and JavaScript. Use DOM manipulation and event handling to capture and validate user input; retrieve sample data with Fetch API and async/await, and display it dynamically. Demonstrate suitable HTTP methods and JSON request/response data, with search, filtering and input validation. [CO1, CO2]")
r.bold = True
r.font.size = Pt(11)

p1_src = doc.add_paragraph()
r = p1_src.add_run("SOURCE CODE1:\n")
r.bold = True
r.font.size = Pt(11)

add_code_file("index.html", "program1-html-js/index.html")
add_code_file("style.css", "program1-html-js/style.css")
add_code_file("script.js", "program1-html-js/script.js")
add_code_file("events.json", "program1-html-js/events.json")

p1_out = doc.add_paragraph()
p1_out.paragraph_format.space_before = Pt(12)
r = p1_out.add_run("OUTPUT 1:\n")
r.bold = True
r.font.size = Pt(11)
add_image_if_exists("screenshots/p1_app.png", "College Event Registration Web Interface (Form, Live Validation, Search & Dynamic Table)")


# ----------------- PROGRAM 2 -----------------
p2_q = doc.add_paragraph()
p2_q.paragraph_format.space_before = Pt(14)
p2_q.paragraph_format.space_after = Pt(4)
r = p2_q.add_run("2. Develop a React application for college event registration using reusable functional components, JSX, props and state. Implement a data-entry form and listing view; use useState and useEffect, conditional rendering, event handling and React Router navigation. [CO3]")
r.bold = True
r.font.size = Pt(11)

p2_src = doc.add_paragraph()
r = p2_src.add_run("SOURCE CODE2:\n")
r.bold = True
r.font.size = Pt(11)

add_code_file("src/main.jsx", "program2-react/src/main.jsx")
add_code_file("src/App.jsx", "program2-react/src/App.jsx")
add_code_file("src/components/Home.jsx", "program2-react/src/components/Home.jsx")
add_code_file("src/components/RegisterForm.jsx", "program2-react/src/components/RegisterForm.jsx")
add_code_file("src/components/RegistrationList.jsx", "program2-react/src/components/RegistrationList.jsx")
add_code_file("src/components/FormField.jsx", "program2-react/src/components/FormField.jsx")
add_code_file("src/index.css", "program2-react/src/index.css")

p2_out = doc.add_paragraph()
p2_out.paragraph_format.space_before = Pt(12)
r = p2_out.add_run("OUTPUT 2:\n")
r.bold = True
r.font.size = Pt(11)
add_image_if_exists("screenshots/p2_home.png", "React Application – Home Dashboard")
add_image_if_exists("screenshots/p2_register.png", "React Application – Event Registration Form")
add_image_if_exists("screenshots/p2_list.png", "React Application – Registration Listing View with Search Filter")


# ----------------- PROGRAM 3 -----------------
p3_q = doc.add_paragraph()
p3_q.paragraph_format.space_before = Pt(14)
p3_q.paragraph_format.space_after = Pt(4)
r = p3_q.add_run("3. Create a Node.js server-side utility for college event registration. Use the File System and Path modules to store and retrieve records, and use Streams or EventEmitter to process updates or notifications. Expose functionality through a basic HTTP server without Express. [CO4]")
r.bold = True
r.font.size = Pt(11)

p3_src = doc.add_paragraph()
r = p3_src.add_run("SOURCE CODE3:\n")
r.bold = True
r.font.size = Pt(11)

add_code_file("server.js", "program3-node/server.js")
add_code_file("eventStore.js", "program3-node/eventStore.js")

p3_out = doc.add_paragraph()
p3_out.paragraph_format.space_before = Pt(12)
r = p3_out.add_run("OUTPUT 3:\n")
r.bold = True
r.font.size = Pt(11)
add_image_if_exists("screenshots/p3_home.png", "Node.js Core HTTP Server – Root Landing Page")
add_image_if_exists("screenshots/p3_registrations.png", "Node.js Core HTTP Server – GET /registrations (JSON Store)")
add_image_if_exists("screenshots/p3_logs.png", "Node.js Core HTTP Server – GET /logs (Activity Log Streamed via Read Stream)")


# ----------------- PROGRAM 4 -----------------
p4_q = doc.add_paragraph()
p4_q.paragraph_format.space_before = Pt(14)
p4_q.paragraph_format.space_after = Pt(4)
r = p4_q.add_run("4. Develop an Express.js REST API for college event registration. Implement CRUD routes using GET, POST, PUT and DELETE; add middleware for request logging and input validation, centralized error handling, and a protected route using JWT authentication with bcrypt-hashed passwords. [CO5]")
r.bold = True
r.font.size = Pt(11)

p4_src = doc.add_paragraph()
r = p4_src.add_run("SOURCE CODE4:\n")
r.bold = True
r.font.size = Pt(11)

add_code_file("src/server.js", "program4-express-api/src/server.js")
add_code_file("src/app.js", "program4-express-api/src/app.js")
add_code_file("src/db.js", "program4-express-api/src/db.js")
add_code_file("src/middleware/auth.js", "program4-express-api/src/middleware/auth.js")
add_code_file("src/middleware/validate.js", "program4-express-api/src/middleware/validate.js")
add_code_file("src/middleware/errorHandler.js", "program4-express-api/src/middleware/errorHandler.js")
add_code_file("src/middleware/logger.js", "program4-express-api/src/middleware/logger.js")
add_code_file("src/routes/auth.js", "program4-express-api/src/routes/auth.js")
add_code_file("src/routes/registrations.js", "program4-express-api/src/routes/registrations.js")

p4_out = doc.add_paragraph()
p4_out.paragraph_format.space_before = Pt(12)
r = p4_out.add_run("OUTPUT4:\n")
r.bold = True
r.font.size = Pt(11)
add_image_if_exists("screenshots/p4_registrations.png", "Express REST API – GET /api/registrations (CRUD, Middleware & JWT Protected)")


# ----------------- PROGRAM 5 -----------------
p5_q = doc.add_paragraph()
p5_q.paragraph_format.space_before = Pt(14)
p5_q.paragraph_format.space_after = Pt(4)
r = p5_q.add_run("5. Integrate the college event registration React frontend with an Express.js backend and database. Persist application records using PostgreSQL with Sequelize or MongoDB with Mongoose; configure CORS and environment variables, connect the frontend to the API, and prepare deployment on Vercel (frontend) and Render (backend). [CO6]")
r.bold = True
r.font.size = Pt(11)

p5_src = doc.add_paragraph()
p5_src.paragraph_format.space_before = Pt(8)
r = p5_src.add_run("SOURCE CODE & OUTPUT5:\n\n")
r.bold = True
r.font.size = Pt(11)

r_links = p5_src.add_run("Local Full-Stack Endpoints & Deployment Configuration:\nFrontend: http://localhost:5174/ (Ready for Vercel deployment)\nBackend API: http://localhost:5000/api/registrations (Ready for Render deployment)\nDatabase: SQLite/PostgreSQL with Sequelize ORM\n\n")
r_links.font.size = Pt(10)
r_links.bold = True
r_links.font.color.rgb = RGBColor(0x00, 0x4D, 0x80)

# Backend Code
add_code_file("backend/src/server.js", "program5-fullstack/backend/src/server.js")
add_code_file("backend/src/db.js", "program5-fullstack/backend/src/db.js")
add_code_file("backend/src/models.js", "program5-fullstack/backend/src/models.js")
add_code_file("backend/src/routes/registrations.js", "program5-fullstack/backend/src/routes/registrations.js")

# Frontend Code
add_code_file("frontend/src/api.js", "program5-fullstack/frontend/src/api.js")
add_code_file("frontend/src/App.jsx", "program5-fullstack/frontend/src/App.jsx")
add_code_file("frontend/src/components/RegistrationForm.jsx", "program5-fullstack/frontend/src/components/RegistrationForm.jsx")
add_code_file("frontend/src/components/RegistrationList.jsx", "program5-fullstack/frontend/src/components/RegistrationList.jsx")

add_image_if_exists("screenshots/p5_frontend.png", "Full Stack Integrated React Frontend (Connected to Express API)")
add_image_if_exists("screenshots/p5_backend_registrations.png", "Full Stack Express Backend API with Database Persistence")

output_docx_name = "FSD CA3 ROLL NO 04.docx"
doc.save(output_docx_name)
print(f"Successfully generated {output_docx_name}")
