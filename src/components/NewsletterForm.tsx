import { useState } from "react";
import { Button } from "./ui/Button";
import { isSupabaseConfigured } from "../lib/supabase";
import { subscribeEmail } from "../lib/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "loading" | "success" | "duplicate" | "error" | "unconfigured";

interface NewsletterFormProps {
  className?: string;
  inputClassName?: string;
}

// -----------------------------------------------------------------------
// The homepage newsletter signup used to be a dead stub — its onSubmit was
// literally just `(e) => e.preventDefault()`, so nothing anyone typed was
// ever stored anywhere. This is the real implementation: validates the
// email, calls subscribeEmail() (which inserts into the `subscribers`
// table — see supabase/schema_additions.sql), and surfaces every outcome
// (loading, success, duplicate, error, or "not connected yet") instead of
// silently doing nothing.
// -----------------------------------------------------------------------
export function NewsletterForm({ className, inputClassName }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setStatus("error");
      return;
    }

    if (!isSupabaseConfigured) {
      // Be honest rather than pretending this worked: there's nowhere for
      // the address to go yet.
      setStatus("unconfigured");
      return;
    }

    setStatus("loading");
    const result = await subscribeEmail(trimmed);
    if (result.ok) {
      setStatus("success");
      setEmail("");
    } else if (result.reason === "duplicate") {
      setStatus("duplicate");
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className={`text-sm text-black font-medium ${className ?? ""}`}>
        You're on the list — thank you for subscribing!
      </p>
    );
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle" && status !== "loading") setStatus("idle");
          }}
          placeholder="Enter your email"
          className={
            inputClassName ??
            "flex-1 bg-ivory border border-plum-200 rounded px-4 py-3 text-sm text-chocolate placeholder:text-black focus:outline-none focus:border-plum"
          }
        />
        <Button type="submit" variant="primary" disabled={status === "loading"}>
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>
      {status === "duplicate" && (
        <p className="text-xs text-black mt-2 font-sans">This email is already subscribed — thank you!</p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-500 mt-2 font-sans">
          Enter a valid email address, or try again in a moment if you did.
        </p>
      )}
      {status === "unconfigured" && (
        <p className="text-xs text-black mt-2 font-sans">
          Newsletter signup isn't connected yet in this environment.
        </p>
      )}
    </div>
  );
}
