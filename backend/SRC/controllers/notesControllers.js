import Note from "../models/Note.js";


// GET ALL NOTES
export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}


// GET NOTE BY ID
export async function getNoteById(req, res) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById controller", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}


// CREATE NOTE
export async function CreateNote(req, res) {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const note = new Note({
      title: title.trim(),
      content,
      userId: req.user.userId,
    });

    const savedNote = await note.save();

    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote controller", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}


// UPDATE NOTE
export async function UpdateNote(req, res) {
  try {
    const { title, content } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      {
        title,
        content,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updating controller", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}


// DELETE NOTE
export async function DeleteNote(req, res) {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleting Note", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}