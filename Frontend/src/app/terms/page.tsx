"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";
import { PublicRoute } from "@/shared/components/guards/RouteGuards";

const TermsOfService = () => {
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
            <FileText className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Terms of Service
            </h1>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-6">
            <section>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Welcome to Reluv. These Terms of Service ("Terms") govern your access to and use of our platform, 
                including our website, mobile application, and services (collectively, the "Service"). By accessing 
                or using our Service, you agree to be bound by these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                By creating an account, accessing, or using Reluv, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, 
                you may not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                2. User Accounts
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <p>
                  <strong className="text-gray-900 dark:text-white">2.1 Account Creation:</strong> To use certain features 
                  of our Service, you must create an account. You agree to provide accurate, current, and complete 
                  information during registration and to update such information to keep it accurate, current, and complete.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">2.2 Account Security:</strong> You are responsible for 
                  maintaining the confidentiality of your account credentials and for all activities that occur under 
                  your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">2.3 Account Eligibility:</strong> You must be at 
                  least 18 years old to create an account and use our Service. By creating an account, you represent 
                  and warrant that you meet this age requirement.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                3. Use of Service
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <p>
                  <strong className="text-gray-900 dark:text-white">3.1 Permitted Use:</strong> You may use our Service 
                  for lawful purposes only and in accordance with these Terms. You agree not to use the Service:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>In any way that violates any applicable law or regulation</li>
                  <li>To transmit any malicious code, viruses, or harmful data</li>
                  <li>To impersonate or attempt to impersonate Reluv or any other person or entity</li>
                  <li>To engage in any fraudulent, abusive, or illegal activity</li>
                  <li>To interfere with or disrupt the Service or servers connected to the Service</li>
                </ul>
                <p>
                  <strong className="text-gray-900 dark:text-white">3.2 Product Listings:</strong> If you list products 
                  for sale on our platform, you represent and warrant that you have the right to sell such products and 
                  that all product information is accurate and complete.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                4. Payments and Transactions
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <p>
                  <strong className="text-gray-900 dark:text-white">4.1 Payment Processing:</strong> All payments are 
                  processed through secure third-party payment processors. By making a purchase, you agree to provide 
                  valid payment information and authorize us to charge your payment method.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">4.2 Pricing:</strong> All prices are displayed in 
                  the currency specified on the platform. We reserve the right to change prices at any time, but price 
                  changes will not affect orders already placed.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">4.3 Transaction Fees:</strong> Additional fees may 
                  apply to certain transactions. All applicable fees will be clearly disclosed before you complete your purchase.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                5. Shipping and Delivery
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <p>
                  <strong className="text-gray-900 dark:text-white">5.1 Shipping Options:</strong> Shipping options and 
                  costs will be calculated during checkout based on your delivery address and the seller's location.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">5.2 Delivery Times:</strong> Estimated delivery 
                  times are provided for informational purposes only and are not guaranteed. Actual delivery times may 
                  vary based on various factors.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">5.3 Risk of Loss:</strong> The risk of loss and 
                  title for products purchased pass to you upon delivery to the carrier.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                6. Returns and Refunds
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <p>
                  <strong className="text-gray-900 dark:text-white">6.1 Return Policy:</strong> Our return policy is 
                  designed to ensure customer satisfaction. Products may be returned within the timeframe specified in 
                  our return policy, subject to certain conditions.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">6.2 Refund Processing:</strong> Refunds will be 
                  processed to the original payment method within a reasonable timeframe after we receive and inspect 
                  the returned product.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">6.3 Non-Returnable Items:</strong> Certain items, 
                  such as personalized products or items marked as final sale, may not be eligible for return.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                7. Intellectual Property
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <p>
                  <strong className="text-gray-900 dark:text-white">7.1 Our Content:</strong> All content on our Service, 
                  including text, graphics, logos, images, and software, is the property of Reluv or its content suppliers 
                  and is protected by copyright and other intellectual property laws.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">7.2 User Content:</strong> By posting, uploading, or 
                  submitting content to our Service, you grant Reluv a worldwide, non-exclusive, royalty-free license to 
                  use, reproduce, and distribute such content for the purpose of operating and promoting our Service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                8. Limitation of Liability
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, RELUV SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR 
                INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF 
                THE SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                9. Indemnification
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                You agree to indemnify, defend, and hold harmless Reluv and its officers, directors, employees, and agents 
                from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' 
                fees, arising out of or in any way connected with your access to or use of the Service or your violation 
                of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                10. Changes to Terms
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by 
                posting the new Terms on this page. Your continued use of the Service after such changes constitutes your 
                acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                11. Governing Law
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which 
                Reluv operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                12. Contact Us
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-4">
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white">Email:</strong>{" "}
                  <a
                    href="mailto:support@reluv.com"
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 underline"
                  >
                    support@reluv.com
                  </a>
                </p>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-2">
                  <strong className="text-gray-900 dark:text-white">Address:</strong> Reluv Customer Service
                </p>
              </div>
            </section>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors"
              >
                Privacy Policy
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

export default TermsOfService;

