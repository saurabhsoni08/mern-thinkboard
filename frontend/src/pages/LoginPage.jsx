import React, { useState } from "react";
import { LockKeyholeIcon, LogInIcon, MailIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);

      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      console.log("Login error:", error);

      toast.error(error.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-300 px-4">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[750px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/login"
            className="font-mono text-3xl font-bold tracking-tight"
          >
            <span className="text-base-content">Notes</span>
            <span className="text-primary">Lab</span>
          </Link>

          <h1 className="mt-7 text-3xl font-bold tracking-tight text-base-content">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-base-content/40">
            Sign in to access your notes.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#151515] shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

          <form onSubmit={handleSubmit} className="relative p-6 sm:p-8">
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-base-content/70">
                Email
              </label>

              <div className="flex items-center rounded-xl border border-white/10 bg-white/5 transition-all focus-within:border-primary/40 focus-within:bg-primary/5">
                <MailIcon className="ml-4 size-5 text-base-content/30" />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-3 py-3 text-base-content outline-none placeholder:text-base-content/25"
                />
              </div>
            </div>

            <div className="mb-7">
              <label className="mb-2 block text-sm font-medium text-base-content/70">
                Password
              </label>

              <div className="flex items-center rounded-xl border border-white/10 bg-white/5 transition-all focus-within:border-primary/40 focus-within:bg-primary/5">
                <LockKeyholeIcon className="ml-4 size-5 text-base-content/30" />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent px-3 py-3 text-base-content outline-none placeholder:text-base-content/25"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-5 py-3 font-medium text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/15 hover:shadow-[0_10px_35px_rgba(0,255,157,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogInIcon className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  Sign In
                </>
              )}
            </button>

            <div className="mt-6 space-y-4 text-center">
              <p className="text-sm text-base-content/40">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Create one
                </Link>
              </p>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-base-content/20">OR</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <Link
                to="/"
                className="
      inline-flex
      items-center
      justify-center
      rounded-xl
      border
      border-white/10
      bg-white/[0.03]
      px-5
      py-2.5
      text-sm
      font-medium
      text-base-content/60
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:border-primary/20
      hover:bg-primary/5
      hover:text-primary
    "
              >
                Continue as Guest
              </Link>
            </div>
          </form>

          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary/30" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
