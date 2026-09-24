import { ZapIcon } from "lucide-react";

const RateLimitedUI = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div
        className="relative overflow-hidden rounded-2xl
        border border-primary/20
        bg-[#151515]
        shadow-[0_15px_50px_rgba(0,255,157,0.06)]"
      >
        {/* Background glow */}
        <div
          className="absolute -right-20 -top-20 h-48 w-48
          rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative flex flex-col items-center p-7 md:flex-row">
          {/* Icon */}
          <div
            className="mb-5 flex size-16 shrink-0 items-center justify-center
            rounded-2xl border border-primary/20
            bg-primary/5
            md:mb-0 md:mr-6"
          >
            <ZapIcon className="size-8 text-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
              <span
                className="rounded-full border border-primary/20
                bg-primary/5 px-3 py-1
                font-mono text-[11px] uppercase tracking-wider
                text-primary"
              >
                API Limit
              </span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-base-content">
              Rate Limit Reached
            </h3>

            <p className="mt-2 text-sm leading-6 text-base-content/60">
              You've made too many requests in a short period. Please wait a
              moment.
            </p>

            <p className="mt-1 text-xs text-base-content/40">
              Try again in a few seconds for the best experience.
            </p>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary/30" />
      </div>
    </div>
  );
};

export default RateLimitedUI;