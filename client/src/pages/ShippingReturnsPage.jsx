import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Package, 
  RefreshCw, 
  Clock, 
  Shield, 
  MapPin,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export default function ShippingReturnsPage() {
  const shippingInfo = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Complimentary insured shipping on all orders above ₹25,000'
    },
    {
      icon: Clock,
      title: 'Delivery Time',
      description: '3-7 business days for domestic orders, 7-14 days for international'
    },
    {
      icon: Shield,
      title: 'Insured Delivery',
      description: 'All shipments are fully insured against loss or damage'
    },
    {
      icon: MapPin,
      title: 'Pan India Delivery',
      description: 'We deliver to all major cities and towns across India'
    }
  ];

  const returnSteps = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Contact us within 7 days of delivery to initiate a return request'
    },
    {
      step: 2,
      title: 'Quality Check',
      description: 'Our team will arrange pickup and inspect the item'
    },
    {
      step: 3,
      title: 'Refund Processing',
      description: 'Refund will be processed within 5-7 business days after inspection'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Shipping & Returns
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            We're committed to delivering your precious jewelry safely and ensuring your complete satisfaction
          </p>
        </div>
      </section>

      {/* Shipping Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-secondary text-center mb-12">
            Shipping Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingInfo.map((item, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-secondary mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-secondary mb-8">
              Shipping Policy
            </h2>
            
            <div className="space-y-8">
              {/* Domestic Shipping */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Domestic Shipping (India)
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>Free shipping</strong> on orders above ₹25,000
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Flat ₹500 shipping charge for orders below ₹25,000
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Estimated delivery: <strong>3-7 business days</strong> (metros: 3-5 days)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      All orders are shipped via trusted courier partners with tracking
                    </span>
                  </li>
                </ul>
              </div>

              {/* International Shipping */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  International Shipping
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      We ship to USA, UK, UAE, Singapore, Australia, and Canada
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Shipping charges calculated at checkout based on destination
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Estimated delivery: <strong>7-14 business days</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Import duties and taxes may apply based on your country's regulations
                    </span>
                  </li>
                </ul>
              </div>

              {/* Packaging */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Premium Packaging & Insurance
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Every piece comes in our signature luxury gift box
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Tamper-proof packaging with security seals
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      100% insured shipments - full coverage against loss or damage
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Certificate of authenticity and invoice included
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Returns Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-secondary mb-4 text-center">
              Returns & Exchange Policy
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Your satisfaction is our priority. We offer hassle-free returns and exchanges on all eligible items.
            </p>

            {/* Return Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {returnSteps.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-secondary mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {index < returnSteps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 text-gray-300" />
                  )}
                </div>
              ))}
            </div>

            {/* Return Policy Details */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                Return Policy Details
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Eligible */}
                <div>
                  <h4 className="font-medium text-secondary mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Eligible for Returns
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Unused items in original condition</li>
                    <li>• Items with all original tags and packaging</li>
                    <li>• Items returned within 7 days of delivery</li>
                    <li>• Defective or damaged items (report within 48 hours)</li>
                    <li>• Wrong item received</li>
                  </ul>
                </div>

                {/* Not Eligible */}
                <div>
                  <h4 className="font-medium text-secondary mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    Not Eligible for Returns
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Customized or personalized jewelry</li>
                    <li>• Items with signs of wear or damage by customer</li>
                    <li>• Items without original packaging or certificates</li>
                    <li>• Items returned after 7 days</li>
                    <li>• Sale or discounted items (final sale)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h4 className="font-medium text-secondary mb-3">Lifetime Exchange Policy</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  We offer lifetime exchange on all gold jewelry at current gold rates. Diamonds and gemstones 
                  can be exchanged at 80% of the original purchase value. Exchange is subject to product 
                  inspection and authenticity verification.
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-secondary">
                    <strong>Note:</strong> For exchanges, please visit our store with the original invoice 
                    and certificate. Making charges will apply on the new piece.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-secondary mb-8 text-center">
              Refund Information
            </h2>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-secondary mb-4">Refund Timeline</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-primary mt-0.5" />
                      <span>Refund initiated within 2 business days of inspection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-primary mt-0.5" />
                      <span>Bank/Card refund: 5-7 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-primary mt-0.5" />
                      <span>UPI/Wallet refund: 2-3 business days</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary mb-4">Refund Method</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Refund to original payment method</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Store credit option available (instant)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Full refund including shipping (if applicable)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold mb-4">
            Need Help with Your Order?
          </h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Our customer support team is here to assist you with shipping inquiries, 
            return requests, or any other questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-secondary px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/919924944309"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
