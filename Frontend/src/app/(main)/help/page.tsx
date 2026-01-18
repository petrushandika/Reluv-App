"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Search,
  ChevronRight,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  BookOpen,
  ShoppingBag,
  Package,
  CreditCard,
  Truck,
  Shield,
  User,
  Settings,
} from "lucide-react";
import { PublicRoute } from "@/shared/components/guards/RouteGuards";
import Link from "next/link";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
}

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories: HelpCategory[] = [
    {
      id: "shopping",
      title: "Shopping",
      description: "Product information, orders, and purchases",
      icon: ShoppingBag,
    },
    {
      id: "shipping",
      title: "Shipping & Delivery",
      description: "Delivery options, tracking, and returns",
      icon: Truck,
    },
    {
      id: "payment",
      title: "Payment & Billing",
      description: "Payment methods, invoices, and refunds",
      icon: CreditCard,
    },
    {
      id: "account",
      title: "Account & Profile",
      description: "Account settings and profile management",
      icon: User,
    },
    {
      id: "security",
      title: "Security & Privacy",
      description: "Account security and privacy settings",
      icon: Shield,
    },
    {
      id: "products",
      title: "Products & Services",
      description: "Product details, authenticity, and services",
      icon: Package,
    },
  ];

  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "How do I place an order?",
      answer:
        "To place an order, simply browse our products, select the item you want, choose your preferred variant (size, color), and click 'Add to Cart' or 'Buy Now'. Follow the checkout process to complete your purchase.",
      category: "shopping",
    },
    {
      id: "2",
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit cards, debit cards, bank transfers, and digital wallets. All payments are processed securely through our encrypted payment gateway.",
      category: "payment",
    },
    {
      id: "3",
      question: "How long does shipping take?",
      answer:
        "Shipping times vary depending on your location and the shipping method selected. Standard shipping typically takes 3-5 business days, while express shipping takes 1-2 business days. You'll receive a tracking number once your order ships.",
      category: "shipping",
    },
    {
      id: "4",
      question: "Can I return or exchange an item?",
      answer:
        "Yes, we offer returns and exchanges within 7 days of delivery. Items must be in original condition with tags attached. Please contact our customer service team to initiate a return or exchange.",
      category: "shipping",
    },
    {
      id: "5",
      question: "How do I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can track your order by logging into your account and visiting the 'Order History' section, or by using the tracking number on the carrier's website.",
      category: "shipping",
    },
    {
      id: "6",
      question: "Are your products authentic?",
      answer:
        "Yes, all products sold on Reluv are 100% authentic. We have a rigorous authentication process and work with verified sellers. Every item is inspected by our team before being listed.",
      category: "products",
    },
    {
      id: "7",
      question: "How do I update my profile information?",
      answer:
        "You can update your profile information by going to your Profile page and selecting 'My Profile'. From there, you can edit your personal information, email, phone number, and other details.",
      category: "account",
    },
    {
      id: "8",
      question: "How do I change my password?",
      answer:
        "To change your password, go to your Profile settings, select 'Security', and click 'Change Password'. You'll need to enter your current password and your new password twice for confirmation.",
      category: "security",
    },
    {
      id: "9",
      question: "What is your refund policy?",
      answer:
        "We offer full refunds for items returned within 7 days of delivery, provided they are in original condition. Refunds are processed to the original payment method within 5-10 business days after we receive the returned item.",
      category: "payment",
    },
    {
      id: "10",
      question: "How do I contact customer service?",
      answer:
        "You can contact our customer service team through the Contact Us page, via email at support@reluv.com, or by phone at +62-XXX-XXXX-XXXX. Our team is available 24/7 to assist you.",
      category: "shopping",
    },
  ];

  const filteredFAQs =
    selectedCategory === "all"
      ? faqs.filter((faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : faqs.filter(
          (faq) =>
            faq.category === selectedCategory &&
            (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
        );

  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  return (
    <PublicRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-8 sm:py-10 md:py-12">
          {}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-sky-600 dark:text-sky-400" />
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Help Center
              </h1>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions or get in touch with our support team
            </p>
          </div>

          {}
          <div className="mb-8 sm:mb-10">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          {}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 sm:p-6 rounded-lg border-2 transition-all text-left ${
                      selectedCategory === category.id
                        ? "border-sky-600 dark:border-sky-400 bg-sky-50 dark:bg-sky-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-sky-300 dark:hover:border-sky-600"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 sm:p-3 rounded-lg ${
                          selectedCategory === category.id
                            ? "bg-sky-600 dark:bg-sky-500"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            selectedCategory === category.id
                              ? "text-white"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {category.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-xs sm:text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                      }
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-xs sm:text-sm md:text-base font-medium text-gray-900 dark:text-white pr-4 flex-1">
                        {faq.question}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 shrink-0 transition-transform ${
                          expandedFAQ === faq.id ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <HelpCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
                    No results found. Try adjusting your search or category filter.
                  </p>
                </div>
              )}
            </div>
          </div>

          {}
          <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-6 sm:p-8 md:p-10 border border-sky-200 dark:border-sky-800">
            <div className="text-center mb-6 sm:mb-8">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-sky-600 dark:text-sky-400 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Still Need Help?
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                Our support team is here to assist you 24/7
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Link
                href="/contact"
                className="flex flex-col items-center p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-600 dark:hover:border-sky-400 transition-all group"
              >
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600 dark:text-sky-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                  Email Us
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
                  support@reluv.com
                </p>
              </Link>
              <Link
                href="/contact"
                className="flex flex-col items-center p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-600 dark:hover:border-sky-400 transition-all group"
              >
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600 dark:text-sky-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                  Call Us
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
                  +62-XXX-XXXX-XXXX
                </p>
              </Link>
              <Link
                href="/contact"
                className="flex flex-col items-center p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-600 dark:hover:border-sky-400 transition-all group"
              >
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600 dark:text-sky-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                  Live Chat
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
                  Available 24/7
                </p>
              </Link>
            </div>
            <div className="mt-6 sm:mt-8 text-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-600 text-white font-semibold rounded-lg transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default HelpPage;

