import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";

import {
  ArrowLeftIcon,
  FileTextIcon,
  LoaderIcon,
  SaveIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import {
  getGuestNoteById,
  updateGuestNote,
  deleteGuestNote,
} from "../lib/guestNotes";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const fetchNote = async () => {
      setLoading(true);

      try {
        // 👻 GUEST MODE
        if (!user) {
          const guestNote = getGuestNoteById(id);

          if (!guestNote) {
            setNote(null);
            return;
          }

          setNote(guestNote);
          return;
        }

        // 🔐 LOGGED-IN MODE
        const res = await api.get(`/notes/${id}`);

        setNote(res.data);
      } catch (error) {
        console.log("Error in fetching note", error);

        if (error.response?.status === 404) {
          setNote(null);
          toast.error("Note not found");
        } else if (error.response?.status === 401) {
          toast.error("Your session has expired");
          navigate("/login");
        } else {
          toast.error("Failed to fetch the note");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, user, authLoading, navigate]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      // 👻 GUEST MODE
      if (!user) {
        deleteGuestNote(id);

        toast.success("Guest note deleted successfully");

        setShowDeleteModal(false);
        navigate("/");
        return;
      }

      // 🔐 LOGGED-IN MODE
      await api.delete(`/notes/${id}`);

      toast.success("Note deleted successfully");

      setShowDeleteModal(false);
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);

      toast.error(error.response?.data?.message || "Failed to delete note");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title and content");
      return;
    }

    setSaving(true);

    try {
      // 👻 GUEST MODE
      if (!user) {
        const updatedNote = updateGuestNote(id, {
          title: note.title.trim(),
          content: note.content,
        });

        if (!updatedNote) {
          toast.error("Note not found");
          return;
        }

        setNote(updatedNote);

        toast.success("Guest note updated successfully");

        navigate("/");
        return;
      }

      // 🔐 LOGGED-IN MODE
      const res = await api.put(`/notes/${id}`, {
        title: note.title.trim(),
        content: note.content,
      });

      setNote(res.data);

      toast.success("Note updated successfully");

      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);

      toast.error(error.response?.data?.message || "Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const closeDeleteModal = () => {
    if (!deleting) {
      setShowDeleteModal(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-300">
        <div
          className="
            pointer-events-none absolute left-1/2 top-0
            h-[500px] w-[700px] -translate-x-1/2
            rounded-full bg-primary/5 blur-3xl
          "
        />

        <div className="relative flex flex-col items-center">
          <div
            className="
              flex size-16 items-center justify-center
              rounded-2xl border border-primary/20
              bg-primary/5
              shadow-[0_0_40px_rgba(0,255,157,0.08)]
            "
          >
            <LoaderIcon className="size-7 animate-spin text-primary" />
          </div>

          <p className="mt-5 text-sm text-base-content/40">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-300">
        <div
          className="
            pointer-events-none absolute left-1/2 top-0
            h-[500px] w-[700px] -translate-x-1/2
            rounded-full bg-primary/5 blur-3xl
          "
        />

        <div className="relative text-center">
          <FileTextIcon className="mx-auto mb-4 size-12 text-base-content/30" />

          <h2 className="text-2xl font-bold text-base-content">
            Note not found
          </h2>

          <p className="mt-2 text-sm text-base-content/40">
            This note may have been deleted or you don't have access to it.
          </p>

          <Link
            to="/"
            className="
              mt-6 inline-flex items-center gap-2
              rounded-xl border border-primary/20
              bg-primary/10 px-5 py-3
              font-medium text-primary
              transition-all duration-300
              hover:-translate-y-0.5
              hover:border-primary/40
              hover:bg-primary/15
            "
          >
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-base-300">
      {/* Background glow */}
      <div
        className="
          pointer-events-none absolute left-1/2 top-0
          h-[500px] w-[700px] -translate-x-1/2
          rounded-full bg-primary/5 blur-3xl
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8">
        <div className="mx-auto max-w-3xl">
          {/* Top navigation */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              to="/"
              className="
                group inline-flex items-center gap-2
                rounded-xl border border-white/10
                bg-white/5 px-4 py-2.5
                text-sm font-medium text-base-content/60
                transition-all duration-300
                hover:-translate-x-1
                hover:border-primary/20
                hover:bg-primary/5
                hover:text-primary
              "
            >
              <ArrowLeftIcon
                className="
                  size-5
                  transition-transform duration-300
                  group-hover:-translate-x-1
                "
              />
              Back to Notes
            </Link>

            <button
              type="button"
              data-testid="delete-note-button"
              onClick={handleDeleteClick}
              className="
                group inline-flex items-center gap-2
                rounded-xl border border-error/20
                bg-error/5 px-4 py-2.5
                text-sm font-medium text-error
                transition-all duration-300
                hover:border-error/40
                hover:bg-error/10
                hover:shadow-[0_8px_30px_rgba(255,0,0,0.08)]
              "
            >
              <Trash2Icon
                className="
                  size-5
                  transition-transform duration-300
                  group-hover:scale-110
                "
              />
              Delete Note
            </button>
          </div>

          {/* Page heading */}
          <div className="mb-7">
            <div
              className="
                mb-4 flex size-14 items-center justify-center
                rounded-2xl border border-primary/20
                bg-primary/5
                shadow-[0_0_40px_rgba(0,255,157,0.06)]
              "
            >
              <FileTextIcon className="size-7 text-primary" />
            </div>

            <div className="flex items-center gap-2">
              <span
                className="
                  rounded-full border border-primary/20
                  bg-primary/5 px-3 py-1
                  font-mono text-[11px] uppercase tracking-wider
                  text-primary
                "
              >
                {user ? "EDIT NOTE" : "GUEST NOTE"}
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-base-content">
              Edit your note
            </h1>

            <p className="mt-2 text-sm text-base-content/40">
              {user
                ? "Update your thoughts and save your changes."
                : "Update your guest note. Changes are saved in this browser."}
            </p>
          </div>

          {/* Guest mode notice */}
          {!user && (
            <div className="mb-5 rounded-xl border border-primary/10 bg-primary/[0.03] px-4 py-3">
              <p className="text-xs leading-5 text-base-content/40">
                👻 You're editing this note as a guest. It is stored only in
                this browser.
              </p>
            </div>
          )}

          {/* Editor card */}
          <div
            className="
              relative overflow-hidden rounded-2xl
              border border-white/10 bg-[#151515]
              shadow-[0_20px_60px_rgba(0,0,0,0.2)]
            "
          >
            {/* Background glow */}
            <div
              className="
                absolute -right-20 -top-20
                h-48 w-48
                rounded-full
                bg-primary/10 blur-3xl
              "
            />

            <div className="relative p-6 sm:p-8">
              {/* Title */}
              <div className="mb-6">
                <label
                  htmlFor="note-title"
                  className="mb-2 block text-sm font-medium text-base-content/70"
                >
                  Title
                </label>

                <input
                  id="note-title"
                  type="text"
                  placeholder="Note title"
                  className="
      w-full rounded-xl border border-white/10
      bg-white/5 px-4 py-3
      text-base-content
      placeholder:text-base-content/25
      outline-none transition-all duration-300
      focus:border-primary/40
      focus:bg-primary/5
      focus:ring-2 focus:ring-primary/10
    "
                  value={note.title}
                  onChange={(e) =>
                    setNote({
                      ...note,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              {/* Content */}
              <div className="mb-7">
                <label
                  htmlFor="note-content"
                  className="mb-2 block text-sm font-medium text-base-content/70"
                >
                  Content
                </label>

                <textarea
                  id="note-content"
                  placeholder="Write your note here..."
                  className="
      h-64 w-full resize-none rounded-xl
      border border-white/10
      bg-white/5 px-4 py-3
      text-base-content
      placeholder:text-base-content/25
      outline-none transition-all duration-300
      focus:border-primary/40
      focus:bg-primary/5
      focus:ring-2 focus:ring-primary/10
    "
                  value={note.content}
                  onChange={(e) =>
                    setNote({
                      ...note,
                      content: e.target.value,
                    })
                  }
                />
              </div>

              {/* Save section */}
              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-xs text-base-content/30">
                  {user
                    ? "Your changes will be saved securely."
                    : "Changes will be saved in this browser."}
                </span>

                <button
                  type="button"
                  className="
                    group flex items-center gap-2
                    rounded-xl border border-primary/20
                    bg-primary/10 px-5 py-3
                    font-medium text-primary
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-primary/40
                    hover:bg-primary/15
                    hover:shadow-[0_10px_35px_rgba(0,255,157,0.12)]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    disabled:hover:translate-y-0
                  "
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? (
                    <>
                      <LoaderIcon className="size-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon
                        className="
                          size-5
                          transition-transform duration-300
                          group-hover:scale-110
                        "
                      />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary/30" />
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          data-testid="delete-note-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-note-title"
          className="
    fixed inset-0 z-50 flex items-center justify-center
    bg-black/70 px-4 backdrop-blur-sm
  "
          onClick={closeDeleteModal}
        >
          <div
            className="
              relative w-full max-w-md overflow-hidden rounded-2xl
              border border-white/10 bg-[#151515]
              shadow-[0_25px_80px_rgba(0,0,0,0.5)]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal glow */}
            <div
              className="
                absolute -right-20 -top-20
                h-48 w-48
                rounded-full
                bg-error/10 blur-3xl
              "
            />

            {/* Close */}
            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={deleting}
              className="
                absolute right-4 top-4 z-10
                flex size-9 items-center justify-center
                rounded-xl text-base-content/40
                transition-all duration-200
                hover:bg-white/5
                hover:text-base-content
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <XIcon className="size-5" />
            </button>

            <div className="relative p-7">
              {/* Icon */}
              <div
                className="
                  mb-5 flex size-14 items-center justify-center
                  rounded-2xl border border-error/20
                  bg-error/10
                "
              >
                <Trash2Icon className="size-7 text-error" />
              </div>

              <h3
                id="delete-note-title"
                className="text-2xl font-bold text-base-content"
              >
                Delete this note?
              </h3>

              <p className="mt-3 text-sm leading-6 text-base-content/50">
                You're about to permanently delete{" "}
                <span className="font-medium text-base-content/80">
                  "{note.title}"
                </span>
                . This action cannot be undone.
              </p>

              {/* Modal buttons */}
              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="
                    rounded-xl border border-white/10
                    bg-white/5 px-5 py-2.5
                    text-sm font-medium text-base-content/70
                    transition-all duration-200
                    hover:bg-white/10
                    hover:text-base-content
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  data-testid="confirm-delete-button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="
                    flex items-center gap-2 rounded-xl
                    bg-error px-5 py-2.5
                    text-sm font-medium text-white
                    transition-all duration-200
                    hover:bg-error/90
                    hover:shadow-[0_8px_30px_rgba(255,0,0,0.2)]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {deleting ? (
                    <>
                      <LoaderIcon className="size-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2Icon className="size-4" />
                      Delete Note
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Modal bottom accent */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-error/60" />
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteDetailPage;
