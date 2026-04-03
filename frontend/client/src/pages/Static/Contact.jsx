import React, { useState } from "react";
import Assets from "../../assets/assets";
import HeroSection from "../../components/sections/contact/HeroSection";
import ContactSection from "../../components/sections/contact/ContactSection";
import FAQSection from "../../components/sections/contact/FAQSection";

if (typeof document !== "undefined" && !document.getElementById("shopzo-fonts")) {
  const link = document.createElement("link");
  link.id = "shopzo-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap";
  document.head.appendChild(link);
}

const FONT_STYLE = `
  .shopzo-root { font-family: 'DM Sans', sans-serif; }
  .shopzo-root h1,
  .shopzo-root h2,
  .shopzo-root h3,
  .shopzo-root .display-font { font-family: 'Playfair Display', serif; }
  .shopzo-root .mono-font { font-family: 'Space Mono', monospace; }
`;

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
    <div className="shopzo-root min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <style>{FONT_STYLE}</style>
      <HeroSection contactImage={Assets.Contact} />
      <ContactSection
        branches={branches}
        selectedBranch={selectedBranch}
        email={email}
        formData={formData}
        onBranchChange={handleBranchChange}
        onFormChange={handleChange}
        onSubmit={handleSubmit}
      />
      <FAQSection faqs={faqs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />
    </div>
  );
}