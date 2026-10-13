import { PPTSlide, VivaQuestion } from '../types';

export const PPT_SLIDES: PPTSlide[] = [
  {
    slideNumber: 1,
    title: 'Online Event Booking & Ticketing Management System',
    subtitle: 'A Secure 3-Tier Enterprise Web Application Built with Java, JSP/Servlets & MySQL',
    bullets: [
      'Academic Project Presentation for Capstone / Final Year Evaluation',
      'Technology Stack: Java (Jakarta EE), JSP, Servlets, JDBC, MySQL, HTML5/Tailwind',
      'Key Highlights: Real-time Seat Inventory, Concurrency Control, QR Pass Generation, Role-Based Access Control'
    ],
    keyHighlight: 'Complete end-to-end event ticketing ecosystem with attendee booking and administrative monitoring.',
    speakerNotes: 'Respected examiners and faculty members, good morning. Today I will present our project, the Online Event Booking & Management System, an enterprise-grade 3-tier Java web application designed to solve real-world ticketing concurrency, digital verification, and automated administrative operations.'
  },
  {
    slideNumber: 2,
    title: 'Problem Statement & Motivation',
    subtitle: 'Why Conventional Ticketing Systems Fail at Scale',
    bullets: [
      'Manual and legacy paper ticketing suffer from high overhead, counterfeit passes, and loss of records.',
      'Existing web portals frequently suffer from race conditions when thousands of users attempt to purchase the final seat.',
      'Lack of unified administrative oversight creates reconciliation delays between bookings and seat inventory.',
      'Goal: Eliminate double-booking using database pessimistic locking and provide instant cryptographic QR e-tickets.'
    ],
    keyHighlight: 'Elimination of race-condition ticket overselling while delivering sub-second booking confirmations.',
    speakerNotes: 'Traditional booking workflows suffer from human delays and lack of real-time seat locks. When popular tickets open, concurrent HTTP requests can lead to double allocation. Our system specifically tackles this using database-level transaction demarcation and pessimistic locking.'
  },
  {
    slideNumber: 3,
    title: 'Project Objectives & Scope',
    subtitle: 'Target Deliverables for Attendees and Organizers',
    bullets: [
      'Primary: Build an interactive, responsive web portal where attendees discover events, select ticket tiers, and book passes instantly.',
      'Concurrency Safety: Enforce strict transactional isolation to guarantee zero overselling of venue capacity.',
      'Digital E-Passes: Generate unique cryptographic QR codes and reference numbers for instant venue gate check-in.',
      'Admin Control: Provide organizers a unified dashboard for real-time sales analytics, event CRUD, and attendee roster management.'
    ],
    keyHighlight: 'ACID-compliant transaction handling coupled with an intuitive responsive user experience.',
    speakerNotes: 'Our scope is partitioned into two core personas: attendees and event administrators. The attendees enjoy a frictionless booking journey with live seat counters, while administrators manage inventory and monitor gate check-ins.'
  },
  {
    slideNumber: 4,
    title: 'System Architecture (3-Tier MVC Pattern)',
    subtitle: 'Clean Separation of Concerns for Maintainability & Scalability',
    bullets: [
      'Presentation Tier: Dynamic JSP pages with JSTL and responsive CSS for cross-device view rendering.',
      'Business Logic Tier: Java Servlets acting as MVC Controllers; validation filters, and session management.',
      'Data Access Tier: Dedicated Data Access Objects (DAOs) executing parameterized queries via JDBC.',
      'Persistence Tier: Relational MySQL 8.0 schema normalized to Third Normal Form (3NF) with foreign key constraints.'
    ],
    keyHighlight: 'Adheres to pure MVC (Model-View-Controller) architecture, decoupling UI from business rules.',
    speakerNotes: 'We avoided mixing business logic inside JSP pages. The JSP serves solely as the View. Servlets act as Controllers receiving requests and delegating to DAO Model layers, ensuring clean modularity and easy testability.'
  },
  {
    slideNumber: 5,
    title: 'Database Design & Schema Normalization',
    subtitle: 'Relational Structure in Third Normal Form (3NF)',
    bullets: [
      'users: user_id (PK), name, email (UNIQUE), password_hash, role (ENUM: attendee, admin), phone.',
      'events: event_id (PK), title, description, category, venue, event_date, ticket_price, total_seats, available_seats.',
      'bookings: booking_id (PK), user_id (FK), event_id (FK), booking_ref (UNIQUE), total_amount, payment_status, booking_status.',
      'tickets: ticket_id (PK), booking_id (FK), qr_payload, attendee_name, checked_in (BOOLEAN).'
    ],
    keyHighlight: 'Strict foreign keys with ON DELETE CASCADE and integrity checks ensuring referential consistency.',
    speakerNotes: 'All tables are normalized up to 3NF. Transitive dependencies are removed, and sensitive fields like password hashes utilize SHA-256 with salt. Indexes are placed on event_date and user_id for high-speed queries.'
  },
  {
    slideNumber: 6,
    title: 'Core Modules & User Flow',
    subtitle: 'Step-by-Step Functional Lifecycle',
    bullets: [
      'Authentication Module: Registration, login with BCrypt verification, session persistence, and role-based redirect.',
      'Event Discovery: Dynamic catalog with multi-facet filtering (category, date range, price range, city search).',
      'Booking & Checkout: Multi-tier pass selector (General, VIP), promo code discount engine, and mock payment gateway.',
      'Ticket Pass Generator: Client & server side SVG QR code rendering with unique cryptographic seed.'
    ],
    keyHighlight: 'End-to-end user journey requires only 3 clicks from event discovery to finalized ticket generation.',
    speakerNotes: 'The attendee journey is optimized for speed. They filter events, click into details, select quantity and pass tier, and complete simulated checkout with instant QR generation and email/download receipt capabilities.'
  },
  {
    slideNumber: 7,
    title: 'Administrative Dashboard & Operations',
    subtitle: 'Real-Time Governance and Gate Check-In',
    bullets: [
      'Executive KPI Cards: Gross Ticket Sales, Total Bookings Count, Venue Capacity Rate %, and Active Events.',
      'Event CRUD Engine: Create upcoming events with venue capacity, update descriptions, reschedule, or cancel.',
      'Attendee Roster: Filterable guest list with instant status toggles (Pending -> Checked In).',
      'Reporting & Export: Quick CSV and JSON export for event financial accounting and audits.'
    ],
    keyHighlight: 'Real-time operational visibility empowers venue managers to verify passes and prevent ticket fraud.',
    speakerNotes: 'Administrators have dedicated security privileges guarded by Java Servlet Filters. Even if an unauthenticated user enters the admin URL, the filter intercepts the request and terminates access.'
  },
  {
    slideNumber: 8,
    title: 'Concurrency Control & Race Condition Defense',
    subtitle: 'How the System Prevents Overselling of the Last Seat',
    bullets: [
      'The Challenge: When only 1 seat remains and two users press "Confirm Booking" at the identical millisecond.',
      'Pessimistic Locking: Using SELECT available_seats FROM events WHERE event_id = ? FOR UPDATE in MySQL.',
      'Atomic Decrement: UPDATE events SET available_seats = available_seats - ? WHERE event_id = ? AND available_seats >= ?.',
      'Transaction Rollback: If rows affected equals zero, conn.rollback() is triggered and user receives "Sold Out" error.'
    ],
    keyHighlight: 'Eliminates overselling under high concurrency through database row-level locking.',
    speakerNotes: 'This is the most critical technical defense in ticketing engines. Rather than doing read-then-write in memory, we execute atomic SQL decrements inside an uncommitted JDBC transaction block with autoCommit set to false.'
  },
  {
    slideNumber: 9,
    title: 'Security Implementation & Best Practices',
    subtitle: 'Protecting User Identity and Application Data',
    bullets: [
      'SQL Injection Prevention: 100% of database queries utilize PreparedStatement with positional parameter binding (? placeholders).',
      'Authentication Security: SHA-256 cryptographic password hashing; zero plaintext storage.',
      'Session Management: Invalidation of session upon logout; HttpOnly and SameSite cookie policies to prevent XSS hijacking.',
      'Role-Based Access Control (RBAC): Dedicated Servlet Filter intercepts all /admin/* endpoints.'
    ],
    keyHighlight: 'Defense-in-depth security paradigm implemented across all layers of the application.',
    speakerNotes: 'We completely eliminated SQL injection vulnerabilities by refusing to concatenate raw strings into SQL statements. All input parameters are strictly sanitized and bound via JDBC PreparedStatements.'
  },
  {
    slideNumber: 10,
    title: 'Testing Strategy & Quality Assurance',
    subtitle: 'Comprehensive Validation Across Test Levels',
    bullets: [
      'Unit Testing: Testing DAO methods with JUnit 5 and mock database connections.',
      'Boundary Value Analysis: Booking 0 tickets (rejected), booking exactly remaining capacity (passed), exceeding capacity (rejected).',
      'Integration Testing: Testing complete flow from LoginServlet -> EventServlet -> BookingServlet -> Database commit.',
      'Security Tests: Attempting SQL injection payloads (e.g. \' OR 1=1 --) and unauthorized URL direct access.'
    ],
    keyHighlight: 'Over 16 formal test cases executed with 100% passing results and zero critical defects.',
    speakerNotes: 'We conducted boundary value tests and concurrency stress tests. In every instance where booking requests exceeded available inventory, the transaction safely rolled back without data corruption.'
  },
  {
    slideNumber: 11,
    title: 'Performance Optimization & Scalability',
    subtitle: 'Engineered for High Throughput and Responsive Latency',
    bullets: [
      'Database Connection Pooling: Eliminates connection handshake overhead by reusing pooled database sockets.',
      'Indexed Relational Lookups: B-Tree indexes created on event_date, category, and user_id fields.',
      'Lightweight Asset Delivery: Client-side vector SVG rendering for QR passes minimizes server storage overhead.',
      'Session State Optimization: Minimal session payload keeps memory footprint negligible even under thousands of active users.'
    ],
    keyHighlight: 'Sub-50ms database response times achieved through indexing and connection pooling.',
    speakerNotes: 'Creating a new JDBC connection per HTTP request is expensive. By employing connection pooling, queries execute in single-digit milliseconds, enabling high concurrency on moderate hardware.'
  },
  {
    slideNumber: 12,
    title: 'Demonstration & Screenshots Showcase',
    subtitle: 'Live System Capabilities and Walkthrough',
    bullets: [
      'Landing Page & Discovery: Dynamic category tags, live seat availability bars, date filter.',
      'Interactive Booking Modal: Ticket tier selector, dynamic total calculation, promo code verification.',
      'Generated E-Ticket: Clean aesthetic pass featuring scannable QR code, booking ID, venue address.',
      'Admin Operations Console: KPI metric analytics, event editor modal, and attendee check-in roster.'
    ],
    keyHighlight: 'Full live demonstration shows instant booking and real-time seat inventory decrement.',
    speakerNotes: 'As shown on the screen, when an attendee completes a booking, the available seat counter updates immediately. The admin dashboard instantly reflects the updated revenue and attendee count.'
  },
  {
    slideNumber: 13,
    title: 'Comparison with Existing Systems',
    subtitle: 'Key Competitive Advantages',
    bullets: [
      'Commercial portals often charge exorbitant per-ticket booking fees; our self-hosted architecture eliminates third-party commission.',
      'Simplicity & Speed: Fast checkout without requiring tedious multi-step captcha loops.',
      'Direct Organizer Control: Real-time attendee check-in scanning without needing external proprietary hardware.',
      'Clean Codebase: Adheres strictly to standard Jakarta EE / Java standards without complex heavyweight frameworks.'
    ],
    keyHighlight: 'Zero vendor lock-in, low operating cost, and complete ownership of attendee data.',
    speakerNotes: 'Unlike third-party ticketing platforms that lock event organizers into revenue cuts and retain attendee data, this system provides full data ownership and can be deployed on private cloud or on-premise servers.'
  },
  {
    slideNumber: 14,
    title: 'Future Enhancements & Roadmap',
    subtitle: 'Potential Areas for System Extension',
    bullets: [
      'Real-Time WebSocket Seat Mapping: Interactive seat map (e.g. row A, seat 12) with live occupancy color-coding.',
      'Payment Gateway Webhook Integration: Production integration with Stripe or Razorpay webhooks for automated dispute handling.',
      'Automated SMS & WhatsApp Alerts: Sending ticket passes and venue reminders via Twilio or WhatsApp Business API.',
      'Mobile Gate Scanner App: Android/iOS companion application utilizing camera barcode hardware scanners.'
    ],
    keyHighlight: 'Modular architecture allows seamless plug-in of payment gateways and push notification microservices.',
    speakerNotes: 'In future iterations, we can easily plug in WebSockets for interactive visual theater seat selection and connect production webhooks with payment providers like Stripe and WhatsApp notifications.'
  },
  {
    slideNumber: 15,
    title: 'Conclusion & Acknowledgments',
    subtitle: 'Summary of Academic Achievements',
    bullets: [
      'Successfully conceptualized, engineered, and tested an end-to-end Online Event Booking System.',
      'Mastered core enterprise Java principles: MVC pattern, Servlet lifecycle, JDBC transactions, and MySQL normalization.',
      'Implemented robust concurrency controls and zero-trust security filters.',
      'Special thanks to our project guide and department faculty for continuous technical guidance and mentorship.'
    ],
    keyHighlight: 'System is fully functional, academically compliant, and ready for viva voce examination.',
    speakerNotes: 'To conclude, this project successfully bridges theoretical software engineering concepts with a real-world enterprise web application. Thank you for your time. I am now open to any questions.'
  }
];

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    category: 'Servlets & JSP',
    question: 'What is the lifecycle of a Java Servlet, and which methods are called?',
    answer: 'A Servlet lifecycle is managed by the Servlet Container (such as Apache Tomcat) and consists of three primary phases: 1) Loading & Initialization: The container instantiates the servlet and calls init(ServletConfig config) once. 2) Request Handling: For every incoming HTTP request, the container spawns a thread and calls service(HttpServletRequest, HttpServletResponse), which delegates to doGet(), doPost(), doPut(), or doDelete(). 3) Destruction: When the container shuts down or unloads the servlet, it invokes destroy() to release system resources.',
    difficulty: 'Easy',
    commonFollowUp: 'Does the container create a new Servlet instance for each request? (Answer: No, Servlets follow a single-instance multi-threaded model).'
  },
  {
    id: 2,
    category: 'System Design & Concurrency',
    question: 'How does your application prevent double-booking or overselling when multiple users book the last available seat simultaneously?',
    answer: 'We prevent overselling using two defensive layers: 1) ACID Database Transaction with autoCommit set to false. 2) Atomic conditional SQL update: "UPDATE events SET available_seats = available_seats - ? WHERE event_id = ? AND available_seats >= ?". If two concurrent threads execute this, the database row-level lock serializes them. The first thread decrements the seat and returns rowCount = 1 (commit). The second thread finds available_seats < requested and returns rowCount = 0; the code immediately triggers rollback() and sends a "Sold Out" response to the user.',
    difficulty: 'Hard',
    commonFollowUp: 'What is the difference between Optimistic and Pessimistic Locking in database transactions?'
  },
  {
    id: 3,
    category: 'JDBC & Database',
    question: 'Why did you use PreparedStatement instead of Statement in your JDBC DAO classes?',
    answer: 'PreparedStatement offers two critical advantages: 1) Security: It completely prevents SQL Injection attacks because SQL queries are pre-compiled by the database engine and user parameters are bound separately as literal values, never concatenated as executable SQL tokens. 2) Performance: Pre-compiled SQL statements are cached in the database execution plan cache, significantly speeding up repeated queries.',
    difficulty: 'Easy',
    commonFollowUp: 'Can SQL Injection still happen with PreparedStatement? (Answer: Yes, if developers still concatenate strings inside the query instead of using ? placeholders).'
  },
  {
    id: 4,
    category: 'Servlets & JSP',
    question: 'What is the difference between RequestDispatcher.forward() and HttpServletResponse.sendRedirect()?',
    answer: '1) forward(): Operates strictly on the server side. The client URL in the browser address bar does not change. The original request and response objects are preserved and passed to the target JSP/Servlet. It requires only one round-trip. 2) sendRedirect(): Sends an HTTP 302 redirect status code back to the client browser, instructing it to issue a brand new HTTP GET request to the target URL. The browser URL changes, request attributes are lost, and it requires two round-trips.',
    difficulty: 'Medium',
    commonFollowUp: 'Which one do you use after a successful booking to prevent form re-submission on page refresh? (Answer: sendRedirect via the Post/Redirect/Get pattern).'
  },
  {
    id: 5,
    category: 'Web Security',
    question: 'How do you secure the Admin Dashboard from unauthorized access by regular users or unauthenticated visitors?',
    answer: 'We implement a Servlet Filter (AdminFilter) registered to the URL pattern "/admin/*". In the doFilter() method, the filter checks the current HttpSession. If session is null or session.getAttribute("user") is null, the user is redirected to the login page. If the user object role is not equal to "admin", an HTTP 403 Forbidden error or access-denied page is returned. The actual AdminServlet is never executed if the filter rejects the request.',
    difficulty: 'Medium',
    commonFollowUp: 'Can a user bypass this filter by typing direct URLs? (Answer: No, because servlet filters intercept all HTTP traffic matching the mapped pattern before reaching any servlet).'
  },
  {
    id: 6,
    category: 'Servlets & JSP',
    question: 'What is the difference between Servlet and JSP, and why use both?',
    answer: 'Servlets are pure Java classes best suited for Controller logic (receiving requests, reading parameters, calling business logic, database queries, and redirecting). JSP (JavaServer Pages) are text/HTML documents with embedded dynamic tags (JSTL/EL), best suited for the View layer (rendering UI). Using both enforces the MVC pattern: Servlets handle the logic and forward prepared model data to JSP for clean display, avoiding messy HTML strings in Java or scriptlets in JSP.',
    difficulty: 'Easy',
    commonFollowUp: 'What are scriptlets and why are they considered bad practice today? (Answer: <% %> tags mix Java into HTML, violating MVC separation).'
  },
  {
    id: 7,
    category: 'JDBC & Database',
    question: 'What is Connection Pooling, and why is it essential in an Event Booking System?',
    answer: 'Opening a physical database connection involves TCP handshakes, socket creation, authentication, and resource allocation, which takes 50-200ms per request. Connection pooling maintains a ready pool of pre-established database connections (e.g., using HikariCP or Apache DBCP). When a Servlet needs a connection, it borrows one from the pool, runs the query, and returns it to the pool in close(). This reduces query overhead to less than 2ms and protects the database from exhausting maximum connection limits during high-traffic ticket launches.',
    difficulty: 'Medium',
    commonFollowUp: 'What happens if all connections in the pool are busy? (Answer: New requests wait in a queue until a timeout threshold is reached).'
  },
  {
    id: 8,
    category: 'JDBC & Database',
    question: 'What are the ACID properties in database management, and how are they maintained in your project?',
    answer: 'ACID stands for: 1) Atomicity: All booking steps (decrementing seats, inserting booking record, generating tickets) must succeed together, or all must be rolled back. 2) Consistency: Total venue capacity = available seats + booked seats at all times. 3) Isolation: Concurrent booking transactions do not interfere with each other (guaranteed via transaction isolation levels). 4) Durability: Once a booking transaction commits, data is permanently written to disk even in the event of a power outage.',
    difficulty: 'Medium',
    commonFollowUp: 'How do you enable manual transaction management in JDBC? (Answer: connection.setAutoCommit(false), followed by connection.commit() or connection.rollback() in a catch block).'
  },
  {
    id: 9,
    category: 'Core Java',
    question: 'What design patterns are implemented in this project?',
    answer: '1) MVC (Model-View-Controller): Model = Entities & DAOs; View = JSP/HTML; Controller = Servlets. 2) DAO Pattern (Data Access Object): Separates business logic from database operations. 3) Singleton Pattern: Used in DBConnection to ensure a single centralized database configuration manager. 4) Factory / Builder Pattern: For constructing complex Ticket and Booking objects.',
    difficulty: 'Medium',
    commonFollowUp: 'Why is the DAO pattern preferred over writing SQL queries directly inside Servlets?'
  },
  {
    id: 10,
    category: 'Core Java',
    question: 'How do you handle exceptions in JDBC to avoid connection leaks?',
    answer: 'We use the Java 7+ try-with-resources statement, which automatically closes Connection, PreparedStatement, and ResultSet objects when the block exits, even if an SQLException occurs. In traditional code, closing must occur in a finally block with null checks. Failing to close connections causes "connection leaks" that will eventually freeze the database server.',
    difficulty: 'Easy',
    commonFollowUp: 'Does Connection implement AutoCloseable? (Answer: Yes, all JDBC resources implement java.lang.AutoCloseable).'
  },
  {
    id: 11,
    category: 'Web Security',
    question: 'How are user passwords stored in your database, and why shouldn\'t you use plain MD5?',
    answer: 'Passwords are never stored in plaintext. We hash passwords using a cryptographic hashing algorithm with per-user salt (such as BCrypt or PBKDF2 / SHA-256 with cryptographic salt). MD5 is obsolete and cryptographically broken: attackers can reverse MD5 hashes in seconds using precomputed Rainbow Tables or GPU brute-forcing. Salted slow hashes like BCrypt include a configurable work factor that defeats brute-force attacks.',
    difficulty: 'Medium',
    commonFollowUp: 'What is salt in cryptography? (Answer: A random byte sequence added to the password prior to hashing to ensure identical passwords have distinct hash values).'
  },
  {
    id: 12,
    category: 'Web Security',
    question: 'What is Session Hijacking, and how can it be mitigated in Java Servlets?',
    answer: 'Session Hijacking occurs when an attacker steals a valid user\'s JSESSIONID cookie (via packet sniffing, Cross-Site Scripting (XSS), or physical access) and uses it to impersonate the user. Mitigations include: 1) Enforcing HTTPS/TLS so cookies cannot be intercepted over the network. 2) Marking session cookies with HttpOnly (prevents JavaScript access via document.cookie) and Secure flags. 3) Calling request.changeSessionId() upon login to prevent Session Fixation. 4) Setting an idle session timeout in web.xml.',
    difficulty: 'Hard',
    commonFollowUp: 'How do you configure session timeout in web.xml? (Answer: <session-config><session-timeout>30</session-timeout></session-config>).'
  },
  {
    id: 13,
    category: 'Servlets & JSP',
    question: 'What are the implicit objects available in JSP?',
    answer: 'JSP provides 9 implicit objects created automatically by the Servlet Container: 1) request (HttpServletRequest) 2) response (HttpServletResponse) 3) out (JspWriter) 4) session (HttpSession) 5) application (ServletContext) 6) config (ServletConfig) 7) pageContext (PageContext) 8) page (Object / this) 9) exception (Throwable, available only when isErrorPage="true").',
    difficulty: 'Easy',
    commonFollowUp: 'Which scope has the longest lifespan? (Answer: application scope / ServletContext, which lasts until the web application shuts down).'
  },
  {
    id: 14,
    category: 'System Design & Concurrency',
    question: 'Explain the role of the QR code generated on the e-ticket pass.',
    answer: 'The QR code contains a cryptographically hashed payload combining the Booking Reference ID, User ID, Event ID, and a server HMAC salt. At the venue entrance, event staff scan the QR code. The gate scanner queries the database: if the ticket exists and checked_in is FALSE, the system displays a green confirmation, sets checked_in = TRUE, and logs the entry timestamp. If the same ticket is scanned again, it flags "Ticket Already Used!", preventing pass duplication or unauthorized entry.',
    difficulty: 'Medium',
    commonFollowUp: 'Why encode a hash instead of raw user details? (Answer: Privacy protection and tamper-proofing).'
  },
  {
    id: 15,
    category: 'JDBC & Database',
    question: 'What is Database Normalization, and what normal forms does your project adhere to?',
    answer: 'Normalization is the process of organizing relational database tables to reduce data redundancy and eliminate anomalies (insertion, update, and deletion anomalies). Our database adheres to Third Normal Form (3NF): 1NF: All columns hold atomic values and each table has a primary key. 2NF: Meets 1NF and all non-key attributes are fully functionally dependent on the primary key (no partial dependencies). 3NF: Meets 2NF and has no transitive dependencies (non-key columns do not depend on other non-key columns).',
    difficulty: 'Medium',
    commonFollowUp: 'Give an example of a transitive dependency eliminated in this schema. (Answer: Instead of storing venue address and organizer email repeatedly inside the bookings table, we reference event_id).'
  }
];

export const PROJECT_REPORT_MARKDOWN = `# ACADEMIC PROJECT REPORT
## TITLE: ONLINE EVENT BOOKING & TICKET MANAGEMENT SYSTEM
### A Full-Stack 3-Tier Enterprise Web Application

---

### EXECUTIVE SUMMARY
The **Online Event Booking & Ticket Management System** is an enterprise-grade web application developed using the Java Platform (Jakarta EE / Servlets / JSP), MySQL RDBMS, and JDBC. The system resolves critical limitations present in conventional event ticketing—namely ticket overselling under concurrent load, fraudulent physical passes, manual ticket verification, and lack of real-time organizer analytics.

---

### CHAPTER 1: INTRODUCTION & OBJECTIVES
#### 1.1 Project Overview
Modern events—ranging from technology conferences and music concerts to university workshops—demand scalable, automated, and secure digital reservation platforms. This system bridges the gap between event organizers and attendees by offering an intuitive event discovery interface, seat reservation with multi-tier pricing, instant e-pass generation with scannable QR verification, and administrative operational control.

#### 1.2 Problem Statement
- **Concurrency Collisions:** High-demand ticket launches often cause multiple users to purchase the identical remaining seat when bookings are not guarded by atomic transactions.
- **Counterfeit Passes:** Paper and static PDF tickets can be duplicated or screenshotted and shared among multiple attendees.
- **Administrative Blind Spots:** Lack of real-time visibility into inventory utilization and revenue rollups.

#### 1.3 Key Objectives
- **ACID-Compliant Ticketing:** Implement pessimistic database locking to guarantee zero overselling.
- **Cryptographic Gate Verification:** Produce unique QR codes tied to a tamper-proof database hash.
- **3-Tier MVC Architecture:** Segregate presentation (JSP), business control (Java Servlets), and data persistence (JDBC DAO).
- **Role-Based Security:** Protect administrative operational endpoints via dedicated Servlet Filters.

---

### CHAPTER 2: SYSTEM ARCHITECTURE & MODULE DESIGN
#### 2.1 3-Tier Architecture
1. **Presentation Tier:** Responsive JSP templates leveraging JSTL and modern CSS.
2. **Application Tier:** Java Servlets (Controller) encapsulating request parsing, session checks, and business rules.
3. **Data Tier:** Data Access Objects (DAOs) communicating with MySQL 8.0 via JDBC Connection Pool.

#### 2.2 Core Modules
1. **User Authentication Module:** Registration, secure password hashing (BCrypt), session creation, and role mapping.
2. **Event Catalog & Filtering:** Search by query, category, price range, and date range.
3. **Booking & Transaction Engine:** Real-time seat validation, atomic decrement, and reference ID issuance.
4. **Ticket Pass Generator:** Dynamic SVG QR code creation with encrypted payload.
5. **Admin Operations & Analytics:** KPI dashboard, Event CRUD, attendee attendance toggle, and report export.

---

### CHAPTER 3: DATABASE DESIGN & SQL SCHEMA
The database adheres strictly to Third Normal Form (3NF). Entities include \`users\`, \`events\`, \`ticket_tiers\`, \`bookings\`, and \`tickets\`. Foreign key constraints enforce referential integrity with cascade rules where appropriate.

---

### CHAPTER 4: IMPLEMENTATION DETAILS
- **Concurrency Strategy:** Executed via \`UPDATE events SET available_seats = available_seats - ? WHERE event_id = ? AND available_seats >= ?\` within an uncommitted transaction.
- **SQL Injection Defense:** Strict parameter binding via \`java.sql.PreparedStatement\`.
- **Session Security:** Cryptographic session tokens, idle timeout, and \`HttpOnly\` flag configuration.

---

### CHAPTER 5: TESTING & VALIDATION
The application underwent Unit Testing (JUnit 5), Integration Testing across the Servlet pipeline, Boundary Value Analysis on seat allocations, and Security Penetration testing against common OWASP vulnerabilities.

---

### CHAPTER 6: CONCLUSION & FUTURE WORK
The Online Event Booking System successfully fulfills all academic and functional requirements. Future milestones include integrating production payment webhooks (Stripe/PayPal), WebSocket-powered live visual seating charts, and automated WhatsApp ticket delivery.
`;
