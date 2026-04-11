import { useState } from "react";
import { api } from "../api/api";

const INFO_ITEMS = [
  { emoji: "🐛", title: "Bug Reports", desc: "Found something broken? Let us know and we'll fix it fast." },
  { emoji: "💡", title: "Suggestions", desc: "Have an idea to improve Chef's Atlas? We'd love to hear it." },
  { emoji: "🙋", title: "General Help", desc: "Need assistance with your account or a recipe? We're here." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.contact(form);
      setSuccess("Your message has been sent.");
      setForm({ name: "", email: "", message: "" });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 56, display: "grid", gap: 14 }}>
        <span style={{ display: "inline-block", fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--brand)", background: "var(--brand-glow)", padding: "5px 14px", borderRadius: "var(--r-pill)", width: "fit-content", border: "1px solid rgba(184,78,32,0.15)" }}>
          Contact Admin
        </span>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text)", margin: 0 }}>
          We're Here to <span style={{ background: "linear-gradient(135deg, var(--brand-deep), var(--brand), var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Help You</span>
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--muted)", fontWeight: 300, lineHeight: 1.65, margin: 0, maxWidth: 520 }}>
          Report issues, share ideas, or just say hello — we read every message and get back to you promptly.
        </p>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 32, alignItems: "start" }}>

        {/* ── Left: Info cards ── */}
        <div style={{ display: "grid", gap: 16 }}>
          {INFO_ITEMS.map((item) => (
            <div key={item.title} style={{ background: "var(--surface-strong)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "24px 22px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "0 16px", alignItems: "start", boxShadow: "var(--shadow-xs)", transition: "box-shadow 0.2s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-xs)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: "1.8rem", lineHeight: 1, gridRow: "1 / 3" }}>{item.emoji}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>{item.title}</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--muted)", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}

          {/* Decorative quote card */}
          <div style={{ position: "relative", borderRadius: "var(--r-lg)", overflow: "hidden", minHeight: 140, marginTop: 4 }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, var(--brand-deep), var(--brand) 60%, var(--gold))" }} />
            <div style={{ position: "relative", padding: "28px 24px", display: "grid", gap: 10 }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "white", margin: 0, lineHeight: 1.4 }}>
                "Every great dish starts with a conversation."
              </p>
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", fontWeight: 300 }}>— The Chef's Atlas Team</span>
            </div>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div style={{ background: "var(--surface-strong)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "40px 36px", boxShadow: "var(--shadow-md)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "var(--text)", margin: "0 0 28px", letterSpacing: "-0.02em" }}>
            Send a Message
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>

            {/* Name */}
            <div style={{ display: "grid", gap: 7 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Your Name</label>
              <input
                placeholder="e.g. Alex Johnson"
                value={form.name}
                onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                required
                style={{ padding: "13px 16px", borderRadius: "var(--r-md)", border: "1.5px solid var(--border-strong)", background: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text)", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
                onFocus={e => { e.target.style.borderColor = "var(--brand)"; e.target.style.boxShadow = "0 0 0 3px var(--brand-glow)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border-strong)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Email */}
            <div style={{ display: "grid", gap: 7 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
                required
                style={{ padding: "13px 16px", borderRadius: "var(--r-md)", border: "1.5px solid var(--border-strong)", background: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text)", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
                onFocus={e => { e.target.style.borderColor = "var(--brand)"; e.target.style.boxShadow = "0 0 0 3px var(--brand-glow)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border-strong)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Message */}
            <div style={{ display: "grid", gap: 7 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Message</label>
              <textarea
                placeholder="Tell the admin what went wrong, or share your thoughts..."
                rows={7}
                value={form.message}
                onChange={(e) => setForm((c) => ({ ...c, message: e.target.value }))}
                required
                style={{ padding: "13px 16px", borderRadius: "var(--r-md)", border: "1.5px solid var(--border-strong)", background: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text)", outline: "none", resize: "vertical", lineHeight: 1.65, transition: "border-color 0.2s, box-shadow 0.2s" }}
                onFocus={e => { e.target.style.borderColor = "var(--brand)"; e.target.style.boxShadow = "0 0 0 3px var(--brand-glow)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border-strong)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: "var(--r-md)", background: "rgba(184,78,32,0.08)", border: "1px solid rgba(184,78,32,0.2)", color: "var(--brand-deep)", fontSize: "0.9rem", fontWeight: 500 }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: "var(--r-md)", background: "rgba(31,82,64,0.08)", border: "1px solid rgba(31,82,64,0.2)", color: "var(--accent)", fontSize: "0.9rem", fontWeight: 500 }}>
                <span>✅</span> {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 28px", borderRadius: "var(--r-pill)", background: loading ? "rgba(184,78,32,0.5)" : "linear-gradient(145deg, #c85e30 0%, #9a3d18 55%, #7a3010 100%)", color: "white", fontWeight: 600, fontSize: "0.95rem", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-body)", boxShadow: loading ? "none" : "0 1px 0 rgba(255,255,255,0.18) inset, 0 12px 28px rgba(122,48,16,0.28)", transition: "transform 0.2s, box-shadow 0.2s", marginTop: 4 }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 1px 0 rgba(255,255,255,0.18) inset, 0 20px 40px rgba(122,48,16,0.36)"; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 0 rgba(255,255,255,0.18) inset, 0 12px 28px rgba(122,48,16,0.28)"; }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Sending…
                </>
              ) : (
                <>Send Message ✉️</>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}