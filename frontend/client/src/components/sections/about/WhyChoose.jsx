import { Award, Globe, Package, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function WhyChoose() {
  return (
    <div className="py-28 px-6 bg-[var(--bg-muted)] mb-[-60px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sm font-bold text-[var(--color-secondary)] uppercase tracking-widest mb-4 block">What Sets Us Apart</span>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-[var(--color-primary)]">
              Why Choose Us
            </h2>
            <p className="text-[var(--text-secondary)] text-xl max-w-3xl mx-auto leading-relaxed">
              We go beyond being just a marketplace—we're your partner in success with unmatched features and support
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Advanced Security', desc: 'Bank-level encryption and fraud protection systems keep every transaction safe and secure.', features: ['SSL encryption for all transactions', 'Real-time fraud detection', 'Secure payment gateway'] },
              { icon: Users, title: '24/7 Support', desc: 'Our dedicated support team is always available to help you succeed and resolve any issues.', features: ['Live chat support', 'Dedicated account managers', 'Multi-language assistance'] },
              { icon: Globe, title: 'Global Reach', desc: 'Connect with customers and vendors from over 50 countries worldwide.', features: ['International shipping options', 'Multi-currency support', 'Localized marketplace'] },
              { icon: Package, title: 'Easy Management', desc: 'Intuitive dashboard and tools make selling and buying effortless for everyone.', features: ['Simple product listing', 'Inventory management', 'Analytics & insights'] },
              { icon: TrendingUp, title: 'Growth Tools', desc: 'Powerful marketing and analytics tools to help vendors scale their business.', features: ['SEO optimization tools', 'Promotional campaigns', 'Performance reports'] },
              { icon: Award, title: 'Quality Control', desc: 'Rigorous quality checks ensure only the best products and vendors on our platform.', features: ['Vendor verification process', 'Product quality reviews', 'Customer feedback system'] }
            ].map((item, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative p-10 rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--border)] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-[var(--text-primary)]">{item.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg mb-6">
                    {item.desc}
                  </p>
                  <ul className="space-y-3 text-[var(--text-secondary)]">
                    {item.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}