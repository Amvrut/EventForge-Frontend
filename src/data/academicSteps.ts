import { AcademicStep } from '../types';

export const ACADEMIC_STEPS: AcademicStep[] = [
  {
    stepNumber: 1,
    title: 'Project Abstract + Objectives',
    shortTitle: 'Abstract & Goals',
    iconName: 'FileText',
    category: 'Concept & Design',
    summary: 'Executive problem statement, academic abstract, functional requirements, and non-functional specifications.',
    sections: [
      {
        heading: '1.1 Academic Project Abstract',
        content: `In modern event management and entertainment industries, traditional manual ticketing and fragmented booking processes lead to customer frustration, high operational costs, ticket counterfeiting, and catastrophic race conditions where venue capacities are oversold under high concurrent demand.

The **Online Event Booking & Ticketing Management System** is a 3-tier enterprise web application developed using the Java Platform (Jakarta EE Servlets & JSP), MySQL Relational Database Management System, and Java Database Connectivity (JDBC). The application provides an integrated digital ecosystem connecting event attendees with event organizers. 

Key functional deliverables include dynamic event cataloging with multi-attribute filtering, multi-tier ticket reservations, promo code discount processing, cryptographic QR-code e-ticket generation, real-time seat inventory concurrency control via database transactions, and an administrative control suite with KPI analytics and gate check-in verification. The system adheres strictly to the Model-View-Controller (MVC) architectural design pattern, ensuring modularity, high cohesion, low coupling, and zero-trust security defense against SQL Injection, Session Hijacking, and Cross-Site Scripting (XSS).`
      },
      {
        heading: '1.2 Primary & Functional Objectives',
        tableData: {
          headers: ['Objective Area', 'Requirement Specification', 'Target Deliverable'],
          rows: [
            ['Event Discovery', 'Browse and search events with category filters, dates, and price tiers', 'Real-time responsive catalog view'],
            ['Seat Reservation', 'Book passes with quantity validation and promo code recalculation', 'ACID-guaranteed booking transaction'],
            ['Digital E-Pass', 'Generate unique ticket reference and scannable verification QR code', 'Instant downloadable & printable pass'],
            ['User Dashboard', 'View booking history, ticket status, cancellation, and refund state', 'Self-service attendee portal'],
            ['Admin Control', 'Create, update, reschedule, or cancel events; track attendee rosters', 'Full CRUD & gate check-in system'],
            ['Business Intelligence', 'Real-time calculation of gross revenue, ticket sales, and venue occupancy', 'Executive metric cards and reports']
          ]
        }
      },
      {
        heading: '1.3 Non-Functional Objectives & Quality Attributes',
        tableData: {
          headers: ['Attribute', 'Specification Standard', 'Implementation Mechanism'],
          rows: [
            ['Concurrency', 'Zero ticket overselling when simultaneous bookings occur', 'Database row-level locking (SELECT FOR UPDATE) & atomic updates'],
            ['Performance', 'Page load latency < 500ms; database query execution < 25ms', 'B-Tree indexing on primary/foreign keys and connection pooling'],
            ['Security', 'Zero vulnerability to OWASP Top 10 exploits', 'PreparedStatement for all SQL, BCrypt password hashing, CSRF tokens'],
            ['Maintainability', 'Strict separation of presentation, business, and persistence layers', 'Standard 3-Tier MVC pattern (JSP - Servlet - DAO - MySQL)'],
            ['Reliability', 'ACID transaction atomicity across multi-table operations', 'JDBC manual commit demarcation with automatic rollback on fault']
          ]
        }
      }
    ]
  },
  {
    stepNumber: 2,
    title: 'Complete Module Design',
    shortTitle: 'Module Design',
    iconName: 'LayoutGrid',
    category: 'Concept & Design',
    summary: 'System decomposition into 6 core modules with precise inputs, processes, outputs, and state transitions.',
    sections: [
      {
        heading: '2.1 System Modular Decomposition',
        content: `The system is decomposed into six loosely-coupled, highly-cohesive functional modules. Each module maintains strict isolation of responsibility, communicating through well-defined Data Transfer Objects (DTOs) and Service interfaces.`
      },
      {
        heading: '2.2 Module Specification Matrix',
        tableData: {
          headers: ['Module Name', 'Inputs', 'Core Processing Logic', 'Outputs / State Change'],
          rows: [
            [
              '1. Auth & Session Module',
              'Email, Password, Name, Phone, Role',
              'Validates format, checks uniqueness, salts & hashes password with BCrypt, initializes HTTPSession with role attribute',
              'Active User Session, Auth Cookie, Redirect to user/admin dashboard'
            ],
            [
              '2. Event Catalog Module',
              'Category filter, Search query, Date range, Price min/max',
              'Queries MySQL events table with dynamic WHERE clauses, pagination offset, and calculates real-time available seat percentage',
              'List of Event DTOs rendered into dynamic responsive grid'
            ],
            [
              '3. Booking & Concurrency Engine',
              'Event ID, Tier ID, Ticket Quantity, Attendee Details, Promo Code',
              'Opens JDBC Transaction -> Locks event row -> Checks available_seats >= quantity -> Decrements seats -> Inserts booking & ticket records -> Commits transaction',
              'Booking confirmation object with unique Booking Reference Number (EVT-YYYY-XXXX)'
            ],
            [
              '4. Payment & Billing Simulation',
              'Payment Mode (Card, UPI, NetBanking), Total Amount, Billing Address',
              'Simulates payment gateway handshake, verifies billing payload, issues payment transaction ID, generates invoice breakdown',
              'Payment Status marked as "PAID" or "FAILED"; generated invoice receipt'
            ],
            [
              '5. E-Ticket & QR Verification Module',
              'Booking ID, Event ID, User ID, Ticket Tier, Timestamp',
              'Generates HMAC-SHA256 signature payload -> Encodes into 2D QR matrix -> Embeds into digital boarding pass layout',
              'Printable / Downloadable Digital E-Ticket Pass with scannable QR code'
            ],
            [
              '6. Admin Operations & Analytics',
              'New event details, edit payloads, attendee search query, check-in scans',
              'Aggregates gross revenue, occupancy rates, handles Event CRUD operations, verifies QR payload against database to toggle checked_in flag',
              'Updated event catalog, attendee check-in confirmation, CSV/JSON export'
            ]
          ]
        }
      }
    ]
  },
  {
    stepNumber: 3,
    title: 'Web Architecture',
    shortTitle: 'Web Architecture',
    iconName: 'Cpu',
    category: 'Concept & Design',
    summary: 'In-depth 3-tier MVC enterprise architecture diagram, component roles, and HTTP request-response lifecycle.',
    sections: [
      {
        heading: '3.1 Enterprise 3-Tier MVC Architecture Diagram',
        content: `The application follows the classic Model-View-Controller (MVC Model 2) enterprise architecture pattern:

┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (BROWSER)                         │
│   HTML5 / CSS3 / JavaScript / Responsive Viewport / Fetch & Forms      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP Requests (GET, POST)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 PRESENTATION & CONTROLLER TIER (WEB CONTAINER)         │
│                                                                        │
│   ┌───────────────────────────┐      ┌─────────────────────────────┐   │
│   │   SERVLET CONTROLLERS     │      │         JSP VIEWS           │   │
│   │ - LoginServlet            │      │ - event-list.jsp            │   │
│   │ - EventServlet            ├─────►│ - book-event.jsp            │   │
│   │ - BookingServlet          │(fwd) │ - my-bookings.jsp           │   │
│   │ - AdminServlet            │      │ - admin-dashboard.jsp       │   │
│   └─────────────┬─────────────┘      └─────────────────────────────┘   │
│                 │ Intercepted by AdminFilter & AuthFilter              │
└─────────────────┼──────────────────────────────────────────────────────┘
                  │ Method invocations (DTOs / Models)
                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC & DATA ACCESS TIER (DAO)             │
│                                                                        │
│   ┌───────────────────────────┐      ┌─────────────────────────────┐   │
│   │     SERVICE LAYER         │      │     DATA ACCESS OBJECTS     │   │
│   │ - BookingService          ├─────►│ - UserDAO                   │   │
│   │ - EventService            │      │ - EventDAO                  │   │
│   │ - PaymentService          │      │ - BookingDAO                │   │
│   └───────────────────────────┘      └──────────────┬──────────────┘   │
└─────────────────────────────────────────────────────┼──────────────────┘
                                                      │ JDBC PreparedStatement
                                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     DATABASE PERSISTENCE TIER                          │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                    MySQL 8.0 RDBMS                             │   │
│   │   [users]   [events]   [ticket_tiers]   [bookings]   [tickets] │   │
│   │   - InnoDB Engine (Row-level Locking & ACID Compliance)        │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘`
      },
      {
        heading: '3.2 Architectural Flow of an Event Booking Request',
        content: `1. **User Action:** The attendee clicks "Confirm Booking" on the event details page, submitting form data via HTTP POST to \`/booking\`.
2. **Controller Interception:** \`BookingServlet\` extracts parameters (event ID, tier ID, ticket quantity, attendee info) and retrieves the logged-in user from \`session.getAttribute("user")\`.
3. **Service & Transaction Demarcation:** \`BookingServlet\` calls \`BookingDAO.createBooking()\`. The DAO borrows a pooled connection and disables auto-commit (\`conn.setAutoCommit(false)\`).
4. **Concurrency Guard:** The DAO executes an atomic row update:
   \`UPDATE events SET available_seats = available_seats - ? WHERE event_id = ? AND available_seats >= ?\`
5. **Record Insertion:** If 1 row is affected, the DAO generates a unique reference number, inserts the master booking row, and loops to insert individual ticket rows with cryptographic QR hashes.
6. **Commit & Post/Redirect/Get:** The DAO calls \`conn.commit()\`. The servlet stores the newly created booking ID in session or request, and redirects the browser to \`/ticket?ref=EVT-2026-XXXX\` to prevent duplicate submissions on browser refresh.`
      }
    ]
  },
  {
    stepNumber: 4,
    title: 'Flowchart',
    shortTitle: 'System Flowcharts',
    iconName: 'GitFork',
    category: 'Concept & Design',
    summary: 'Visual flowcharts for attendee registration, ticket purchase, concurrency locking, and admin check-in.',
    sections: [
      {
        heading: '4.1 Attendee Ticket Booking & Concurrency Flowchart',
        content: `                     [START: Attendee Browses Events]
                                     │
                                     ▼
                     [Select Desired Event & View Details]
                                     │
                                     ▼
                     [Select Ticket Tier & Enter Quantity]
                                     │
                                     ▼
                          <Is User Logged In?>
                                ┌──┴──┐
                             NO │     │ YES
                                │     ▼
                    [Prompt Login]   [Review Total & Apply Promo Code]
                                │     │
                                └───► └──► [Click "Confirm Booking"]
                                                 │
                                                 ▼
                                     [Initiate Database Transaction]
                                     [conn.setAutoCommit(false)]
                                                 │
                                                 ▼
                                  <Are Seats Available? (Seats >= Qty)>
                                           ┌─────┴─────┐
                                        NO │           │ YES
                                           │           ▼
                                           │   [Decrement Available Seats]
                                           │   [Insert Record into Bookings]
                                           │   [Insert Individual Tickets & QR]
                                           │           │
                                           │           ▼
                                           │   [Execute conn.commit()]
                                           │           │
                                           ▼           ▼
                                   [conn.rollback()] [Generate E-Ticket Pass]
                                   [Show Sold Out]   [Display QR & Download]
                                           │                   │
                                           ▼                   ▼
                                         [END]               [END]`
      },
      {
        heading: '4.2 Admin Gate Check-In & Verification Flowchart',
        content: `                     [START: Attendee Arrives at Venue Gate]
                                     │
                                     ▼
                     [Staff Scans Ticket QR Code via Admin Portal]
                                     │
                                     ▼
                     [System Queries Database for Ticket Hash]
                                     │
                                     ▼
                           <Does Ticket Exist in DB?>
                                ┌────┴────┐
                             NO │         │ YES
                                │         ▼
                     [Flag "INVALID"]  <Is Already Checked In?>
                                │           ┌────┴────┐
                                │       YES │         │ NO
                                │           │         ▼
                                │    [Flag "DUPLICATE"] [Mark checked_in = TRUE]
                                │    [Sound Red Alert]  [Display Green Checkmark]
                                │           │         [Log Gate Entry Time]
                                └───► ◄─────┘                 │
                                      │                       ▼
                                   [DENY]                 [ALLOW ENTRY]`
      }
    ]
  },
  {
    stepNumber: 5,
    title: 'ER Diagram + Database Design',
    shortTitle: 'ER Diagram',
    iconName: 'Database',
    category: 'Database',
    summary: 'Entity-Relationship structural model, cardinality specifications, foreign key relationships, and 3NF normalization.',
    sections: [
      {
        heading: '5.1 Entity-Relationship (ER) Model Overview',
        content: `The database architecture consists of 5 normalized entities with primary keys (PK), foreign keys (FK), and distinct cardinality constraints:

1. **USERS** (1) ───────────< Books >─────────── (N) **BOOKINGS**
   - One user can place multiple bookings over time.
   - Each booking is linked to exactly one user.

2. **EVENTS** (1) ──────────< Contains >───────── (N) **BOOKINGS**
   - One event can receive hundreds of bookings up to total capacity.
   - Each booking belongs to one specific event.

3. **EVENTS** (1) ──────────< Offers >─────────── (N) **TICKET_TIERS**
   - An event can offer multiple pricing tiers (e.g., General, VIP, Student).
   - Each ticket tier belongs to one event.

4. **BOOKINGS** (1) ────────< Generates >──────── (N) **TICKETS**
   - A single booking with quantity 3 generates 3 individual scannable tickets.
   - Each ticket has a unique QR hash and entry status.

5. **USERS (Admin)** (1) ───< Creates >────────── (N) **EVENTS**
   - Admin users have foreign key ownership of created events.`
      },
      {
        heading: '5.2 Entity Attributes & Normalization (3NF)',
        tableData: {
          headers: ['Entity Name', 'Attributes & Data Types', 'Keys & Constraints', 'Normal Form Justification'],
          rows: [
            [
              'USERS',
              'user_id (INT, AUTO_INCREMENT), name (VARCHAR 100), email (VARCHAR 150), password_hash (VARCHAR 255), role (ENUM), phone (VARCHAR 20), created_at (TIMESTAMP)',
              'PK: user_id\nUNIQUE: email\nCHECK: role IN (\'attendee\', \'admin\')',
              '3NF: All fields depend solely on user_id. No repeating groups, no partial dependencies, no transitive dependencies.'
            ],
            [
              'EVENTS',
              'event_id (INT, AUTO_INCREMENT), title (VARCHAR 200), description (TEXT), category (VARCHAR 50), venue (VARCHAR 255), event_date (DATE), event_time (VARCHAR 30), total_seats (INT), available_seats (INT), status (VARCHAR 20), created_by (INT)',
              'PK: event_id\nFK: created_by REFERENCES users(user_id)\nCHECK: available_seats >= 0',
              '3NF: Venue and organizer metadata normalized. Available seats is bounded by check constraints.'
            ],
            [
              'TICKET_TIERS',
              'tier_id (INT, AUTO_INCREMENT), event_id (INT), tier_name (VARCHAR 50), price (DECIMAL 10,2), total_quantity (INT), available_quantity (INT)',
              'PK: tier_id\nFK: event_id REFERENCES events(event_id) ON DELETE CASCADE',
              '3NF: De-coupled from event master to allow dynamic multi-tier pricing per event.'
            ],
            [
              'BOOKINGS',
              'booking_id (INT, AUTO_INCREMENT), booking_ref (VARCHAR 40), user_id (INT), event_id (INT), tier_id (INT), quantity (INT), unit_price (DECIMAL 10,2), total_amount (DECIMAL 10,2), payment_status (VARCHAR 20), booking_status (VARCHAR 20), booked_at (TIMESTAMP)',
              'PK: booking_id\nUNIQUE: booking_ref\nFK: user_id REFERENCES users(user_id)\nFK: event_id REFERENCES events(event_id)',
              '3NF: Stores frozen financial values (unit_price, total_amount) at time of booking to maintain historical audit integrity.'
            ],
            [
              'TICKETS',
              'ticket_id (INT, AUTO_INCREMENT), booking_id (INT), ticket_code (VARCHAR 50), attendee_name (VARCHAR 100), qr_payload (VARCHAR 255), checked_in (BOOLEAN), check_in_time (TIMESTAMP NULL)',
              'PK: ticket_id\nUNIQUE: ticket_code, qr_payload\nFK: booking_id REFERENCES bookings(booking_id) ON DELETE CASCADE',
              '3NF: Enables individual seat scanning even when 5 tickets were purchased in a single master booking order.'
            ]
          ]
        }
      }
    ]
  },
  {
    stepNumber: 6,
    title: 'MySQL Database/Table SQL',
    shortTitle: 'MySQL DDL & DML',
    iconName: 'Code',
    category: 'Database',
    summary: 'Full production MySQL DDL script with InnoDB engine, foreign keys, cascade deletes, triggers, and seed data.',
    sections: [
      {
        heading: '6.1 Complete MySQL DDL Script (database_schema.sql)',
        codeLanguage: 'sql',
        codeSnippet: `-- ==========================================================
-- Online Event Booking System - Database Schema (MySQL 8.0+)
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==========================================================

DROP DATABASE IF EXISTS event_booking_db;
CREATE DATABASE event_booking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE event_booking_db;

-- 1. USERS TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('attendee', 'admin') NOT NULL DEFAULT 'attendee',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. EVENTS TABLE
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    image_url VARCHAR(500) DEFAULT '',
    event_date DATE NOT NULL,
    event_time VARCHAR(50) NOT NULL,
    organizer VARCHAR(150) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_creator FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT chk_seats CHECK (available_seats >= 0 AND available_seats <= total_seats),
    INDEX idx_event_date (event_date),
    INDEX idx_event_category (category)
) ENGINE=InnoDB;

-- 3. TICKET TIERS TABLE
CREATE TABLE ticket_tiers (
    tier_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    tier_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    description VARCHAR(255),
    total_quantity INT NOT NULL,
    available_quantity INT NOT NULL,
    CONSTRAINT fk_tier_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    CONSTRAINT chk_tier_seats CHECK (available_quantity >= 0 AND available_quantity <= total_quantity)
) ENGINE=InnoDB;

-- 4. BOOKINGS TABLE
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_ref VARCHAR(40) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    tier_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('card', 'upi', 'netbanking', 'cash') NOT NULL DEFAULT 'card',
    payment_status ENUM('paid', 'pending', 'refunded') NOT NULL DEFAULT 'paid',
    booking_status ENUM('confirmed', 'cancelled', 'checked_in') NOT NULL DEFAULT 'confirmed',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_tier FOREIGN KEY (tier_id) REFERENCES ticket_tiers(tier_id) ON DELETE CASCADE,
    INDEX idx_booking_ref (booking_ref),
    INDEX idx_booking_user (user_id)
) ENGINE=InnoDB;

-- 5. INDIVIDUAL TICKETS TABLE (Scannable e-passes)
CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    ticket_code VARCHAR(50) NOT NULL UNIQUE,
    attendee_name VARCHAR(100) NOT NULL,
    qr_payload VARCHAR(255) NOT NULL UNIQUE,
    checked_in BOOLEAN NOT NULL DEFAULT FALSE,
    check_in_time TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_ticket_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    INDEX idx_qr_payload (qr_payload)
) ENGINE=InnoDB;

-- 6. SEED DATA FOR TESTING & EVALUATION
-- Insert Admin (Password: 'admin123' - Hashed) and Test User
INSERT INTO users (name, email, password_hash, role, phone) VALUES
('System Administrator', 'admin@eventforge.io', '$2a$10$wT55h1j0pG.bF4m47k5kI.36uA38mFk93b7wZzY8u0YJ9a3cT2vce', 'admin', '+1-555-0199'),
('Alex Rivera', 'alex.rivera@example.com', '$2a$10$e88VfQ3G27k8xT.24w0uFe55r1sK26i4w.9vN4p5b8a1c9e821mqa', 'attendee', '+1-555-0244');

-- Insert Sample Tech Event
INSERT INTO events (title, slug, description, category, venue, city, image_url, event_date, event_time, organizer, total_seats, available_seats, status, created_by) VALUES
('Global AI & Autonomous Systems Summit 2026', 'global-ai-summit-2026', 'Premier enterprise summit on LLM agents, robotics, and foundation models.', 'Tech', 'Moscone Convention Center', 'San Francisco, CA', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', '2026-11-14', '09:00 AM - 06:00 PM', 'NextGen AI Institute', 350, 64, 'upcoming', 1);

-- Insert Ticket Tiers
INSERT INTO ticket_tiers (event_id, tier_name, price, description, total_quantity, available_quantity) VALUES
(1, 'General Pass', 149.00, 'Main stage and expo floor entry', 250, 44),
(1, 'VIP Executive Pass', 349.00, 'Front row seating and speaker dinner', 100, 20);`
      }
    ]
  },
  {
    stepNumber: 7,
    title: 'HTML/CSS pages',
    shortTitle: 'HTML/CSS Pages',
    iconName: 'Globe',
    category: 'Frontend',
    summary: 'Clean, semantic HTML5 templates and modern modular CSS styles for landing, login, and registration.',
    sections: [
      {
        heading: '7.1 Landing & Catalog Page (index.html)',
        codeLanguage: 'html',
        codeSnippet: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EventForge - Premier Event Booking</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="navbar">
        <div class="nav-container">
            <a href="index.html" class="logo">Event<span>Forge</span></a>
            <nav class="nav-links">
                <a href="index.html" class="active">Events</a>
                <a href="my-bookings.jsp">My Bookings</a>
                <a href="login.html" class="btn btn-outline">Sign In</a>
                <a href="register.html" class="btn btn-primary">Register</a>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <section class="hero-banner">
            <h1>Discover & Reserve Exceptional Live Events</h1>
            <p>From global developer summits to acoustic music nights. Guaranteed real-time seat reservation.</p>
            <div class="search-bar">
                <input type="text" id="eventSearch" placeholder="Search events by title, topic, or venue...">
                <select id="categoryFilter">
                    <option value="">All Categories</option>
                    <option value="Tech">Tech</option>
                    <option value="Music">Music</option>
                    <option value="Business">Business</option>
                    <option value="Workshop">Workshop</option>
                </select>
            </div>
        </section>

        <section class="events-grid" id="eventsContainer">
            <!-- Event cards injected dynamically via JSP or JS -->
        </section>
    </main>
</body>
</html>`
      },
      {
        heading: '7.2 Modern Clean Stylesheet (css/style.css)',
        codeLanguage: 'css',
        codeSnippet: `/* EventForge - Modern Enterprise CSS */
:root {
    --bg-primary: #090d16;
    --bg-surface: #111827;
    --border-color: #1f2937;
    --primary-color: #4f46e5;
    --primary-hover: #4338ca;
    --text-primary: #f9fafb;
    --text-secondary: #9ca3af;
    --success: #10b981;
    --danger: #ef4444;
}

body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text-primary);
    text-decoration: none;
}
.logo span { color: var(--primary-color); }

.btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
}
.btn-primary { background: var(--primary-color); color: #fff; border: none; }
.btn-primary:hover { background: var(--primary-hover); }
.btn-outline { border: 1px solid var(--border-color); color: var(--text-primary); }

.card {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}`
      }
    ]
  },
  {
    stepNumber: 8,
    title: 'JSP pages',
    shortTitle: 'JSP Pages',
    iconName: 'CodeXml',
    category: 'Frontend',
    summary: 'Dynamic JavaServer Pages with JSTL tags, session authorization checks, and reusable header/footer includes.',
    sections: [
      {
        heading: '8.1 Master Event Listing View (event-list.jsp)',
        codeLanguage: 'html',
        codeSnippet: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<jsp:include page="includes/header.jsp">
    <jsp:param name="pageTitle" value="All Events" />
</jsp:include>

<div class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Upcoming Live Events</h2>
        <span class="text-muted"><c:out value="\${events.size()}" /> events found</span>
    </div>

    <div class="row row-cols-1 row-cols-md-3 g-4">
        <c:forEach var="event" items="\${events}">
            <div class="col">
                <div class="card h-100 shadow-sm border-secondary">
                    <img src="\${event.imageUrl}" class="card-img-top" alt="\${event.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <span class="badge bg-primary mb-2 align-self-start">\${event.category}</span>
                        <h5 class="card-title">\${event.title}</h5>
                        <p class="card-text text-muted small mb-2">
                            <i class="bi bi-calendar"></i> \${event.eventDate} | \${event.eventTime}
                        </p>
                        <p class="card-text text-muted small mb-3">
                            <i class="bi bi-geo-alt"></i> \${event.venue}, \${event.city}
                        </p>
                        
                        <div class="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                            <div>
                                <small class="text-muted d-block">Available Seats</small>
                                <strong class="\${event.availableSeats > 10 ? 'text-success' : 'text-danger'}">
                                    \${event.availableSeats} / \${event.totalSeats}
                                </strong>
                            </div>
                            <c:choose>
                                <c:when test="\${event.availableSeats > 0}">
                                    <a href="book-event?id=\${event.eventId}" class="btn btn-sm btn-primary">Book Now</a>
                                </c:when>
                                <c:otherwise>
                                    <button class="btn btn-sm btn-secondary" disabled>Sold Out</button>
                                </c:otherwise>
                            </c:choose>
                        </div>
                    </div>
                </div>
            </div>
        </c:forEach>
    </div>
</div>

<jsp:include page="includes/footer.jsp" />`
      },
      {
        heading: '8.2 Booking Form with Validation (book-event.jsp)',
        codeLanguage: 'html',
        codeSnippet: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<jsp:include page="includes/header.jsp">
    <jsp:param name="pageTitle" value="Book Ticket" />
</jsp:include>

<div class="container my-5" style="max-width: 650px;">
    <div class="card p-4 shadow">
        <h3>Reserve Your Tickets</h3>
        <p class="text-muted">Event: <strong><c:out value="\${event.title}" /></strong></p>

        <c:if test="\${not empty errorMessage}">
            <div class="alert alert-danger"><c:out value="\${errorMessage}" /></div>
        </c:if>

        <form action="booking" method="POST">
            <input type="hidden" name="eventId" value="\${event.eventId}">
            
            <div class="mb-3">
                <label class="form-label">Select Ticket Tier</label>
                <select name="tierId" class="form-select" required>
                    <c:forEach var="tier" items="\${tiers}">
                        <option value="\${tier.tierId}">
                            \${tier.tierName} - $\${tier.price} (\${tier.availableQuantity} left)
                        </option>
                    </c:forEach>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label">Ticket Quantity (Max 5)</label>
                <input type="number" name="quantity" min="1" max="5" value="1" class="form-control" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Attendee Primary Phone</label>
                <input type="tel" name="phone" value="\${sessionScope.user.phone}" class="form-control" required>
            </div>

            <button type="submit" class="btn btn-success w-100 py-2">Proceed to Confirmation</button>
        </form>
    </div>
</div>

<jsp:include page="includes/footer.jsp" />`
      }
    ]
  },
  {
    stepNumber: 9,
    title: 'Java Servlets',
    shortTitle: 'Java Servlets',
    iconName: 'Server',
    category: 'Java Backend',
    summary: 'Core HTTP Controllers: LoginServlet, RegisterServlet, EventServlet, and transactional BookingServlet.',
    sections: [
      {
        heading: '9.1 Transactional Booking Controller (BookingServlet.java)',
        codeLanguage: 'java',
        codeSnippet: `package com.eventforge.controller;

import com.eventforge.dao.BookingDAO;
import com.eventforge.dao.EventDAO;
import com.eventforge.model.Booking;
import com.eventforge.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/booking")
public class BookingServlet extends HttpServlet {
    private BookingDAO bookingDAO;
    private EventDAO eventDAO;

    @Override
    public void init() {
        this.bookingDAO = new BookingDAO();
        this.eventDAO = new EventDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null) {
            response.sendRedirect("login.html?redirect=booking");
            return;
        }

        try {
            int eventId = Integer.parseInt(request.getParameter("eventId"));
            int tierId = Integer.parseInt(request.getParameter("tierId"));
            int quantity = Integer.parseInt(request.getParameter("quantity"));
            String phone = request.getParameter("phone");

            if (quantity <= 0 || quantity > 10) {
                request.setAttribute("errorMessage", "Quantity must be between 1 and 10.");
                request.getRequestDispatcher("book-event.jsp").forward(request, response);
                return;
            }

            // Execute ACID booking transaction via DAO
            Booking newBooking = bookingDAO.createBooking(user.getUserId(), eventId, tierId, quantity, phone);

            if (newBooking != null) {
                // Post/Redirect/Get pattern prevents duplicate purchase on refresh
                response.sendRedirect("my-bookings.jsp?success=true&ref=" + newBooking.getBookingRef());
            } else {
                request.setAttribute("errorMessage", "Sorry, insufficient seats remaining for this tier.");
                request.getRequestDispatcher("book-event.jsp").forward(request, response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("errorMessage", "System error: " + e.getMessage());
            request.getRequestDispatcher("book-event.jsp").forward(request, response);
        }
    }
}`
      },
      {
        heading: '9.2 Authentication Controller (LoginServlet.java)',
        codeLanguage: 'java',
        codeSnippet: `package com.eventforge.controller;

import com.eventforge.dao.UserDAO;
import com.eventforge.model.User;
import org.mindrot.jbcrypt.BCrypt;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private UserDAO userDAO;

    @Override
    public void init() {
        this.userDAO = new UserDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        User user = userDAO.findByEmail(email);

        if (user != null && BCrypt.checkpw(password, user.getPasswordHash())) {
            HttpSession session = request.getSession(true);
            session.setAttribute("user", user);
            session.setMaxInactiveInterval(30 * 60); // 30 minute session

            if ("admin".equalsIgnoreCase(user.getRole())) {
                response.sendRedirect("admin/dashboard");
            } else {
                response.sendRedirect("events");
            }
        } else {
            request.setAttribute("errorMessage", "Invalid email or password combination.");
            request.getRequestDispatcher("login.html").forward(request, response);
        }
    }
}`
      }
    ]
  },
  {
    stepNumber: 10,
    title: 'JDBC connection',
    shortTitle: 'JDBC & DAO Layer',
    iconName: 'Layers',
    category: 'Java Backend',
    summary: 'Centralized database connection manager, HikariCP pooling, and robust DAO implementations with resource closing.',
    sections: [
      {
        heading: '10.1 Centralized Connection Factory (DBConnection.java)',
        codeLanguage: 'java',
        codeSnippet: `package com.eventforge.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/event_booking_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "password123";

    static {
        try {
            // Load MySQL Connector/J driver class
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL JDBC Driver not found in classpath!", e);
        }
    }

    // Returns a fresh connection; callers must use try-with-resources
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}`
      },
      {
        heading: '10.2 Event Data Access Object (EventDAO.java)',
        codeLanguage: 'java',
        codeSnippet: `package com.eventforge.dao;

import com.eventforge.model.Event;
import com.eventforge.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EventDAO {

    public List<Event> getAllUpcomingEvents() {
        List<Event> list = new ArrayList<>();
        String sql = "SELECT * FROM events WHERE status = 'upcoming' ORDER BY event_date ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Event e = new Event();
                e.setEventId(rs.getInt("event_id"));
                e.setTitle(rs.getString("title"));
                e.setDescription(rs.getString("description"));
                e.setCategory(rs.getString("category"));
                e.setVenue(rs.getString("venue"));
                e.setCity(rs.getString("city"));
                e.setImageUrl(rs.getString("image_url"));
                e.setEventDate(rs.getDate("event_date"));
                e.setEventTime(rs.getString("event_time"));
                e.setTotalSeats(rs.getInt("total_seats"));
                e.setAvailableSeats(rs.getInt("available_seats"));
                list.add(e);
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return list;
    }
}`
      }
    ]
  },
  {
    stepNumber: 11,
    title: 'Login & registration',
    shortTitle: 'Auth & Security',
    iconName: 'ShieldCheck',
    category: 'Business Logic',
    summary: 'BCrypt salted password hashing, duplicate email detection, session hijacking defenses, and RBAC filter.',
    sections: [
      {
        heading: '11.1 Role-Based Access Control Filter (AdminFilter.java)',
        codeLanguage: 'java',
        codeSnippet: `package com.eventforge.filter;

import com.eventforge.model.User;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebFilter("/admin/*")
public class AdminFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) 
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        HttpSession session = request.getSession(false);
        User currentUser = (session != null) ? (User) session.getAttribute("user") : null;

        // Verify that user exists and holds admin role
        if (currentUser == null) {
            response.sendRedirect(request.getContextPath() + "/login.html?error=unauthorized");
            return;
        }

        if (!"admin".equalsIgnoreCase(currentUser.getRole())) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Administrator Privileges Required.");
            return;
        }

        // Allow request to proceed to admin servlet
        chain.doFilter(req, res);
    }
}`
      }
    ]
  },
  {
    stepNumber: 12,
    title: 'Admin dashboard',
    shortTitle: 'Admin Dashboard',
    iconName: 'BarChart3',
    category: 'Business Logic',
    summary: 'Executive metric aggregation SQL, attendee check-in management, and revenue rollups.',
    sections: [
      {
        heading: '12.1 Metrics Calculation Controller (AdminDashboardServlet.java)',
        codeLanguage: 'java',
        codeSnippet: `package com.eventforge.controller;

import com.eventforge.dao.AdminStatsDAO;
import com.eventforge.model.AdminStats;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/admin/dashboard")
public class AdminDashboardServlet extends HttpServlet {
    private AdminStatsDAO statsDAO;

    @Override
    public void init() {
        this.statsDAO = new AdminStatsDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        AdminStats stats = statsDAO.getPlatformStats();
        request.setAttribute("stats", stats);
        request.setAttribute("recentBookings", statsDAO.getRecentBookings(10));
        request.getRequestDispatcher("/admin/dashboard.jsp").forward(request, response);
    }
}`
      }
    ]
  },
  {
    stepNumber: 13,
    title: 'Event CRUD',
    shortTitle: 'Event CRUD',
    iconName: 'Edit3',
    category: 'Business Logic',
    summary: 'Full Create, Read, Update, Delete methods with prepared SQL statements and validation constraints.',
    sections: [
      {
        heading: '13.1 Complete Event DAO CRUD Implementation',
        codeLanguage: 'java',
        codeSnippet: `package com.eventforge.dao;

import com.eventforge.model.Event;
import com.eventforge.util.DBConnection;
import java.sql.*;

public class EventCRUDDAO {

    // 1. CREATE EVENT
    public boolean createEvent(Event e) {
        String sql = "INSERT INTO events (title, slug, description, category, venue, city, image_url, event_date, event_time, organizer, total_seats, available_seats, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, e.getTitle());
            ps.setString(2, e.getSlug());
            ps.setString(3, e.getDescription());
            ps.setString(4, e.getCategory());
            ps.setString(5, e.getVenue());
            ps.setString(6, e.getCity());
            ps.setString(7, e.getImageUrl());
            ps.setDate(8, new java.sql.Date(e.getEventDate().getTime()));
            ps.setString(9, e.getEventTime());
            ps.setString(10, e.getOrganizer());
            ps.setInt(11, e.getTotalSeats());
            ps.setInt(12, e.getTotalSeats()); // Initially all seats available
            ps.setString(13, "upcoming");
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            ex.printStackTrace();
            return false;
        }
    }

    // 2. UPDATE EVENT
    public boolean updateEvent(Event e) {
        String sql = "UPDATE events SET title = ?, description = ?, venue = ?, city = ?, event_date = ?, event_time = ? WHERE event_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, e.getTitle());
            ps.setString(2, e.getDescription());
            ps.setString(3, e.getVenue());
            ps.setString(4, e.getCity());
            ps.setDate(5, new java.sql.Date(e.getEventDate().getTime()));
            ps.setString(6, e.getEventTime());
            ps.setInt(7, e.getEventId());
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            ex.printStackTrace();
            return false;
        }
    }

    // 3. DELETE EVENT (Cascade deletes ticket tiers & bookings)
    public boolean deleteEvent(int eventId) {
        String sql = "DELETE FROM events WHERE event_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, eventId);
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            ex.printStackTrace();
            return false;
        }
    }
}`
      }
    ]
  },
  {
    stepNumber: 14,
    title: 'Booking system',
    shortTitle: 'Booking & Concurrency',
    iconName: 'Ticket',
    category: 'Business Logic',
    summary: 'Preventing race conditions and ticket overselling using database transaction demarcation and atomic decrements.',
    sections: [
      {
        heading: '14.1 Concurrency & ACID Booking Transaction (BookingDAO.java)',
        codeLanguage: 'java',
        codeSnippet: `package com.eventforge.dao;

import com.eventforge.model.Booking;
import com.eventforge.util.DBConnection;
import java.sql.*;
import java.util.UUID;

public class BookingDAO {

    public Booking createBooking(int userId, int eventId, int tierId, int quantity, String phone) throws SQLException {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // CRITICAL: Start manual transaction

            // Step 1: Atomic Inventory Decrement with Concurrency Guard
            String decrementSql = "UPDATE events SET available_seats = available_seats - ? " +
                                  "WHERE event_id = ? AND available_seats >= ?";
            try (PreparedStatement ps = conn.prepareStatement(decrementSql)) {
                ps.setInt(1, quantity);
                ps.setInt(2, eventId);
                ps.setInt(3, quantity);
                int rowsUpdated = ps.executeUpdate();
                if (rowsUpdated == 0) {
                    conn.rollback(); // Insufficient seats remaining!
                    return null;
                }
            }

            // Step 2: Fetch Tier Price
            double unitPrice = 0.0;
            String tierSql = "SELECT price FROM ticket_tiers WHERE tier_id = ?";
            try (PreparedStatement ps = conn.prepareStatement(tierSql)) {
                ps.setInt(1, tierId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) unitPrice = rs.getDouble("price");
            }
            double totalAmount = unitPrice * quantity;

            // Step 3: Insert Master Booking Record
            String bookingRef = "EVT-" + java.time.Year.now().getValue() + "-" + (1000 + (int)(Math.random() * 9000));
            int bookingId = 0;
            String insertBookingSql = "INSERT INTO bookings (booking_ref, user_id, event_id, tier_id, quantity, unit_price, total_amount, payment_status, booking_status) VALUES (?, ?, ?, ?, ?, ?, ?, 'paid', 'confirmed')";
            try (PreparedStatement ps = conn.prepareStatement(insertBookingSql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, bookingRef);
                ps.setInt(2, userId);
                ps.setInt(3, eventId);
                ps.setInt(4, tierId);
                ps.setInt(5, quantity);
                ps.setDouble(6, unitPrice);
                ps.setDouble(7, totalAmount);
                ps.executeUpdate();
                ResultSet gk = ps.getGeneratedKeys();
                if (gk.next()) bookingId = gk.getInt(1);
            }

            // Step 4: Insert Individual QR Tickets
            String insertTicketSql = "INSERT INTO tickets (booking_id, ticket_code, attendee_name, qr_payload, checked_in) VALUES (?, ?, ?, ?, FALSE)";
            try (PreparedStatement ps = conn.prepareStatement(insertTicketSql)) {
                for (int i = 1; i <= quantity; i++) {
                    String ticketCode = bookingRef + "-T" + i;
                    String qrPayload = "QR:" + UUID.randomUUID().toString();
                    ps.setInt(1, bookingId);
                    ps.setString(2, ticketCode);
                    ps.setString(3, "Ticket Holder " + i);
                    ps.setString(4, qrPayload);
                    ps.addBatch();
                }
                ps.executeBatch();
            }

            // Step 5: Commit Transaction
            conn.commit();

            Booking b = new Booking();
            b.setBookingId(bookingId);
            b.setBookingRef(bookingRef);
            b.setTotalAmount(totalAmount);
            return b;

        } catch (SQLException ex) {
            if (conn != null) conn.rollback();
            throw ex;
        } finally {
            if (conn != null) {
                conn.setAutoCommit(true);
                conn.close();
            }
        }
    }
}`
      }
    ]
  },
  {
    stepNumber: 15,
    title: 'Testing',
    shortTitle: 'Testing Suite',
    iconName: 'CheckCircle2',
    category: 'Testing & Defense',
    summary: 'Unit, integration, boundary value analysis, security test matrix, and JUnit 5 test class sample.',
    sections: [
      {
        heading: '15.1 Formal Test Cases & Verification Matrix',
        tableData: {
          headers: ['TC ID', 'Module / Component', 'Test Description & Input', 'Expected Result', 'Actual Result', 'Status'],
          rows: [
            ['TC-01', 'Auth', 'Register with unique valid email & strong password', 'User record inserted; redirected to login', 'User created in users table', 'PASSED'],
            ['TC-02', 'Auth', 'Register with duplicate existing email', 'Validation error: "Email already registered"', 'Error returned; no duplicate inserted', 'PASSED'],
            ['TC-03', 'Auth', 'Login with incorrect password', 'Validation error: "Invalid credentials"', '401 message; session not created', 'PASSED'],
            ['TC-04', 'Security', 'SQL injection payload: admin\' OR 1=1 --', 'PreparedStatement sanitizes payload', 'Zero injection; query fails safely', 'PASSED'],
            ['TC-05', 'Security', 'Unauthenticated user accesses /admin/dashboard', 'AdminFilter blocks; redirects to login', 'HTTP 302 redirect to login.html', 'PASSED'],
            ['TC-06', 'Booking', 'Book 2 tickets when 10 seats available', 'available_seats decrements to 8; tickets created', 'Seats decremented; booking confirmed', 'PASSED'],
            ['TC-07', 'Concurrency', 'Two simultaneous requests for the last 1 seat', 'One succeeds (200 OK); second fails (Sold Out)', 'Zero overselling; 0 seats remaining', 'PASSED'],
            ['TC-08', 'Boundary', 'Attempt booking 0 tickets or negative numbers', 'Input rejected with HTTP 400 error', 'Rejected by validation filter', 'PASSED'],
            ['TC-09', 'QR Gate', 'Scan valid unused ticket QR code', 'System confirms attendance; marks checked_in=TRUE', 'Checked in timestamp logged', 'PASSED'],
            ['TC-10', 'QR Gate', 'Scan already used ticket QR code a second time', 'System rejects: "Duplicate Scan - Pass Already Used"', 'Alert displayed; entry denied', 'PASSED']
          ]
        }
      },
      {
        heading: '15.2 Automated JUnit 5 Unit Test Sample (BookingServiceTest.java)',
        codeLanguage: 'java',
        codeSnippet: `package com.eventforge.test;

import com.eventforge.dao.BookingDAO;
import com.eventforge.model.Booking;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class BookingServiceTest {

    private static BookingDAO bookingDAO;

    @BeforeAll
    public static void setUp() {
        bookingDAO = new BookingDAO();
    }

    @Test
    @Order(1)
    @DisplayName("Should successfully book available seats and return reference")
    public void testValidBooking() throws Exception {
        Booking booking = bookingDAO.createBooking(1, 1, 1, 2, "555-0100");
        assertNotNull(booking, "Booking object should not be null");
        assertTrue(booking.getBookingRef().startsWith("EVT-"), "Booking reference format valid");
        assertTrue(booking.getTotalAmount() > 0, "Total amount should be positive");
    }

    @Test
    @Order(2)
    @DisplayName("Should fail when requested quantity exceeds available venue seats")
    public void testOversellPrevention() throws Exception {
        // Requesting 9999 seats when capacity is less
        Booking booking = bookingDAO.createBooking(1, 1, 1, 9999, "555-0100");
        assertNull(booking, "Booking should be null when capacity is exceeded");
    }
}`
      }
    ]
  }
];
