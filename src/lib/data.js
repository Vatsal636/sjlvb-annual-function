export const events = [
    { id: 'evt-1', name: 'Prayer Dance', description: 'Traditional prayer dance performance.', category: 'dance', date: '2026-03-15', time: '17:30', venue: 'Main Stage', max_participants: 20 },
    { id: 'evt-4', name: 'Singing', description: 'Solo or group singing competition.', category: 'singing', date: '2026-03-15', time: '17:40', venue: 'Main Stage', max_participants: 10 },
    { id: 'evt-3', name: 'Duo Dance', description: 'Dynamic duo dance performance.', category: 'dance', date: '2026-03-15', time: '18:00', venue: 'Main Stage', max_participants: 2 },
    { id: 'evt-2', name: 'Skit', description: 'Perform a short play or skit.', category: 'drama', date: '2026-03-15', time: '18:15', venue: 'Main Stage', max_participants: 15 },
    { id: 'evt-8', name: 'Guitar', description: 'Acoustic or electric guitar performance.', category: 'music', date: '2026-03-15', time: '18:40', venue: 'Main Stage', max_participants: 5 },
    { id: 'evt-6', name: 'Western Dance', description: 'Western dance performance.', category: 'dance', date: '2026-03-15', time: '18:55', venue: 'Main Stage', max_participants: 20 },
    { id: 'evt-5', name: 'Mime', description: 'Express without words in this mime competition.', category: 'drama', date: '2026-03-15', time: '19:15', venue: 'Main Stage', max_participants: 5 },
    { id: 'evt-7', name: 'Lok Dayro', description: 'Traditional folk music and storytelling.', category: 'culture', date: '2026-03-15', time: '19:30', venue: 'Main Stage', max_participants: 10 },
    { id: 'evt-9', name: 'Punjabi Dance', description: 'Energetic Bhangra and Punjabi dance.', category: 'dance', date: '2026-03-15', time: '20:00', venue: 'Main Stage', max_participants: 20 },
    { id: 'evt-10', name: 'Mix Garba', description: 'Traditional and mixed style Garba.', category: 'dance', date: '2026-03-15', time: '20:20', venue: 'Main Stage', max_participants: 50 },
];

export const schedule = [
    { id: 'sch-1', title: 'Inauguration & Lamp Lighting', description: 'Welcome ceremony with chief guest', date: '2026-03-15', start_time: '17:00', end_time: '17:30', venue: 'Main Stage', category: 'ceremony', sort_order: 1 },
    { id: 'sch-2', title: 'Prayer Dance', description: 'Opening dance performance', date: '2026-03-15', start_time: '17:30', end_time: '17:40', venue: 'Main Stage', category: 'performance', sort_order: 2 },
    { id: 'sch-3', title: 'Singing', description: 'Solo or Group Singing', date: '2026-03-15', start_time: '17:40', end_time: '18:00', venue: 'Main Stage', category: 'performance', sort_order: 3 },
    { id: 'sch-4', title: 'Duo Dance', description: 'Energetic duo performances to pick up the pace', date: '2026-03-15', start_time: '18:00', end_time: '18:15', venue: 'Main Stage', category: 'performance', sort_order: 4 },
    { id: 'sch-5', title: 'Skit', description: 'Engaging acting and drama', date: '2026-03-15', start_time: '18:15', end_time: '18:40', venue: 'Main Stage', category: 'performance', sort_order: 5 },
    { id: 'sch-6', title: 'Guitar / Instrumental', description: 'Soulful musical break', date: '2026-03-15', start_time: '18:40', end_time: '18:55', venue: 'Main Stage', category: 'performance', sort_order: 6 },
    { id: 'sch-7', title: 'Western Dance', description: 'High-energy modern dance routines', date: '2026-03-15', start_time: '18:55', end_time: '19:15', venue: 'Main Stage', category: 'performance', sort_order: 7 },
    { id: 'sch-8', title: 'Mime', description: 'Thought-provoking silent dramatic acts', date: '2026-03-15', start_time: '19:15', end_time: '19:30', venue: 'Main Stage', category: 'performance', sort_order: 8 },
    { id: 'sch-9', title: 'Lok Dayro', description: 'Deep cultural dive and traditional storytelling', date: '2026-03-15', start_time: '19:30', end_time: '20:00', venue: 'Main Stage', category: 'performance', sort_order: 9 },
    { id: 'sch-10', title: 'Punjabi Dance', description: 'High-adrenaline Bhangra to hype the crowd', date: '2026-03-15', start_time: '20:00', end_time: '20:20', venue: 'Main Stage', category: 'performance', sort_order: 10 },
    { id: 'sch-11', title: 'Mix Garba', description: 'Grand Finale involving participants and audience', date: '2026-03-15', start_time: '20:20', end_time: '21:00', venue: 'Main Stage', category: 'performance', sort_order: 11 },
    { id: 'sch-12', title: 'Prize Distribution & Closing', description: 'Awards ceremony and vote of thanks', date: '2026-03-15', start_time: '21:00', end_time: '21:30', venue: 'Main Stage', category: 'ceremony', sort_order: 12 },
];

export const announcements = [
    { id: 'ann-1', title: '🎉 Annual Function Date Confirmed!', content: 'The SJLVB & SJLKC Annual Function is officially scheduled for March 15, 2026. Save the date and start preparing!', priority: 'urgent', author: 'Overall Head', created_at: '2026-03-01T10:00:00Z' },
    { id: 'ann-2', title: '📝 Registration Open for All Events', content: 'Registrations are now open for all competitions including dance, singing, drama, quiz, and more. Register before March 10!', priority: 'important', author: 'Overall Head', created_at: '2026-03-01T09:00:00Z' },
    { id: 'ann-3', title: '🎨 Decoration Theme Finalized', content: 'This year\'s decoration theme has been finalized. The team will begin setup from March 12. Volunteers welcome!', priority: 'info', author: 'Decoration Head', created_at: '2026-02-28T14:00:00Z' },
    { id: 'ann-4', title: '🎤 Anchoring Auditions', content: 'Auditions for the anchoring team will be held on March 5. Interested students please contact the Anchoring Head.', priority: 'info', author: 'Anchoring Head', created_at: '2026-02-28T09:00:00Z' },
];
