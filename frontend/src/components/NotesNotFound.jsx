import { NotebookIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

const NotesNotFound = () => {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-24 text-center">
      {/* Icon */}
      <div
        className="relative mb-7 flex size-20 items-center justify-center
        rounded-2xl border border-primary/20
        bg-primary/5
        shadow-[0_0_50px_rgba(0,255,157,0.08)]"
      >
        <div
          className="absolute inset-0 rounded-2xl
          bg-primary/5 blur-xl"
        />

        <NotebookIcon className="relative size-10 text-primary" />
      </div>

      {/* Heading */}
      <h3 className="text-2xl font-bold tracking-tight text-base-content">
        No notes yet
      </h3>

      {/* Description */}
      <p className="mt-3 text-sm leading-6 text-base-content/50">
        Ready to organize your thoughts? Create your first note to get started
        on your journey.
      </p>

      {/* Create button */}
      <Link
        to="/create"
        className="group mt-7 flex items-center gap-2 rounded-xl
        border border-primary/20
        bg-primary/10 px-5 py-3
        font-medium text-primary
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-primary/40
        hover:bg-primary/15
        hover:shadow-[0_10px_35px_rgba(0,255,157,0.12)]"
      >
        <PlusIcon
          className="size-5 transition-transform duration-300
          group-hover:rotate-90"
        />
        <span>Create Your First Note</span>
      </Link>

      {/* Bottom accent */}
      <div className="mt-10 h-px w-24 bg-primary/20" />
    </div>
  );
};

export default NotesNotFound;