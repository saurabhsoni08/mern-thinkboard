import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, LogInIcon, LogOutIcon, UserIcon } from "lucide-react";

import AnimatedLogo from "./AnimatedLogo";
import { useAuth } from "../Context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Logout error:", error);
      toast.error("Session cleared");
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="border-b border-white/10 bg-[#111111]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <AnimatedLogo />

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* New Note */}
            <Link
              to="/create"
              className="
                group flex items-center gap-2
                rounded-xl
                border border-primary/20
                bg-primary/10
                px-4 py-2.5
                font-medium text-primary
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-primary/40
                hover:bg-primary/15
                hover:shadow-[0_8px_30px_rgba(0,255,157,0.12)]
              "
            >
              <PlusIcon
                className="
                  size-5
                  transition-transform duration-300
                  group-hover:rotate-90
                "
              />

              <span>New Note</span>
            </Link>

            {/* Logged-in user */}
            {user ? (
              <>
                {/* User name */}
                <div
                  className="
                    hidden
                    items-center
                    gap-2
                    rounded-xl
                    border border-primary/10
                    bg-primary/[0.04]
                    px-4
                    py-2.5
                    sm:flex
                  "
                >
                  <div
                    className="
                      flex size-8 items-center justify-center
                      rounded-lg
                      border border-primary/20
                      bg-primary/10
                    "
                  >
                    <UserIcon className="size-4 text-primary" />
                  </div>

                  <div className="max-w-[140px]">
                    <p className="text-[10px] uppercase tracking-wider text-base-content/30">
                      Welcome
                    </p>

                    <p className="truncate text-sm font-medium text-base-content/80">
                      {user.name}
                    </p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Logout"
                  title="Logout"
                  className="
                    group flex size-14
                    items-center justify-center
                    rounded-xl
                    border border-white/10
                    bg-white/[0.03]
                    text-base-content/40
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-error/30
                    hover:bg-error/10
                    hover:text-error
                  "
                >
                  <LogOutIcon
                    className="
                      size-6
                      transition-transform duration-300
                      group-hover:translate-x-0.5
                    "
                  />
                </button>
              </>
            ) : (
              /* Guest → Sign In */
              <Link
                to="/login"
                aria-label="Sign in"
                className="
                  group flex items-center gap-2
                  rounded-xl
                  border border-white/10
                  bg-white/[0.03]
                  px-4 py-2.5
                  text-sm font-medium
                  text-base-content/60
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:border-primary/30
                  hover:bg-primary/5
                  hover:text-primary
                "
              >
                <LogInIcon
                  className="
                    size-5
                    transition-transform duration-300
                    group-hover:translate-x-0.5
                  "
                />

                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
