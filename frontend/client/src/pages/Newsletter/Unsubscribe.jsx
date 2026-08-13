import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle2, Loader2, MailX } from "lucide-react";
import {
  getNewsletterStatus,
  unsubscribeNewsletter,
} from "../../api/newsletterApi";

export default function NewsletterUnsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [email, setEmail] = useState("");
  const [statusEmail, setStatusEmail] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(Boolean(token));
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setLoadingStatus(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        const data = await getNewsletterStatus(token);
        if (cancelled) return;
        setStatusEmail(data.email || "");
        if (!data.isActive) {
          setDone(true);
          setMessage("You’re already unsubscribed.");
        }
      } catch {
        if (!cancelled) {
          toast.error("This unsubscribe link is invalid or expired.");
        }
      } finally {
        if (!cancelled) setLoadingStatus(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleUnsubscribe = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const data = await unsubscribeNewsletter(
        token ? { token } : { email: email.trim() }
      );
      setDone(true);
      setMessage(data.message);
      setStatusEmail(data.email || email.trim());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to unsubscribe");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[70vh] bg-[var(--bg-main)] px-4 py-16 text-[var(--text-primary)]">
      <div className="mx-auto max-w-lg overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-card)] p-8 shadow-[0_24px_60px_-40px_var(--shadow)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
          Newsletter
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Unsubscribe</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          You can stop receiving ShopZo product, price-drop, and discount alerts anytime.
        </p>

        {loadingStatus ? (
          <div className="mt-8 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Loader2 className="animate-spin" size={16} />
            Checking subscription…
          </div>
        ) : done ? (
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-800">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
              <div>
                <p className="font-semibold">{message || "You’ve been unsubscribed."}</p>
                {statusEmail && (
                  <p className="mt-1 text-sm opacity-80">{statusEmail}</p>
                )}
                <Link
                  to="/"
                  className="mt-3 inline-block text-sm font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Back to ShopZo
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUnsubscribe} className="mt-8 space-y-4">
            {token ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                  Subscribed email
                </p>
                <p className="mt-1 font-semibold">{statusEmail || "Linked subscription"}</p>
              </div>
            ) : (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Email address</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 text-sm outline-none transition focus:border-[var(--color-primary)]"
                />
              </label>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <MailX size={16} />}
              {submitting ? "Unsubscribing…" : "Unsubscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
