const GUEST_NOTES_KEY = "noteslab_guest_notes";

// Internal helper
const readGuestNotes = () => {
  try {
    const storedNotes = localStorage.getItem(GUEST_NOTES_KEY);

    if (!storedNotes) {
      return [];
    }

    return JSON.parse(storedNotes);
  } catch (error) {
    console.error("Error reading guest notes:", error);
    return [];
  }
};

// Internal helper
const saveGuestNotes = (notes) => {
  try {
    localStorage.setItem(
      GUEST_NOTES_KEY,
      JSON.stringify(notes)
    );
  } catch (error) {
    console.error("Error saving guest notes:", error);
  }
};

// Get all guest notes
export const getGuestNotes = () => {
  return readGuestNotes();
};

// Create guest note
export const createGuestNote = ({ title, content }) => {
  const notes = readGuestNotes();

  const newNote = {
    _id: crypto.randomUUID(),
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isGuest: true,
  };

  saveGuestNotes([newNote, ...notes]);

  return newNote;
};

// Get one guest note
export const getGuestNoteById = (id) => {
  const notes = readGuestNotes();

  return (
    notes.find((note) => note._id === id) || null
  );
};

// Update guest note
export const updateGuestNote = (
  id,
  { title, content }
) => {
  const notes = readGuestNotes();

  const updatedNotes = notes.map((note) =>
    note._id === id
      ? {
          ...note,
          title,
          content,
          updatedAt: new Date().toISOString(),
        }
      : note
  );

  saveGuestNotes(updatedNotes);

  return (
    updatedNotes.find((note) => note._id === id) ||
    null
  );
};

// Delete guest note
export const deleteGuestNote = (id) => {
  const notes = readGuestNotes();

  const updatedNotes = notes.filter(
    (note) => note._id !== id
  );

  saveGuestNotes(updatedNotes);
};