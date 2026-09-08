import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import logo from "../assets/nexora-logo.png";

export default function AdminLogin() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from || "/";
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) {
      setError("Incorrect username or password.");
      return;
    }
    const from = (location.state as { from?: string } | null)?.from || "/";
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="NEXORA" className="h-14 w-14 rounded-full object-contain mb-3" />
          <p className="font-serif text-2xl text-chocolate">NEXORA</p>
          <p className="text-[10px] font-sans font-semibold tracking-widest2 uppercase text-black mt-1">
            Admin Dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-plum-100 rounded-lg p-6 md:p-8 shadow-soft"
        >
          <h1 className="font-serif text-xl text-chocolate mb-1">Sign in</h1>
          <p className="text-sm text-black font-sans mb-6">
            Enter your admin credentials to manage the store.
          </p>

          {error && (
            <div className="flex items-start gap-2 bg-rose/10 border border-rose/40 text-black text-sm font-sans rounded px-3 py-2.5 mb-5">
              <ShieldAlert size={16} className="shrink-0 mt-0.5 text-black" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="username" className="block text-xs font-semibold text-chocolate mb-1.5">
              Username
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
              <input
                id="username"
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full border border-plum-200 rounded pl-9 pr-3 py-2.5 text-sm text-chocolate placeholder:text-black focus:outline-none focus:border-plum"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-xs font-semibold text-chocolate mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-plum-200 rounded pl-9 pr-9 py-2.5 text-sm text-chocolate placeholder:text-black focus:outline-none focus:border-plum"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-black"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg">
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-black font-sans mt-5">
          NEXORA Beauty &amp; Essentials — store management only.
        </p>
      </div>
    </div>
  );
}
