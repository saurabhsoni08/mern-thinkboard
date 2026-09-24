import express from "express";

import {
  getAllNotes,
  DeleteNote,
  CreateNote,
  UpdateNote,
  getNoteById,
} from "../controllers/notesControllers.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Every notes endpoint requires authentication
router.use(protect);

router.get("/", getAllNotes);

router.get("/:id", getNoteById);

router.post("/", CreateNote);

router.put("/:id", UpdateNote);

router.delete("/:id", DeleteNote);

export default router;