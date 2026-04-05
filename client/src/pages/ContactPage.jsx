import { useState } from "react";
import { api } from "../api/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.contact(form);
      setSuccess("Your message has been sent.");
      setForm({ name: "", email: "", message: "" });
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <div className="simple-page">
      <p className="eyebrow">Contact Admin</p>
      <h1>Report issues or ask for help.</h1>
      <form className="stack-form recipe-form" onSubmit={handleSubmit}>
        <input
          placeholder="Your name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
        <input
          type="email"
          placeholder="Your email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
        <textarea
          placeholder="Tell the admin what went wrong"
          rows="7"
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          required
        />
        {error && <p className="form-error">{error}</p>}
        {success && <p className="feedback feedback--success">{success}</p>}
        <button className="button" type="submit">
          Send Message
        </button>
      </form>
    </div>
  );
}
