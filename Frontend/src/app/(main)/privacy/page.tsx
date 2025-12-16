"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Shield } from "lucide-react";
import { PublicRoute } from "@/shared/components/guards/RouteGuards";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <PublicRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-6 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Privacy Policy
            </h1>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-6">
            <section>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                At Reluv, we are committed to protecting your privacy and ensuring the security of your personal 
                information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our Service. By using our Service, you agree to the collection and use of information in 
                accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                1. Information We Collect
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">1.1 Personal Information:</p>
                  <p className="mb-2">We may collect personal information that you provide directly to us, including:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Name, email address, and phone number</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed through secure third-party payment processors)</li>
                    <li>Account credentials and profile information</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">1.2 Usage Information:</p>
                  <p className="mb-2">We automatically collect certain information when you use our Service, including:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, clicks, searches)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">1.3 Transaction Information:</p>
                  <p>We collect information about your purchases, returns, and other transactions on our platform.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                2. How We Use Your Information
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <p>We use the information we collect for various purposes, including:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>To provide, maintain, and improve our Service</li>
                  <li>To process transactions and send related information</li>
                  <li>To send you updates, promotional materials, and other communications (with your consent)</li>
                  <li>To respond to your inquiries, comments, and requests</li>
                  <li>To monitor and analyze usage patterns and trends</li>
                  <li>To detect, prevent, and address technical issues and security threats</li>
                  <li>To personalize your experience and provide relevant content</li>
                  <li>To comply with legal obligations and enforce our Terms of Service</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                3. Information Sharing and Disclosure
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
                <div className="space-y-3">
                  <p>
                    <strong className="text-gray-900 dark:text-white">3.1 Service Providers:</strong> We may share your 
                    information with third-party service providers who perform services on our behalf, such as payment 
                    processing, shipping, data analysis, and customer service.
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">3.2 Business Transfers:</strong> In the event of 
                    a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">3.3 Legal Requirements:</strong> We may disclose 
                    your information if required to do so by law or in response to valid requests by public authorities.
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">3.4 With Your Consent:</strong> We may share your 
                    information with your explicit consent or at your direction.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                4. Data Security
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure payment processing through certified third-party providers</li>
                </ul>
                <p className="mt-3">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
                  to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                5. Cookies and Tracking Technologies
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <p>
                  We use cookies and similar tracking technologies to track activity on our Service and store certain 
                  information. Cookies are files with a small amount of data that are stored on your device.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">Types of Cookies We Use:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for the Service to function properly</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our Service</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>
                <p className="mt-3">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
                  if you do not accept cookies, you may not be able to use some portions of our Service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                6. Your Rights and Choices
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your information to another service</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, please contact us using the contact information provided at the end of this 
                  Privacy Policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                7. Data Retention
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need 
                your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                8. Children's Privacy
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal 
                information from children. If you are a parent or guardian and believe your child has provided us with 
                personal information, please contact us immediately, and we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                9. International Data Transfers
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Your information may be transferred to and maintained on computers located outside of your state, province, 
                country, or other governmental jurisdiction where data protection laws may differ. By using our Service, you 
                consent to the transfer of your information to these facilities.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                10. Changes to This Privacy Policy
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. 
                Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                11. Contact Us
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-4">
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white">Email:</strong>{" "}
                  <a
                    href="mailto:privacy@reluv.com"
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 underline"
                  >
                    privacy@reluv.com
                  </a>
                </p>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-2">
                  <strong className="text-gray-900 dark:text-white">Data Protection Officer:</strong>{" "}
                  <a
                    href="mailto:dpo@reluv.com"
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 underline"
                  >
                    dpo@reluv.com
                  </a>
                </p>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-2">
                  <strong className="text-gray-900 dark:text-white">Address:</strong> Reluv Privacy Team
                </p>
              </div>
            </section>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm">
              <Link
                href="/terms"
                className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors"
              >
                Terms of Service
              </Link>
              <span className="hidden sm:inline text-gray-400 dark:text-gray-600">•</span>
              <Link
                href="/contact"
                className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default PrivacyPolicy;

