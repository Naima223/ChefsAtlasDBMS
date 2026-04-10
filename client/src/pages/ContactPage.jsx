import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useToast } from "../components/ToastProvider";

export default function ContactPage({ user, onRequireAuth }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });
  const [error, setError] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: user?.name || "",
      email: user?.email || "",
    }));
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!user) {
      onRequireAuth?.();
      return;
    }

    try {
      await api.contact(form);
      showToast("Your message has been sent.");
      setForm({
        name: user.name || "",
        email: user.email || "",
        message: "",
      });
    } catch (submitError) {
      setError(submitError.message);
      showToast(submitError.message, "error");
    }
  }

  return (
    <div className="simple-page">
      <p className="eyebrow">Contact Admin</p>
      <h1>Report issues or ask for help.</h1>
      <form className="stack-form recipe-form" onSubmit={handleSubmit}>
        <input
          placeholder="Your name"
          readOnly
          value={form.name}
          required
        />
        <input
          type="email"
          placeholder="Your email"
          value={form.email}
          readOnly
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
        {user ? (
          <button className="button" type="submit">
            Send Message
          </button>
        ) : (
          <button className="button" onClick={onRequireAuth} type="button">
            Log In to Contact Admin
          </button>
        )}
      </form>
    </div>
  );
}
