// src/pages/Contact.jsx
import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";
import Assets from "../assets/assets"; // optional hero image

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

  const email = "support@shopzo.com"; // Same email for all branches
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
      
        <section
        className="relative bg-[var(--bg-card)] shadow-md h-[500px] md:h-[600px] flex items-center"
        style={{
            backgroundImage: `url(${Assets.contactHero || Assets.hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 py-16 px-6 md:px-16 bg-black/30 rounded-xl">
            {/* Text */}
            <div className="flex-1 space-y-6 text-white">
            <h1 className="text-5xl font-bold logo-text">
                Reach Out to ShopZo
            </h1>
            <p className="text-lg">
                We’re here to help you find the perfect product. Choose a branch
                or send us a message directly. Your satisfaction is our priority!
            </p>
            <p>
                Explore our branches across Sri Lanka or contact us online.
            </p>
            </div>
        </div>
        </section>


      {/* Contact Section */}
      <section className="py-16 px-4 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Branch Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Select a Branch</h2>

            <select
              value={selectedBranch.id}
              onChange={handleBranchChange}
              className="search-input w-full px-3 py-2 rounded-md border-2 border-[var(--border)] focus:border-[var(--color-primary)]"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} {branch.main ? "(Main Branch)" : ""}
                </option>
              ))}
            </select>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <MapPin className="icon-primary" />
                <span>{selectedBranch.address}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="icon-primary" />
                <span>{selectedBranch.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="icon-primary" />
                <span>{selectedBranch.openingHours}</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="icon-primary" />
                <span>{email}</span>
              </div>

              {/* Map – Always show Main Branch */}
              <div className="w-full h-64 mt-4 rounded-md overflow-hidden shadow-md">
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
          <form
            className="bg-[var(--bg-card)] p-6 rounded-xl shadow-md flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <label className="flex flex-col">
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="search-input mt-2 px-3 py-2 rounded-md border-2 border-[var(--border)] focus:border-[var(--color-primary)]"
                required
              />
            </label>

            <label className="flex flex-col">
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="search-input mt-2 px-3 py-2 rounded-md border-2 border-[var(--border)] focus:border-[var(--color-primary)]"
                required
              />
            </label>

            <label className="flex flex-col">
              Subject
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="search-input mt-2 px-3 py-2 rounded-md border-2 border-[var(--border)] focus:border-[var(--color-primary)]"
                required
              />
            </label>

            <label className="flex flex-col">
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="search-input mt-2 px-3 py-2 rounded-md border-2 border-[var(--border)] focus:border-[var(--color-primary)] h-32 resize-none"
                required
              />
            </label>

            <button
              type="submit"
              className="search-btn mt-4 py-2 rounded-md text-white font-semibold hover:opacity-90"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-16 bg-[var(--bg-card)] shadow-inner">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center logo-text">
            Frequently Asked Questions
          </h2>

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-[var(--border)] rounded-md overflow-hidden"
            >
              <button
                onClick={() =>
                  setFaqOpen(faqOpen === index ? null : index)
                }
                className="flex justify-between items-center w-full px-4 py-3 bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] transition-colors"
              >
                <span className="font-semibold">{faq.question}</span>
                {faqOpen === index ? <ChevronUp /> : <ChevronDown />}
              </button>
              {faqOpen === index && (
                <div className="px-4 py-3 text-[var(--text-secondary)] bg-[var(--bg-main)]">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
