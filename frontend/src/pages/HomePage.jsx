import React, { useEffect, useMemo, useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import { useAuth } from "../Context/AuthContext";
import { getGuestNotes } from "../lib/guestNotes";

const HomePage = () => {
  const { user, loading: authLoading } = useAuth();

  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (authLoading) return;

    const fetchNotes = async () => {
      setLoading(true);

      // Guest mode
      if (!user) {
        setNotes(getGuestNotes());
        setIsRateLimited(false);
        setLoading(false);
        return;
      }

      // Logged-in mode
      try {
        const res = await api.get("/notes");

        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes", error);

        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else if (error.response?.status === 401) {
          toast.error("Your session has expired");
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user, authLoading]);

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return notes;
    }

    return notes.filter((note) => {
      const title = note.title?.toLowerCase() || "";
      const content = note.content?.toLowerCase() || "";

      return title.includes(query) || content.includes(query);
    });
  }, [notes, searchQuery]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-300">
        <div className="text-center">
          <span className="loading loading-spinner loading-md text-primary" />

          <p className="mt-4 text-sm text-base-content/40">
            Loading NotesLab...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-base-300">
      <div
        className="
          pointer-events-none absolute left-1/2 top-0 -z-0
          h-[450px] w-[750px] -translate-x-1/2
          rounded-full bg-primary/5 blur-3xl
        "
      />

      <div className="relative z-10">
        <Navbar />

        {!user && (
          <div className="mx-auto max-w-7xl px-5 pt-5">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-primary/10 bg-primary/[0.03] px-4 py-3">
              <p className="text-xs text-base-content/40">
                You're using NotesLab as a guest. Your notes are saved in this
                browser.
              </p>

              <div className="hidden shrink-0 gap-3 sm:flex">
                <a
                  href="/login"
                  className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Sign in
                </a>

                <a
                  href="/register"
                  className="text-xs font-medium text-base-content/50 transition-colors hover:text-primary"
                >
                  Create account
                </a>
              </div>
            </div>
          </div>
        )}

        {isRateLimited && <RateLimitedUI />}

        <main className="mx-auto max-w-7xl px-5 pb-12 pt-8">
          {!loading && !isRateLimited && (
            <section className="mb-7">
              <div className="flex items-end justify-between gap-5">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(0,255,157,0.7)]" />

                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary/70">
                      {user ? "Your Notes" : "Guest Notes"}
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
                    All Notes
                  </h1>

                  <p className="mt-2 text-sm text-base-content/40">
                    {user
                      ? "Your thoughts, ideas, and everything worth remembering."
                      : "Capture your thoughts instantly — no account required."}
                  </p>
                </div>

                <div className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 sm:block">
                  <span className="text-xs text-base-content/30">Notes</span>

                  <span className="ml-2 font-mono text-sm text-primary">
                    {String(notes.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="mt-5 max-w-xl">
                <div className="group flex items-center rounded-xl border border-white/10 bg-[#151515] transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_30px_rgba(0,255,157,0.05)]">
                  <SearchIcon className="ml-4 size-5 shrink-0 text-base-content/30 transition-colors duration-300 group-focus-within:text-primary" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your notes..."
                    className="w-full bg-transparent px-3 py-3 text-sm text-base-content outline-none placeholder:text-base-content/25"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                      className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-lg text-base-content/30 transition-all duration-200 hover:bg-white/5 hover:text-base-content"
                    >
                      <XIcon className="size-4" />
                    </button>
                  )}
                </div>

                {searchQuery && (
                  <p className="mt-2 text-xs text-base-content/30">
                    {filteredNotes.length === 0
                      ? "No notes found"
                      : `${filteredNotes.length} ${
                          filteredNotes.length === 1 ? "note" : "notes"
                        } found`}
                  </p>
                )}
              </div>
            </section>
          )}

          {loading && (
            <div className="flex min-h-[45vh] items-center justify-center">
              <div className="text-center">
                <span className="loading loading-spinner loading-md text-primary" />

                <p className="mt-4 text-sm text-base-content/40">
                  Loading your notes...
                </p>
              </div>
            </div>
          )}

          {!loading && !isRateLimited && filteredNotes.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredNotes.map((note) => (
                <NoteCard key={note._id} note={note} setNotes={setNotes} />
              ))}
            </div>
          )}

          {!loading &&
            !isRateLimited &&
            notes.length > 0 &&
            filteredNotes.length === 0 &&
            searchQuery && (
              <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
                <div className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                  <SearchIcon className="size-6 text-base-content/30" />
                </div>

                <h2 className="text-xl font-semibold text-base-content">
                  No matching notes
                </h2>

                <p className="mt-2 max-w-sm text-sm text-base-content/40">
                  Nothing matches{" "}
                  <span className="text-base-content/70">"{searchQuery}"</span>.
                </p>

                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-5 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-all duration-300 hover:border-primary/40 hover:bg-primary/15"
                >
                  Clear Search
                </button>
              </div>
            )}

          {!loading && !isRateLimited && notes.length === 0 && (
            <NotesNotFound />
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
