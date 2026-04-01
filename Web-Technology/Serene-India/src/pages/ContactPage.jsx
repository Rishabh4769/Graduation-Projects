import { useState } from 'react';

const initialForm = { name: '', email: '', message: '' };

function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = true;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = true;
    }

    if (!form.message.trim()) {
      nextErrors.message = true;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setForm(initialForm);
    }
  };

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero__content">
          <p className="page-hero__eyebrow">Contact</p>
          <h1 className="page-hero__title">Start the conversation</h1>
          <p className="page-hero__text">
            Ask about destinations, future features, or the product direction. The form is now part of the same visual
            system as the rest of the app.
          </p>
        </div>
      </section>

      <div className="main-frame contact">
        <div className="contact-layout">
          <section className="contact-header contact-panel">
            <h2>Get in Touch</h2>
            <p>
              Whether you&apos;re planning a trip or reviewing the project, this form now runs through React state and
              validation.
            </p>
            <div className="contact-info-block">
              <h3>Contact Details</h3>
              <p><strong>Address</strong><br />Serene Indian Journeys, Gujarat, India</p>
              <p><strong>Phone</strong><br />+91 98765 43210</p>
              <p><strong>Email</strong><br />support@sereneindia.com</p>
            </div>
          </section>

          <section>
            {submitted ? (
              <div className="contact-form contact-success">
                <h3>Message Sent</h3>
                <p>Thank you. Your message was sent.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  className={errors.name ? 'invalid' : ''}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  className={errors.email ? 'invalid' : ''}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
                <textarea
                  placeholder="Your Message"
                  rows="5"
                  value={form.message}
                  className={errors.message ? 'invalid' : ''}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                />
                <button type="submit">Send Message</button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default ContactPage;
