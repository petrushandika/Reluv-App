"use client";

import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  ShieldCheck,
  Truck,
  Lock,
} from "lucide-react";
import Link from "next/link";

const VisaIcon = () => (
  <svg
    role="img"
    width="38"
    height="24"
    viewBox="0 0 38 24"
    xmlns="http://www.w3.org/2000/svg"
    className="text-gray-500"
  >
    <path
      d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
      fill="#E0E0E0"
    />
    <path
      d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
      fill="#FFF"
    />
    <path
      d="M12.4 14.1H9.5l-1.1 4.2H5.9l3.3-11.2h3l3.3 11.2h-2.6zm-1.5-1.8h.1l-.6-2.5-.6 2.5zM23.1 7.2h-2.3c-.5 0-.8.2-.9.5l-2.8 8.6h2.9c0 0 .4-.9.5-1.2h2.2c.1.3.4 1.2.4 1.2h2.5l-2.8-10.1zm-1.3 5.4c.3-1 .6-2.1.6-2.1h.1s.2 1.1.5 2.1h-1.2zM25.2 14.1h2.9l.9-3.7c.1-.5-.1-1.1-.7-1.1-.5 0-1 .5-1.1.9l-1.3 3.9h0zm1.2-5.1c.3.4.4.8.2 1.2l-.4 1.8s-.3-1.5-.3-1.7c0-.5.2-.9.5-.9.4 0 .5.3.5.6zM32.2 7.2l-2.1 11.2h2.8l2.1-11.2h-2.8z"
      fill="#1A1F71"
    />
  </svg>
);

const MasterCardIcon = () => (
  <svg
    role="img"
    width="38"
    height="24"
    viewBox="0 0 38 24"
    xmlns="http://www.w3.org/2000/svg"
    className="text-gray-500"
  >
    <path
      d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
      fill="#E0E0E0"
    />
    <path
      d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
      fill="#FFF"
    />
    <circle cx="15" cy="12" r="7" fill="#EB001B" />
    <circle cx="23" cy="12" r="7" fill="#F79E1B" />
    <path
      d="M22 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"
      fill="#FF5F00"
    />
  </svg>
);

const Footer = () => {
  const navLinkClass =
    "relative w-fit block text-gray-600 after:block after:content-[''] after:absolute after:h-[1px] after:bg-sky-600 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left";

  return (
    <footer className="bg-white">
      <div className="bg-gray-50 border-t border-b border-gray-200">
        <div className="container mx-auto px-6 md:px-20 xl:px-40 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-sky-600" />
            <h4 className="font-semibold text-gray-800">
              Authenticity Guaranteed
            </h4>
            <p className="text-xs text-gray-500">
              Every item is 100% verified by our experts.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Truck className="w-8 h-8 text-sky-600" />
            <h4 className="font-semibold text-gray-800">
              Fast & Free Shipping
            </h4>
            <p className="text-xs text-gray-500">
              On all domestic orders above IDR 1,000,000.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Lock className="w-8 h-8 text-sky-600" />
            <h4 className="font-semibold text-gray-800">Secure Payments</h4>
            <p className="text-xs text-gray-500">
              Your information is protected with us.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Mail className="w-8 h-8 text-sky-600" />
            <h4 className="font-semibold text-gray-800">24/7 Support</h4>
            <p className="text-xs text-gray-500">
              We are here to help you anytime.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-20 xl:px-40 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-sky-700">reluv</h3>
            <p className="text-sm text-gray-600">
              Your premier destination for authentic, pre-loved luxury fashion.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="#"
                className="p-2 border border-gray-200 rounded-full text-gray-500 hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all duration-300"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="p-2 border border-gray-200 rounded-full text-gray-500 hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="p-2 border border-gray-200 rounded-full text-gray-500 hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all duration-300"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 uppercase tracking-wider">
              Customer Service
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className={navLinkClass}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className={navLinkClass}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className={navLinkClass}>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className={navLinkClass}>
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 uppercase tracking-wider">
              About Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className={navLinkClass}>
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className={navLinkClass}>
                  Authenticity
                </Link>
              </li>
              <li>
                <Link href="#" className={navLinkClass}>
                  Store Locations
                </Link>
              </li>
              <li>
                <Link href="#" className={navLinkClass}>
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 uppercase tracking-wider">
              Stay in the Loop
            </h4>
            <p className="text-sm text-gray-600">
              Subscribe for the latest arrivals and exclusive offers.
            </p>
            <form className="w-full">
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-gray-100 text-gray-800 placeholder-gray-500 pl-4 pr-24 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 bg-sky-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-sky-700 transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 md:px-20 xl:px-40 py-6 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-gray-500 mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} reluv. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-4">
            <VisaIcon />
            <MasterCardIcon />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
