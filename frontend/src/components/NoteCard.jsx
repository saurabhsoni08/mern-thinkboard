import { deleteGuestNote } from "../lib/guestNotes";
import React, { useState } from "react";

import {
  CalendarDaysIcon,
  PenSquareIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    navigate(`/note/${note._id}`);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      if (note.isGuest) {
        deleteGuestNote(note._id);

        setNotes((prev) => prev.filter((item) => item._id !== note._id));

        toast.success("Guest note deleted successfully");
      } else {
        await api.delete(`/notes/${note._id}`);

        setNotes((prev) => prev.filter((item) => item._id !== note._id));

        toast.success("Note deleted successfully");
      }

      setShowDeleteModal(false);
    } catch (error) {
      console.log("Error in handleDelete", error);

      toast.error("Failed to delete note");
    } finally {
      setDeleting(false);
    }
  };

  const closeModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!deleting) {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {/* =====================================================
          NOTE CARD
      ===================================================== */}

      <article
        className="
          cursor-card
          group
          relative
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-[#151515]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-primary/30
          hover:shadow-[0_18px_50px_rgba(0,255,157,0.10)]
        "
      >
        {/* CARD GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            -right-14
            -top-14
            h-32
            w-32
            rounded-full
            bg-primary/5
            blur-3xl
            transition-all
            duration-500
            group-hover:bg-primary/15
          "
        />

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="relative px-5 pb-5 pt-1">
          {/* =================================================
              TOP ROW
          ================================================= */}

          <div className="flex items-center justify-between">
            <span
              className="
                inline-flex
                rounded-full
                border
                border-primary/20
                bg-primary/5
                px-3
                py-1
                font-mono
                text-[10px]
                uppercase
                tracking-widest
                text-primary
              "
            >
              NOTE
            </span>

            <span
              className="
                font-mono
                text-[9px]
                uppercase
                tracking-[0.2em]
                text-base-content/20
              "
            >
              NOTESLAB
            </span>
          </div>

          {/* =================================================
              NOTE CONTENT
          ================================================= */}

          <Link to={`/note/${note._id}`} className="mt-4 block">
            <h3
              className="
                line-clamp-2
                text-xl
                font-bold
                leading-tight
                tracking-tight
                text-base-content
                transition-colors
                duration-300
                group-hover:text-primary
              "
            >
              {note.title}
            </h3>

            <p
              className="
                mt-2
                line-clamp-2
                text-sm
                leading-6
                text-base-content/50
              "
            >
              {note.content}
            </p>
          </Link>

          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="my-4 h-px bg-white/10" />

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="flex items-center justify-between">
            {/* DATE */}

            <div
              className="
                flex
                items-center
                gap-2
                text-xs
                text-base-content/40
              "
            >
              <CalendarDaysIcon className="size-[18px] text-primary/70" />

              <span>{formatDate(note.createdAt)}</span>
            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="flex items-center gap-1">
              {/* EDIT */}

              <button
                type="button"
                onClick={handleEdit}
                aria-label="Edit note"
                className="
                  flex
                  size-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-transparent
                  text-base-content/40
                  transition-all
                  duration-200
                  hover:border-primary/20
                  hover:bg-primary/10
                  hover:text-primary
                  hover:shadow-[0_0_18px_rgba(0,255,157,0.08)]
                "
              >
                <PenSquareIcon className="size-[19px]" />
              </button>

              {/* DELETE */}

              <button
                type="button"
                onClick={handleDeleteClick}
                aria-label="Delete note"
                className="
                  flex
                  size-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-transparent
                  text-base-content/40
                  transition-all
                  duration-200
                  hover:border-error/20
                  hover:bg-error/10
                  hover:text-error
                  hover:shadow-[0_0_18px_rgba(255,0,0,0.08)]
                "
              >
                <Trash2Icon className="size-[19px]" />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM GREEN LINE */}

        <div
          className="
            absolute
            bottom-0
            left-0
            h-[2px]
            w-0
            bg-primary
            shadow-[0_0_12px_rgba(0,255,157,0.5)]
            transition-all
            duration-500
            group-hover:w-full
          "
        />
      </article>

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {showDeleteModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            px-4
            backdrop-blur-sm
          "
          onClick={closeModal}
        >
          <div
            className="
              relative
              w-full
              max-w-md
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-[#151515]
              shadow-[0_25px_80px_rgba(0,0,0,0.5)]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL GLOW */}

            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-48
                w-48
                rounded-full
                bg-error/10
                blur-3xl
              "
            />

            {/* CLOSE */}

            <button
              type="button"
              onClick={closeModal}
              disabled={deleting}
              aria-label="Close delete dialog"
              className="
                absolute
                right-4
                top-4
                z-10
                flex
                size-9
                items-center
                justify-center
                rounded-xl
                text-base-content/40
                transition-all
                duration-200
                hover:bg-white/5
                hover:text-base-content
                disabled:opacity-40
              "
            >
              <XIcon className="size-5" />
            </button>

            <div className="relative p-7">
              <div
                className="
                  mb-5
                  flex
                  size-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-error/20
                  bg-error/10
                "
              >
                <Trash2Icon className="size-7 text-error" />
              </div>

              <h3 className="text-2xl font-bold text-base-content">
                Delete this note?
              </h3>

              <p className="mt-3 text-sm leading-6 text-base-content/50">
                You're about to permanently delete{" "}
                <span className="font-medium text-base-content/80">
                  "{note.title}"
                </span>
                . This action cannot be undone.
              </p>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={deleting}
                  className="
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-base-content/70
                    transition-all
                    hover:bg-white/10
                    hover:text-base-content
                    disabled:opacity-40
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-error
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    hover:bg-error/90
                    disabled:opacity-50
                  "
                >
                  {deleting ? (
                    <>
                      <span className="loading loading-spinner loading-xs" />
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

            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-error/60" />
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;
