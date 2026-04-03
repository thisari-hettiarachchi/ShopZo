import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function ContactSection({
  branches,
  selectedBranch,
  email,
  formData,
  onBranchChange,
  onFormChange,
  onSubmit,
}) {
  return (
    <section className="py-16 px-4 md:px-16">
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold logo-text mb-8">Select a Branch</h2>

          <select
            value={selectedBranch.id}
            onChange={onBranchChange}
            className="search-input w-full px-4 py-3 rounded-lg border-2 border-[var(--border)] focus:border-[var(--color-primary)] transition-all outline-none font-medium shadow-sm"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} {branch.main ? "(Main Branch)" : ""}
              </option>
            ))}
          </select>

          <div className="mt-8 space-y-5 bg-[var(--bg-card)] p-8 rounded-2xl shadow-lg border-2 border-[var(--border)]">
            <div className="flex items-center gap-4 group hover:translate-x-1 transition-transform">
              <div className="p-3 bg-[var(--bg-muted)] rounded-full group-hover:bg-[var(--bg-hover)] transition-colors">
                <MapPin className="icon-primary" size={24} />
              </div>
              <span className="text-[var(--text-primary)] font-medium">{selectedBranch.address}</span>
            </div>
            <div className="flex items-center gap-4 group hover:translate-x-1 transition-transform">
              <div className="p-3 bg-[var(--bg-muted)] rounded-full group-hover:bg-[var(--bg-hover)] transition-colors">
                <Phone className="icon-primary" size={24} />
              </div>
              <span className="text-[var(--text-primary)] font-medium">{selectedBranch.phone}</span>
            </div>
            <div className="flex items-center gap-4 group hover:translate-x-1 transition-transform">
              <div className="p-3 bg-[var(--bg-muted)] rounded-full group-hover:bg-[var(--bg-hover)] transition-colors">
                <Clock className="icon-primary" size={24} />
              </div>
              <span className="text-[var(--text-primary)] font-medium">{selectedBranch.openingHours}</span>
            </div>
            <div className="flex items-center gap-4 group hover:translate-x-1 transition-transform">
              <div className="p-3 bg-[var(--bg-muted)] rounded-full group-hover:bg-[var(--bg-hover)] transition-colors">
                <Mail className="icon-primary" size={24} />
              </div>
              <span className="text-[var(--text-primary)] font-medium">{email}</span>
            </div>

            <div className="w-full h-64 mt-6 rounded-xl overflow-hidden shadow-md border-2 border-[var(--border)]">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=6.9271,79.8612&hl=en&z=15&output=embed"
                title="Main Branch Location"
              />
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] p-8 rounded-2xl shadow-xl border-2 border-[var(--border)] flex flex-col gap-6">
          <h3 className="text-2xl font-bold logo-text mb-2">Send us a Message</h3>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onFormChange}
              placeholder="Your Name"
              className="search-input px-4 py-3 rounded-lg border-2 border-[var(--border)] focus:border-[var(--color-primary)] transition-all outline-none shadow-sm"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onFormChange}
              placeholder="Your Email"
              className="search-input px-4 py-3 rounded-lg border-2 border-[var(--border)] focus:border-[var(--color-primary)] transition-all outline-none shadow-sm"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Subject</span>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={onFormChange}
              placeholder="Subject"
              className="search-input px-4 py-3 rounded-lg border-2 border-[var(--border)] focus:border-[var(--color-primary)] transition-all outline-none shadow-sm"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Message</span>
            <textarea
              name="message"
              value={formData.message}
              onChange={onFormChange}
              placeholder="Your Message"
              className="search-input px-4 py-3 rounded-lg border-2 border-[var(--border)] focus:border-[var(--color-primary)] transition-all outline-none h-32 resize-none shadow-sm"
              required
            />
          </label>

          <button
            onClick={onSubmit}
            className="search-btn mt-2 py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:opacity-90 transform hover:-translate-y-0.5 transition-all"
          >
            Send Message
          </button>
        </div>
      </div>
    </section>
  );
}
