import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'annual.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDb();
  }
  return db;
}

function initializeDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      date TEXT,
      time TEXT,
      venue TEXT,
      max_participants INTEGER,
      status TEXT DEFAULT 'upcoming',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS participants (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      name TEXT NOT NULL,
      class TEXT,
      contact TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS schedule (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      venue TEXT,
      category TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      priority TEXT DEFAULT 'info',
      author TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      assigned_to TEXT,
      assigned_role TEXT,
      status TEXT DEFAULT 'todo',
      priority TEXT DEFAULT 'normal',
      due_date TEXT,
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assigned_to) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      name TEXT,
      rating INTEGER NOT NULL,
      category TEXT,
      comment TEXT,
      is_anonymous INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );



    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      title TEXT,
      image_url TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      uploaded_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed with demo data if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM events').get();
  if (count.c === 0) {
    seedData();
  }
}

function seedData() {
  const eventId = uuidv4;

  // Seed events
  const events = [
    { name: 'Prayer Dance', description: 'Traditional prayer dance performance.', category: 'dance', date: '2026-03-15', time: '10:00', venue: 'Main Stage', max_participants: 20 },
    { name: 'Skit', description: 'Perform a short play or skit.', category: 'drama', date: '2026-03-15', time: '10:30', venue: 'Main Stage', max_participants: 15 },
    { name: 'Duo Dance', description: 'Dynamic duo dance performance.', category: 'dance', date: '2026-03-15', time: '11:00', venue: 'Main Stage', max_participants: 2 },
    { name: 'Singing', description: 'Solo or group singing competition.', category: 'singing', date: '2026-03-15', time: '11:30', venue: 'Main Stage', max_participants: 10 },
    { name: 'Mime', description: 'Express without words in this mime competition.', category: 'drama', date: '2026-03-15', time: '12:30', venue: 'Main Stage', max_participants: 5 },
    { name: 'Western Dance', description: 'Western dance performance.', category: 'dance', date: '2026-03-15', time: '13:00', venue: 'Main Stage', max_participants: 20 },
    { name: 'Lok Dayro', description: 'Traditional folk music and storytelling.', category: 'culture', date: '2026-03-15', time: '14:00', venue: 'Main Stage', max_participants: 10 },
    { name: 'Guitar', description: 'Acoustic or electric guitar performance.', category: 'music', date: '2026-03-15', time: '15:00', venue: 'Main Stage', max_participants: 5 },
    { name: 'Punjabi Dance', description: 'Energetic Bhangra and Punjabi dance.', category: 'dance', date: '2026-03-15', time: '15:30', venue: 'Main Stage', max_participants: 20 },
    { name: 'Mix Garba', description: 'Traditional and mixed style Garba.', category: 'dance', date: '2026-03-15', time: '16:30', venue: 'Main Stage', max_participants: 50 },
  ];

  const insertEvent = db.prepare('INSERT INTO events (id, name, description, category, date, time, venue, max_participants) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  events.forEach(e => {
    insertEvent.run(uuidv4(), e.name, e.description, e.category, e.date, e.time, e.venue, e.max_participants);
  });

  // Seed schedule
  const scheduleItems = [
    { title: 'Inauguration & Lamp Lighting', description: 'Welcome ceremony with chief guest', date: '2026-03-15', start_time: '09:00', end_time: '09:45', venue: 'Main Stage', category: 'ceremony', sort_order: 1 },
    { title: 'Prayer Dance', description: 'Opening dance performance', date: '2026-03-15', start_time: '10:00', end_time: '10:30', venue: 'Main Stage', category: 'performance', sort_order: 2 },
    { title: 'Skit', description: 'Drama and skit performances', date: '2026-03-15', start_time: '10:30', end_time: '11:00', venue: 'Main Stage', category: 'performance', sort_order: 3 },
    { title: 'Duo Dance', description: 'Duo dance performances', date: '2026-03-15', start_time: '11:00', end_time: '11:30', venue: 'Main Stage', category: 'performance', sort_order: 4 },
    { title: 'Singing', description: 'Singing competition', date: '2026-03-15', start_time: '11:30', end_time: '12:30', venue: 'Main Stage', category: 'performance', sort_order: 5 },
    { title: 'Lunch Break', description: 'Refreshments for all', date: '2026-03-15', start_time: '12:30', end_time: '13:30', venue: 'Dining Hall', category: 'break', sort_order: 6 },
    { title: 'Mime', description: 'Mime performances', date: '2026-03-15', start_time: '13:30', end_time: '14:00', venue: 'Main Stage', category: 'performance', sort_order: 7 },
    { title: 'Western Dance', description: 'Western dance performances', date: '2026-03-15', start_time: '14:00', end_time: '14:30', venue: 'Main Stage', category: 'performance', sort_order: 8 },
    { title: 'Lok Dayro', description: 'Traditional folk music and storytelling', date: '2026-03-15', start_time: '14:30', end_time: '15:30', venue: 'Main Stage', category: 'performance', sort_order: 9 },
    { title: 'Guitar', description: 'Guitar performances', date: '2026-03-15', start_time: '15:30', end_time: '16:00', venue: 'Main Stage', category: 'performance', sort_order: 10 },
    { title: 'Punjabi Dance', description: 'Punjabi dance performances', date: '2026-03-15', start_time: '16:00', end_time: '16:30', venue: 'Main Stage', category: 'performance', sort_order: 11 },
    { title: 'Mix Garba', description: 'Traditional Garba', date: '2026-03-15', start_time: '16:30', end_time: '17:30', venue: 'Main Stage', category: 'performance', sort_order: 12 },
    { title: 'Prize Distribution & Closing', description: 'Awards ceremony and vote of thanks', date: '2026-03-15', start_time: '17:30', end_time: '18:30', venue: 'Main Stage', category: 'ceremony', sort_order: 13 },
  ];

  const insertSchedule = db.prepare('INSERT INTO schedule (id, title, description, date, start_time, end_time, venue, category, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  scheduleItems.forEach(s => {
    insertSchedule.run(uuidv4(), s.title, s.description, s.date, s.start_time, s.end_time, s.venue, s.category, s.sort_order);
  });

  // Seed announcements
  const announcements = [
    { title: '🎉 Annual Function Date Confirmed!', content: 'The SJLVB & SJLKC Annual Function is officially scheduled for March 15, 2026. Save the date and start preparing!', priority: 'urgent', author: 'Overall Head' },
    { title: '📝 Registration Open for All Events', content: 'Registrations are now open for all competitions including dance, singing, drama, quiz, and more. Register before March 10!', priority: 'important', author: 'Overall Head' },
    { title: '🎨 Decoration Theme Finalized', content: 'This year\'s decoration theme has been finalized. The team will begin setup from March 12. Volunteers welcome!', priority: 'info', author: 'Decoration Head' },
    { title: '🎤 Anchoring Auditions', content: 'Auditions for the anchoring team will be held on March 5. Interested students please contact the Anchoring Head.', priority: 'info', author: 'Anchoring Head' },
  ];

  const insertAnn = db.prepare('INSERT INTO announcements (id, title, content, priority, author) VALUES (?, ?, ?, ?, ?)');
  announcements.forEach(a => {
    insertAnn.run(uuidv4(), a.title, a.content, a.priority, a.author);
  });

  // Seed default admin user
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)').run(
    uuidv4(), 'Overall Head', 'head@annual.com', hashedPassword, 'Overall Head'
  );

  // Seed some tasks
  const tasks = [
    { title: 'Finalize stage decoration design', description: 'Create a design mockup for the main stage decoration', assigned_role: 'Decoration Head', status: 'todo', priority: 'high', due_date: '2026-03-10' },
    { title: 'Arrange sound system', description: 'Contact vendor and confirm sound system booking for the event', assigned_role: 'Logistic Head', status: 'todo', priority: 'urgent', due_date: '2026-03-08' },
    { title: 'Prepare event schedule poster', description: 'Design a visual schedule poster for social media', assigned_role: 'Media Head', status: 'progress', priority: 'normal', due_date: '2026-03-09' },
    { title: 'Confirm anchoring script', description: 'Write and review the anchoring script for the full event', assigned_role: 'Anchoring Head', status: 'todo', priority: 'high', due_date: '2026-03-12' },
    { title: 'Rehearsal schedule for performances', description: 'Create and share rehearsal timetable with all performers', assigned_role: 'Performances Head', status: 'progress', priority: 'urgent', due_date: '2026-03-07' },
    { title: 'Arrange chairs and tables', description: 'Coordinate seating arrangement for audience and guests', assigned_role: 'Logistic Head', status: 'todo', priority: 'normal', due_date: '2026-03-13' },
  ];

  const insertTask = db.prepare('INSERT INTO tasks (id, title, description, assigned_role, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)');
  tasks.forEach(t => {
    insertTask.run(uuidv4(), t.title, t.description, t.assigned_role, t.status, t.priority, t.due_date);
  });
}

export default getDb;
