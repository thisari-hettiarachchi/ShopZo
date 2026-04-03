import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQSection({ faqs, faqOpen, setFaqOpen }) {
  return (
    <section className="py-20 px-4 md:px-16 bg-[var(--bg-muted)] shadow-inner mb-[-60px]">
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold text-center logo-text mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                className="flex justify-between items-center w-full px-6 py-4 hover:bg-[var(--bg-muted)] transition-colors"
              >
                <span className="font-semibold text-[var(--text-primary)] text-left">{faq.question}</span>
                <div className="p-1 rounded-full bg-[var(--bg-muted)]">
                  {faqOpen === index ? (
                    <ChevronUp className="icon-primary" size={20} />
                  ) : (
                    <ChevronDown className="icon-primary" size={20} />
                  )}
                </div>
              </button>
              {faqOpen === index && (
                <div className="px-6 py-4 text-[var(--text-secondary)] bg-[var(--bg-main)] border-t-2 border-[var(--border)] leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
