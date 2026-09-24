import api from "../lib/axios";
import { ArrowLeftIcon, FilePlus2Icon } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { createGuestNote } from "../lib/guestNotes";

const CreatePage = () => {
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authLoading) {
      toast.loading("Checking your session...");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      // Guest mode
      if (!user) {
        createGuestNote({
          title: title.trim(),
          content,
        });

        toast.success("Guest note created successfully");
        navigate("/");
        return;
      }

      // Logged-in mode
      await api.post("/notes", {
        title,
        content,
      });

      toast.success("Note created successfully");
      navigate("/");
    } catch (error) {
      console.log("Error creating note", error);

      if (error.response?.status === 429) {
        toast.error("Slow down! Rate limit reached", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-base-300">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8">
        <Link
          to="/"
          className="group mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-base-content/60 transition-all duration-300 hover:-translate-x-1 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
        >
          <ArrowLeftIcon className="size-5 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Notes
        </Link>

        <div className="mx-auto max-w-2xl">
          <div className="mb-7">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 shadow-[0_0_40px_rgba(0,255,157,0.06)]">
              <FilePlus2Icon className="size-7 text-primary" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-base-content">
              Create New Note
            </h1>

            <p className="mt-2 text-sm text-base-content/40">
              {user
                ? "Capture your thoughts and save them securely to your account."
                : "Capture your thoughts instantly. No account required."}
            </p>
          </div>

          {authLoading && (
            <div className="mb-5 rounded-xl border border-primary/10 bg-primary/[0.03] px-4 py-3">
              <p className="text-xs leading-5 text-base-content/40">
                Checking your account session...
              </p>
            </div>
          )}

          {!user && !authLoading && (
            <div className="mb-5 rounded-xl border border-primary/10 bg-primary/[0.03] px-4 py-3">
              <p className="text-xs leading-5 text-base-content/40">
                👻 You're in guest mode. This note will be saved in this
                browser.
              </p>
            </div>
          )}

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#151515] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative p-6 sm:p-8">
              <form onSubmit={handleSubmit}>
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
                    placeholder="Give your note a title..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base-content placeholder:text-base-content/25 outline-none transition-all duration-300 focus:border-primary/40 focus:bg-primary/5 focus:ring-2 focus:ring-primary/10"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

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
                    className="h-52 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base-content placeholder:text-base-content/25 outline-none transition-all duration-300 focus:border-primary/40 focus:bg-primary/5 focus:ring-2 focus:ring-primary/10"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-xs text-base-content/30">
                    {user
                      ? "Your note will be saved securely."
                      : "Saved locally in this browser."}
                  </span>

                  <button
                    type="submit"
                    className="group flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-5 py-3 font-medium text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/15 hover:shadow-[0_10px_35px_rgba(0,255,157,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading || authLoading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FilePlus2Icon className="size-5 transition-transform duration-300 group-hover:scale-110" />
                        Create Note
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary/30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
