"use client";

import React from "react";
import { motion } from "framer-motion";

const Promotion = () => {
  return (
    <section className="relative w-full overflow-hidden bg-sky-600">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-cyan-500 opacity-90"></div>

      <motion.div
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-72 h-72 bg-sky-300/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
      ></motion.div>
      <motion.div
        animate={{ rotate: -360, scale: [1, 1.1, 1] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-300/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
      ></motion.div>

      <div className="relative container mx-auto px-6 py-12 md:py-16 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.2 }}
          className="grid md:grid-cols-2 items-center gap-8 md:gap-12"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -100 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ type: "spring", stiffness: 50 }}
            className="flex justify-center md:justify-end -mb-10 md:mb-0"
          >
            <img
              src="https://res.cloudinary.com/dqcyabvc2/image/upload/v1750843653/Mobile_ccclv1.png"
              alt="reluv App Promotion"
              className="max-w-[280px] md:max-w-xs lg:max-w-sm drop-shadow-2xl"
            />
          </motion.div>

          <div className="text-center md:text-left">
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="text-3xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight"
            >
              Everyone Wins on <span className="block">reluv</span>
            </motion.h2>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-sky-100 text-lg max-w-md mx-auto md:mx-0"
            >
              Unlock exclusive features when you download the reluv app today!
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-row items-center justify-center md:justify-start gap-6"
            >
              {/* Kolom untuk tombol download */}
              <div className="flex flex-col gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  aria-label="Download on the App Store"
                >
                  <img
                    src="https://res.cloudinary.com/dqcyabvc2/image/upload/v1750843640/apple_store_wis2fc.svg"
                    alt="Download on the App Store"
                    className="h-12 transition-opacity"
                  />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  aria-label="Get it on Google Play"
                >
                  <img
                    src="https://res.cloudinary.com/dqcyabvc2/image/upload/v1750843646/google_play_zivpey.svg"
                    alt="Get it on Google Play"
                    className="h-12 transition-opacity"
                  />
                </motion.a>
              </div>

              <div className="bg-white p-2 rounded-lg shadow-lg">
                <img
                  src="https://res.cloudinary.com/dqcyabvc2/image/upload/v1750843661/QR_Code_vhilof.webp"
                  alt="QR Code for app download"
                  className="w-28 h-28"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Promotion;
