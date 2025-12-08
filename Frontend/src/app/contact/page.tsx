"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { PublicRoute } from "@/shared/components/guards/RouteGuards";
import { toast } from "sonner";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Message Sent", {
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Send us an email anytime",
      contact: "support@reluv.com",
      action: "mailto:support@reluv.com",
    },
    {
      icon: Phone,
      title: "Phone",
      description: "Call us during business hours",
      contact: "+62-XXX-XXXX-XXXX",
      action: "tel:+62XXXXXXXXXXX",
    },
    {
      icon: MapPin,
      title: "Address",
      description: "Visit our office",
      contact: "Jakarta, Indonesia",
      action: "#",
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "We're here to help",
      contact: "24/7 Support",
      action: "#",
    },
  ];

  return (
    <PublicRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-8 sm:py-10 md:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-sky-600 dark:text-sky-400" />
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Contact Us
              </h1>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have a question or need assistance? We're here to help. Reach out to us through any of the methods below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            {/* Contact Methods */}
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
                Get in Touch
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.action}
                      className="flex items-start gap-4 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-600 dark:hover:border-sky-400 transition-all group"
                    >
                      <div className="p-2 sm:p-3 bg-sky-100 dark:bg-sky-900/30 rounded-lg group-hover:bg-sky-600 dark:group-hover:bg-sky-500 transition-colors">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600 dark:text-sky-400 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {method.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {method.description}
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-sky-600 dark:text-sky-400">
                          {method.contact}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Additional Info */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-800">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Response Time
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  We typically respond to all inquiries within 24 hours. For urgent matters, please call us directly.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
                Send us a Message
              </h2>
              {isSubmitted ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 sm:p-10 md:p-12 text-center">
                  <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs sm:text-sm md:text-base text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="+62 XXX XXXX XXXX"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Question</option>
                      <option value="shipping">Shipping & Delivery</option>
                      <option value="return">Returns & Refunds</option>
                      <option value="product">Product Question</option>
                      <option value="account">Account Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default ContactPage;

