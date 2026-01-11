import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";
import Assets from "../assets/assets";

export default function Contact() {
  const branches = [
    {
      id: 1,
      name: "Colombo Branch",
      address: "123 ShopZo Street, Colombo, Sri Lanka",
      phone: "+94 77 123 4567",
      openingHours: "Mon-Sat: 9:00 AM - 8:00 PM",
      lat: 6.9271,
      lng: 79.8612,
      main: true,
    },
    {
      id: 2,
      name: "Kandy Branch",
      address: "456 Market Road, Kandy, Sri Lanka",
      phone: "+94 81 234 5678",
      openingHours: "Mon-Fri: 9:00 AM - 6:00 PM",
      lat: 7.2906,
      lng: 80.6337,
      main: false,
    },
    {
      id: 3,
      name: "Galle Branch",
      address: "789 Ocean Ave, Galle, Sri Lanka",
      phone: "+94 91 345 6789",
      openingHours: "Mon-Fri: 10:00 AM - 5:00 PM",
      lat: 6.0535,
      lng: 80.2210,
      main: false,
    },
  ];

  const email = "support@shopzo.com";
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [faqOpen, setFaqOpen] = useState(null);

  const handleBranchChange = (e) => {
    const branch = branches.find((b) => b.id === parseInt(e.target.value));
    setSelectedBranch(branch);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message sent to branch:", selectedBranch.name, formData);
    alert(`Message sent to ${selectedBranch.name}!`);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const faqs = [
    {
      question: "How can I place an order?",
      answer:
        "You can place an order online through our website by selecting the products you want and completing the checkout process. Alternatively, you may visit any of our branches in person. Each branch has knowledgeable staff who can guide you through product selections, answer your questions, and ensure you have a smooth purchasing experience. We also provide detailed product descriptions and reviews online to help you make an informed choice. Our goal is to make ordering as convenient and transparent as possible.",
    },
    {
      question: "Do you offer home delivery?",
      answer:
        "Yes, we offer home delivery for selected areas. Delivery charges may apply depending on the distance and size of the order. Our delivery service ensures your products arrive safely and on time. You will receive a tracking number once your order is dispatched, so you can monitor its progress. For urgent deliveries or special requirements, please contact our support team who will assist you in arranging a suitable delivery time. We strive to provide a seamless delivery experience for all our customers.",
    },
    {
      question: "What are your payment options?",
      answer:
        "We accept multiple forms of payment to make your purchase convenient. You can pay using cash at our physical branches, credit or debit cards online or in-store, and through online payment gateways directly on our website. We ensure all online transactions are secure and encrypted to protect your financial information. Additionally, for larger purchases, we may offer installment options or special promotions. Please check the payment section during checkout or inquire with our staff for detailed payment information.",
    },
    {
      question: "Can I return a product?",
      answer:
        "Yes, we accept returns within 7 days of purchase with a valid receipt. Products must be in their original condition, unused, and with all packaging intact. Our return policy is designed to ensure customer satisfaction, and our staff will assist you through the process to make it simple and hassle-free. Refunds or exchanges will be processed promptly according to your chosen method of payment. Certain promotional or clearance items may have different return conditions, so please confirm with our staff or check our website for specific details.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* Hero Section */}
      {/* Hero Section */}
      <section
        className="relative w-full h-[500px] md:h-[600px] flex items-center bg-cover bg-center mt-[-70px]"
        style={{
          backgroundImage: `url(${Assets.Contact})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 via-orange-800/80 to-amber-700/90"></div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 w-full">
          <div className="max-w-3xl space-y-6 text-white animate-fade-in">
            <div className="inline-block px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-300/30 mb-4">
              <span className="text-amber-200 font-semibold text-sm">Let's Connect</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-2xl leading-tight">
              Reach Out to <span className="text-amber-300 inline-block hover:scale-105 transition-transform">ShopZo</span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-amber-300 to-orange-400 rounded-full"></div>
            
            <p className="text-xl md:text-2xl text-amber-50 leading-relaxed drop-shadow-lg font-light">
              We're here to help you find the perfect product. Choose a branch
              or send us a message directly. Your satisfaction is our priority!
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <MapPin className="text-amber-300" size={20} />
                <span className="text-amber-100 font-medium">3 Branches Island-wide</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <Phone className="text-amber-300" size={20} />
                <span className="text-amber-100 font-medium">24/7 Support Available</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Branch Info */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold logo-text mb-8">Select a Branch</h2>

            <select
              value={selectedBranch.id}
              onChange={handleBranchChange}
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

              {/* Map */}
              <div className="w-full h-64 mt-6 rounded-xl overflow-hidden shadow-md border-2 border-[var(--border)]">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=6.9271,79.8612&hl=en&z=15&output=embed`}
                  title="Main Branch Location"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[var(--bg-card)] p-8 rounded-2xl shadow-xl border-2 border-[var(--border)] flex flex-col gap-6">
            <h3 className="text-2xl font-bold logo-text mb-2">Send us a Message</h3>
            
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[var(--text-secondary)]">Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Your Message"
                className="search-input px-4 py-3 rounded-lg border-2 border-[var(--border)] focus:border-[var(--color-primary)] transition-all outline-none h-32 resize-none shadow-sm"
                required
              />
            </label>

            <button
              onClick={handleSubmit}
              className="search-btn mt-2 py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:opacity-90 transform hover:-translate-y-0.5 transition-all"
            >
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
                  onClick={() =>
                    setFaqOpen(faqOpen === index ? null : index)
                  }
                  className="flex justify-between items-center w-full px-6 py-4 hover:bg-[var(--bg-muted)] transition-colors"
                >
                  <span className="font-semibold text-[var(--text-primary)] text-left">{faq.question}</span>
                  <div className="p-1 rounded-full bg-[var(--bg-muted)]">
                    {faqOpen === index ? 
                      <ChevronUp className="icon-primary" size={20} /> : 
                      <ChevronDown className="icon-primary" size={20} />
                    }
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
    </div>
  );
}