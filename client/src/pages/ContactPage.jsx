import { useState } from "react";
import { api } from "../api/api";
import { useToast } from "../components/useToast";

const INFO_ITEMS = [
  { emoji: "🐛", title: "Bug Reports", desc: "Found something broken? Let us know and we'll fix it fast." },
  { emoji: "💡", title: "Suggestions", desc: "Have an idea to improve Chef's Atlas? We'd love to hear it." },
  { emoji: "🙋", title: "General Help", desc: "Need assistance with your account or a recipe? We're here." },
];

export default function ContactPage({ user, onRequireAuth }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      onRequireAuth?.();
      return;
    }

    setLoading(true);

    try {
      await api.contact({
        name: form.name || user.name,
        email: form.email || user.email,
        message: form.message,
      });

      setSuccess("Your message has been sent successfully.");
      showToast("Message sent!");
      setForm({ name: "", email: "", message: "" });
    } catch (submitError) {
      setError(submitError.message);
      showToast(submitError.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="simple-page" style={{ gap: 40, maxWidth: 1100, margin: "0 auto" }}>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div style={{ display: "grid", gap: 10 }}>
        <p className="eyebrow" style={{ margin: 0 }}>Get in Touch</p>
        <h1 style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 4vw, 3.2rem)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
        }}>
          We're Here to{" "}
          <em style={{
            fontStyle: "italic",
            background: "linear-gradient(135deg, var(--brand-deep), var(--brand))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Help You
          </em>
        </h1>
        <p className="section-copy" style={{ margin: 0, maxWidth: 480 }}>
          Report issues, share ideas, or just say hello — we read everything.
        </p>
      </div>

      {/* ── Two-column layout ───────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.5fr",
        gap: 24,
        alignItems: "start",
      }}
        className="contact-grid"
      >

        {/* ── Left: info cards ──────────────────────────────────────── */}
        <div style={{ display: "grid", gap: 14 }}>
          {INFO_ITEMS.map((item) => (
            <div
              key={item.title}
              className="info-card"
              style={{ padding: "22px 24px", display: "grid", gap: 8 }}
            >
              <div style={{ fontSize: "1.8rem", lineHeight: 1 }}>{item.emoji}</div>
              <h3 style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "1.05rem",
                letterSpacing: "-0.01em",
              }}>
                {item.title}
              </h3>
              <p style={{ margin: 0, color: "var(--muted)", fontWeight: 300, lineHeight: 1.6, fontSize: "0.9rem" }}>
                {item.desc}
              </p>
            </div>
          ))}

          {/* Decorative note */}
          <div style={{
            padding: "18px 22px",
            borderRadius: "var(--r-md)",
            background: "linear-gradient(135deg, rgba(184,78,32,0.07), rgba(31,82,64,0.07))",
            border: "1px solid var(--border)",
            fontSize: "0.84rem",
            color: "var(--muted)",
            fontWeight: 300,
            lineHeight: 1.65,
          }}>
            ⏱ We typically respond within <strong style={{ color: "var(--text)", fontWeight: 600 }}>24 hours</strong>.
          </div>
        </div>

        {/* ── Right: form ───────────────────────────────────────────── */}
        <div className="recipe-card" style={{ padding: "32px 30px", display: "grid", gap: 24 }}>

          {/* Form header */}
          <div style={{ display: "grid", gap: 4 }}>
            <p className="eyebrow" style={{ margin: 0 }}>Send a Message</p>
            <h2 style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "1.6rem",
              letterSpacing: "-0.02em",
            }}>
              Drop us a line
            </h2>
          </div>

          {/* The form — all state/submit logic untouched */}
          <div className="stack-form" style={{ gap: 14 }}>

            <div style={{ display: "grid", gap: 6 }}>
              <label className="field-label">Your Name</label>
              <input
                placeholder="e.g. Alex Johnson"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label className="field-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label className="field-label">Message</label>
              <textarea
                placeholder="Tell us what's on your mind..."
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                style={{ resize: "vertical" }}
              />
            </div>

            {/* Feedback messages */}
            {error && (
              <div className="feedback feedback--error" style={{ padding: "14px 18px" }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="feedback feedback--success" style={{
                padding: "14px 18px",
                background: "rgba(31,82,64,0.07)",
                border: "1px solid rgba(31,82,64,0.18)",
                borderRadius: "var(--r-md)",
              }}>
                ✅ {success}
              </div>
            )}

            {/* Submit */}
            <button
              className="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{ marginTop: 4, padding: "14px 28px", fontSize: "0.95rem" }}
            >
              {loading ? (
                <>
                  <span style={{
                    display: "inline-block",
                    width: 14, height: 14,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }} />
                  Sending…
                </>
              ) : (
                <>✉️ Send Message</>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 720px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </div>
  );
}