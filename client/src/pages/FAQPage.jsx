import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, HelpCircle, Shield, Truck, RefreshCw, CreditCard, Gem } from 'lucide-react';
import { Input } from '../components/ui/Input';

const faqCategories = [
  {
    id: 'general',
    name: 'General',
    icon: HelpCircle,
    faqs: [
      {
        question: 'What is BIS Hallmarking?',
        answer: 'BIS Hallmarking is a certification system established by the Bureau of Indian Standards to ensure the purity and authenticity of precious metals. All our gold jewelry is BIS hallmarked, which means it has been tested and certified for purity. The hallmark includes the BIS logo, purity grade (like 916 for 22K gold or 750 for 18K gold), assaying center mark, and jeweler identification mark.'
      },
      {
        question: 'Are your diamonds certified?',
        answer: 'Yes, all our diamonds are certified by internationally recognized gemological laboratories such as GIA (Gemological Institute of America), IGI (International Gemological Institute), or SGL (Solitaire Gemmological Laboratories). Each diamond comes with a certificate detailing the 4Cs - Carat, Color, Clarity, and Cut.'
      },
      {
        question: 'How do I know if a product is in stock?',
        answer: 'Product availability is shown on each product page. If an item is in stock, you can add it to your cart and proceed to checkout. For out-of-stock items, you can sign up for notifications to be alerted when they become available again.'
      },
      {
        question: 'Do you offer custom jewelry design?',
        answer: 'Yes! We offer custom jewelry design services. You can share your design ideas with our expert craftsmen, and we will create a unique piece just for you. Contact us through our website or visit our store to discuss your requirements.'
      }
    ]
  },
  {
    id: 'authenticity',
    name: 'Authenticity & Quality',
    icon: Shield,
    faqs: [
      {
        question: 'How can I verify the authenticity of my jewelry?',
        answer: 'Every piece of jewelry from Aradhya Gems comes with a Certificate of Authenticity. You can verify the BIS hallmark by checking the hallmark number on the BIS website. For diamonds, the certificate number can be verified on the respective gemological laboratory website.'
      },
      {
        question: 'What is the purity of gold used in your jewelry?',
        answer: 'We offer jewelry in 22K (91.6% pure), 18K (75% pure), and 14K (58.5% pure) gold. The purity is clearly mentioned on each product page along with the BIS hallmark certification.'
      },
      {
        question: 'Do you use conflict-free diamonds?',
        answer: 'Yes, we are committed to ethical sourcing. All our diamonds are conflict-free and comply with the Kimberley Process Certification Scheme. We work only with suppliers who adhere to strict ethical standards.'
      }
    ]
  },
  {
    id: 'shipping',
    name: 'Shipping & Delivery',
    icon: Truck,
    faqs: [
      {
        question: 'What are the shipping charges?',
        answer: 'We offer FREE insured shipping on all orders above ₹25,000. For orders below ₹25,000, a nominal shipping fee of ₹500 applies. All shipments are fully insured and require signature upon delivery.'
      },
      {
        question: 'How long does delivery take?',
        answer: 'Standard delivery takes 5-7 business days across India. Express delivery (2-3 business days) is available at an additional cost. For made-to-order or custom pieces, please allow 2-3 weeks for crafting plus shipping time.'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Currently, we ship within India only. We are working on expanding our shipping to international locations. Please contact us for special arrangements for international orders.'
      },
      {
        question: 'How is the jewelry packaged for delivery?',
        answer: 'Each piece is carefully packaged in our signature jewelry box with premium cushioning to ensure safe delivery. The outer packaging is tamper-proof and does not reveal the contents for security purposes.'
      }
    ]
  },
  {
    id: 'returns',
    name: 'Returns & Exchange',
    icon: RefreshCw,
    faqs: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day hassle-free return policy on most items. The jewelry must be in its original condition with all packaging and certificates. Custom-made or personalized items are not eligible for returns.'
      },
      {
        question: 'How does lifetime exchange work?',
        answer: 'We offer lifetime exchange on all our jewelry. You can exchange your jewelry for any other piece of equal or greater value at the prevailing gold rate. A nominal making charge may apply for the new piece.'
      },
      {
        question: 'How do I initiate a return or exchange?',
        answer: 'To initiate a return or exchange, log into your account and go to your orders section. Select the order you wish to return or exchange and follow the prompts. Our team will arrange for pickup from your location.'
      },
      {
        question: 'When will I receive my refund?',
        answer: 'Once we receive and verify the returned item, refunds are processed within 7-10 business days. The amount will be credited to your original payment method.'
      }
    ]
  },
  {
    id: 'payment',
    name: 'Payment & Security',
    icon: CreditCard,
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards (Visa, MasterCard, Amex, RuPay), net banking, UPI (Google Pay, PhonePe, Paytm), and digital wallets. We also offer EMI options on select banks.'
      },
      {
        question: 'Is it safe to pay online?',
        answer: 'Yes, absolutely. Our website uses 256-bit SSL encryption to protect your payment information. We are PCI-DSS compliant and partner with trusted payment gateways like Razorpay for secure transactions.'
      },
      {
        question: 'Do you offer EMI options?',
        answer: 'Yes, we offer no-cost EMI on orders above ₹10,000 for select bank cards. You can choose from 3, 6, 9, or 12-month EMI plans at checkout. Terms and conditions apply.'
      },
      {
        question: 'Can I pay Cash on Delivery?',
        answer: 'Cash on Delivery is available for orders up to ₹50,000 in select pin codes. An additional COD charge of ₹100 applies. For high-value orders, we recommend prepaid payment methods.'
      }
    ]
  },
  {
    id: 'care',
    name: 'Jewelry Care',
    icon: Gem,
    faqs: [
      {
        question: 'How should I store my jewelry?',
        answer: 'Store each piece separately in a soft cloth pouch or the original box to prevent scratches. Keep jewelry away from direct sunlight, humidity, and extreme temperatures. Remove jewelry before swimming, showering, or exercising.'
      },
      {
        question: 'How do I clean my jewelry at home?',
        answer: 'For gold jewelry, use a soft brush with mild soap and lukewarm water. For diamond jewelry, soak in a solution of water and mild dish soap for 20-30 minutes, then gently brush with a soft toothbrush. Always dry thoroughly with a lint-free cloth.'
      },
      {
        question: 'Do you offer jewelry repair services?',
        answer: 'Yes, we offer professional repair and maintenance services including resizing, polishing, stone resetting, and clasp repair. Visit our store or contact us to know more about our repair services and charges.'
      }
    ]
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleQuestion = (categoryId, questionIndex) => {
    const key = `${categoryId}-${questionIndex}`;
    setOpenQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filter FAQs based on search query
  const filteredCategories = searchQuery.trim()
    ? faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(
          faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0)
    : faqCategories;

  const currentCategory = filteredCategories.find(c => c.id === activeCategory) || filteredCategories[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-secondary text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Find answers to common questions about our jewelry, shipping, returns, and more.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
              <h3 className="font-semibold text-secondary mb-4 px-2">Categories</h3>
              <nav className="space-y-1">
                {faqCategories.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;
                  const hasResults = filteredCategories.some(c => c.id === category.id);
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      disabled={!hasResults && searchQuery.trim()}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        isActive 
                          ? 'bg-primary text-white' 
                          : hasResults || !searchQuery.trim()
                            ? 'text-secondary hover:bg-gray-100'
                            : 'text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            {currentCategory ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <currentCategory.icon className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-serif font-bold text-secondary">
                    {currentCategory.name}
                  </h2>
                </div>

                {currentCategory.faqs.map((faq, index) => {
                  const key = `${currentCategory.id}-${index}`;
                  const isOpen = openQuestions[key];

                  return (
                    <div 
                      key={index}
                      className="bg-white rounded-xl shadow-md overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(currentCategory.id, index)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-secondary pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown 
                          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <div 
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="px-6 pb-4 text-muted-foreground leading-relaxed border-t border-gray-100 pt-4">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try a different search term or browse our categories
                </p>
              </div>
            )}

            {/* Still Need Help */}
            <div className="mt-12 bg-gradient-to-r from-primary to-amber-500 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-serif font-bold mb-3">
                Still have questions?
              </h3>
              <p className="text-white/90 mb-6 max-w-lg mx-auto">
                Can't find the answer you're looking for? Our support team is happy to help.
              </p>
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
