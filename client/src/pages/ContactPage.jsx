import { useMemo, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const contactIdentity = useMemo(
    () => ({
      name: user?.name || form.name,
      email: user?.email || form.email,
    }),
    [user, form]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!user) {
      onRequireAuth?.();
      return;
    }

    setLoading(true);

    try {
      await api.contact({ ...contactIdentity, message: form.message });
      showToast("Your message has been sent.");
      setForm({ name: "", email: "", message: "" });
    } catch (submitError) {
      setError(submitError.message);
      showToast(submitError.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 56 }}>
        <h1>Contact Admin</h1>
        <p>Report issues, share ideas, or ask for help.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 32 }}>

        {/* Left Info */}
        <div style={{ display: "grid", gap: 16 }}>
          {INFO_ITEMS.map((item) => (
            <div key={item.title} style={{ padding: 20, border: "1px solid #ddd", borderRadius: 12 }}>
              <div style={{ fontSize: "1.5rem" }}>{item.emoji}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>

          {!user && (
            <>
              <input
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
                required
              />
            </>
          )}

          <textarea
            placeholder="Your message..."
            rows={6}
            value={form.message}
            onChange={(e) => setForm((c) => ({ ...c, message: e.target.value }))}
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          {user ? (
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          ) : (
            <button type="button" onClick={onRequireAuth}>
              Log in to send message
            </button>
          )}
        </form>
      </div>
    </div>
  );
}