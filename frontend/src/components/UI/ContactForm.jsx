import { useState } from 'react';
import { api } from '../../api/client';

const initialForm = { name: '', email: '', message: '', company: '' };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    try {
      await api.postContact(form);
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-pulse/30 bg-pulse/10 p-4 text-sm text-ink-100">
        Message sent — thanks for reaching out. I'll reply soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Honeypot: visually hidden from real users, but present in the DOM
          for bots that auto-fill every field. */}
      <input
        type="text"
        name="company"
        value={form.company}
        onChange={update('company')}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">Name</label>
        <input
          required
          type="text"
          value={form.name}
          onChange={update('name')}
          className="w-full rounded-md border border-space-border bg-space px-3 py-2 text-sm text-ink-100 outline-none focus:border-pulse"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">Email</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={update('email')}
          className="w-full rounded-md border border-space-border bg-space px-3 py-2 text-sm text-ink-100 outline-none focus:border-pulse"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">Message</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={update('message')}
          className="w-full resize-none rounded-md border border-space-border bg-space px-3 py-2 text-sm text-ink-100 outline-none focus:border-pulse"
        />
      </div>

      {status === 'error' && <p className="text-xs text-coral">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-md bg-pulse px-4 py-2 text-sm font-medium text-space transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
