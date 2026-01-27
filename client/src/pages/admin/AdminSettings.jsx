import React, { useState } from 'react';
import { Save, Store, CreditCard, Truck, Bell } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your store settings</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-lg border p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                  <CardDescription>Basic information about your store</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input label="Store Name" defaultValue="Aradhya Gems" />
                  <Input label="Store Email" type="email" defaultValue="contact@aradhyagems.com" />
                  <Input label="Support Phone" defaultValue="+1 (555) 123-4567" />
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">
                      Store Description
                    </label>
                    <textarea
                      className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      rows={4}
                      defaultValue="Exquisite jewellery for those who appreciate timeless elegance."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Address</CardTitle>
                  <CardDescription>Your store's physical location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input label="Street Address" defaultValue="123 Luxury Lane" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" defaultValue="New York" />
                    <Input label="State/Province" defaultValue="NY" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Postal Code" defaultValue="10001" />
                    <Input label="Country" defaultValue="United States" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Gateway</CardTitle>
                  <CardDescription>Configure your payment processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-700">Stripe Connected</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">Your Stripe account is active and ready to accept payments.</p>
                  </div>
                  <Input label="Stripe Publishable Key" defaultValue="pk_test_••••••••••••••••" type="password" />
                  <Input label="Stripe Secret Key" defaultValue="sk_test_••••••••••••••••" type="password" />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="testMode" defaultChecked className="rounded text-primary" />
                    <label htmlFor="testMode" className="text-sm text-gray-600">Enable test mode</label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Currency Settings</CardTitle>
                  <CardDescription>Configure store currency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">
                      Default Currency
                    </label>
                    <select className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Options</CardTitle>
                  <CardDescription>Configure shipping methods and rates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Free Shipping</p>
                      <p className="text-sm text-gray-500">All orders qualify for free shipping</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-primary h-5 w-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Express Shipping</p>
                      <p className="text-sm text-gray-500">1-2 business days - $25.00</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-primary h-5 w-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">International Shipping</p>
                      <p className="text-sm text-gray-500">7-14 business days - $50.00</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-primary h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Configure email notifications for orders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">New Order Notification</p>
                      <p className="text-sm text-gray-500">Receive email when a new order is placed</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-primary h-5 w-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Low Stock Alert</p>
                      <p className="text-sm text-gray-500">Receive email when stock is below threshold</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-primary h-5 w-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Customer Reviews</p>
                      <p className="text-sm text-gray-500">Receive email for new product reviews</p>
                    </div>
                    <input type="checkbox" className="rounded text-primary h-5 w-5" />
                  </div>
                  <Input label="Admin Email" type="email" defaultValue="admin@aradhyagems.com" />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
