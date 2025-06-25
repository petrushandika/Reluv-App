"use client";

import React, { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";

interface SubMenuSection {
  title: string;
  items: string[];
}
interface DropdownContent {
  categories: string[];
  subMenus: {
    [key: string]: SubMenuSection[];
  };
}

const Navbar = () => {
  const [activeMainMenu, setActiveMainMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileActiveMainMenu, setMobileActiveMainMenu] = useState<
    string | null
  >(null);
  const [mobileActiveSubMenu, setMobileActiveSubMenu] = useState<string | null>(
    null
  );

  const dropdownData: { [key: string]: DropdownContent } = {
    Women: {
      categories: [
        "Limited Offers",
        "New Arrival",
        "Bags",
        "Shoes",
        "Clothing",
        "Accessories",
        "Watches",
        "Preloved",
      ],
      subMenus: {
        "Limited Offers": [
          {
            title: "Crafted for You",
            items: ["Flash Sale Items", "Weekend Specials", "Member Exclusive"],
          },
          {
            title: "Shop by Category",
            items: [
              "Sale Bags",
              "Sale Shoes",
              "Sale Clothing",
              "Sale Accessories",
              "Sale Watches",
              "Clearance Items",
            ],
          },
          {
            title: "Perfect Picks for Beloved Ones",
            items: [
              "Gift Card IDR 1.000.000",
              "Gift Card IDR 500.000",
              "Gift Card IDR 250.000",
            ],
          },
        ],
        "New Arrival": [
          {
            title: "Crafted for You",
            items: ["Timeless Pieces", "Simply Unique", "The Prestige Series"],
          },
          {
            title: "Shop by Category",
            items: [
              "All New Arrivals",
              "New in Bags",
              "New in Shoes",
              "New in Clothing",
              "New in Accessories",
              "New in Watches",
            ],
          },
          {
            title: "Perfect Picks for Beloved Ones",
            items: [
              "Gift Card IDR 1.000.000",
              "Gift Card IDR 500.000",
              "Gift Card IDR 250.000",
            ],
          },
        ],
        Bags: [
          {
            title: "Crafted for You",
            items: [
              "Signature Collection",
              "Limited Edition",
              "Artisan Crafted",
            ],
          },
          {
            title: "Shop by Category",
            items: [
              "Handbags",
              "Shoulder Bags",
              "Crossbody Bags",
              "Clutches",
              "Backpacks",
              "Tote Bags",
            ],
          },
          {
            title: "Perfect Picks for Beloved Ones",
            items: [
              "Gift Card IDR 1.000.000",
              "Gift Card IDR 500.000",
              "Gift Card IDR 250.000",
            ],
          },
        ],
        Shoes: [
          {
            title: "Crafted for You",
            items: ["Comfort Series", "Statement Pieces", "Classic Collection"],
          },
          {
            title: "Shop by Category",
            items: [
              "High Heels",
              "Flats & Ballerinas",
              "Sneakers",
              "Boots & Ankle Boots",
              "Sandals",
              "Loafers",
            ],
          },
          {
            title: "Perfect Picks for Beloved Ones",
            items: [
              "Gift Card IDR 1.000.000",
              "Gift Card IDR 500.000",
              "Gift Card IDR 250.000",
            ],
          },
        ],
        Clothing: [
          {
            title: "Crafted for You",
            items: [
              "Wardrobe Essentials",
              "Seasonal Must-Haves",
              "Designer Picks",
            ],
          },
          {
            title: "Shop by Category",
            items: [
              "Dresses",
              "Tops & Blouses",
              "Skirts & Pants",
              "Jackets & Blazers",
              "Knitwear",
              "Outerwear",
            ],
          },
          {
            title: "Perfect Picks for Beloved Ones",
            items: [
              "Gift Card IDR 1.000.000",
              "Gift Card IDR 500.000",
              "Gift Card IDR 250.000",
            ],
          },
        ],
        Accessories: [
          {
            title: "Crafted for You",
            items: [
              "Statement Jewelry",
              "Everyday Essentials",
              "Special Occasions",
            ],
          },
          {
            title: "Shop by Category",
            items: [
              "Fine Jewelry",
              "Fashion Accessories",
              "Scarves & Shawls",
              "Belts",
              "Sunglasses",
              "Hair Accessories",
            ],
          },
          {
            title: "Perfect Picks for Beloved Ones",
            items: [
              "Gift Card IDR 1.000.000",
              "Gift Card IDR 500.000",
              "Gift Card IDR 250.000",
            ],
          },
        ],
        Preloved: [
          {
            title: "Crafted for You",
            items: [
              "Authenticated Luxury",
              "Vintage Treasures",
              "Collector Pieces",
            ],
          },
          {
            title: "Shop by Category",
            items: [
              "Pre-owned Bags",
              "Vintage Shoes",
              "Designer Clothing",
              "Estate Jewelry",
              "Classic Watches",
              "Rare Finds",
            ],
          },
          {
            title: "Perfect Picks for Beloved Ones",
            items: [
              "Gift Card IDR 1.000.000",
              "Gift Card IDR 500.000",
              "Gift Card IDR 250.000",
            ],
          },
        ],
      },
    },
    Men: {
      categories: [
        "Limited Offers",
        "New Arrival",
        "Bags",
        "Shoes",
        "Clothing",
        "Accessories",
        "Watches",
        "Preloved",
      ],
      subMenus: {
        "New Arrival": [
          {
            title: "Crafted for You",
            items: [
              "Executive Collection",
              "Casual Essentials",
              "Premium Lifestyle",
            ],
          },
        ],
      },
    },
    Kids: {
      categories: ["New Arrival", "Boys", "Girls", "Baby", "Shoes"],
      subMenus: {
        "New Arrival": [
          {
            title: "Crafted for You",
            items: [
              "Age-Appropriate Designs",
              "Comfort First",
              "Playful & Fun",
            ],
          },
        ],
      },
    },
    Brands: {
      categories: [
        "Luxury Fashion",
        "Designer Brands",
        "Contemporary",
        "Jewelry & Watches",
      ],
      subMenus: {
        "Luxury Fashion": [
          {
            title: "Crafted for You",
            items: ["Heritage Brands", "Modern Luxury", "Timeless Elegance"],
          },
        ],
      },
    },
  };

  const giftCardData = [
    {
      label: "Gift Card IDR 1.000.000",
      amount: "1.000.000",
      price: "Rp1.000.000",
    },
    {
      label: "Gift Card IDR 500.000",
      amount: "500.000",
      price: "Rp500.000",
    },
    {
      label: "Gift Card IDR 250.000",
      amount: "250.000",
      price: "Rp250.000",
    },
  ];

  useEffect(() => {
    if (activeMainMenu) {
      const timer = setInterval(() => {
        setCurrentCardIndex(
          (prevIndex) => (prevIndex + 1) % giftCardData.length
        );
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [activeMainMenu]);

  const handleMainMenuEnter = (menu: string) => {
    setActiveMainMenu(menu);
    setActiveSubMenu(null);
  };

  const handleSubMenuEnter = (subMenu: string) => {
    setActiveSubMenu(subMenu);
  };

  const handleNavbarLeave = () => {
    setActiveMainMenu(null);
    setActiveSubMenu(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setMobileActiveMainMenu(null);
      setMobileActiveSubMenu(null);
    }
  };

  const toggleMobileMainMenu = (menu: string) => {
    setMobileActiveMainMenu((prev) => (prev === menu ? null : menu));
    setMobileActiveSubMenu(null);
  };

  const toggleMobileSubMenu = (subMenu: string) => {
    setMobileActiveSubMenu((prev) => (prev === subMenu ? null : subMenu));
  };

  return (
    <div className="relative" onMouseLeave={handleNavbarLeave}>
      <div className="w-full bg-white text-gray-800 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6 md:px-20 xl:px-40 py-4">
          <div className="text-xl lg:text-2xl font-bold text-sky-700">
            reluv.id
          </div>
          <nav className="hidden lg:flex items-center space-x-8">
            {Object.keys(dropdownData).map((menu) => (
              <button
                key={menu}
                onMouseEnter={() => handleMainMenuEnter(menu)}
                className={`py-4 font-semibold hover:text-sky-600 transition-colors duration-200 ${
                  activeMainMenu === menu ? "text-sky-600" : ""
                }`}
              >
                {menu}
              </button>
            ))}
          </nav>
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products or brands"
                className="w-60 xl:w-80 px-4 py-2 rounded-md text-gray-700 bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <Heart className="w-6 h-6 text-sky-600 hover:text-sky-600 cursor-pointer transition-colors" />
            <ShoppingBag className="w-6 h-6 text-sky-600 hover:text-sky-600 cursor-pointer transition-colors" />
            <div className="flex items-center space-x-2 text-sm cursor-pointer">
              <User className="w-5 h-5 text-sky-600" />
              <span className="font-semibold hover:text-sky-600">Sign In</span>
              <span className="font-semibold hover:text-sky-600">|</span>
              <span className="font-semibold hover:text-sky-600">Register</span>
            </div>
          </div>
          <div className="flex lg:hidden items-center space-x-3">
            <Search className="w-6 h-6 text-gray-600 hover:text-sky-600 cursor-pointer" />
            <Heart className="w-6 h-6 text-gray-600 hover:text-sky-600 cursor-pointer" />
            <ShoppingBag className="w-6 h-6 text-gray-600 hover:text-sky-600 cursor-pointer" />
            <button onClick={toggleMobileMenu} className="p-1">
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white text-gray-800 border-t border-gray-200">
          <div className="p-4 space-y-1">
            {Object.keys(dropdownData).map((menu) => (
              <div key={menu} className="border-b border-gray-200">
                <button
                  onClick={() => toggleMobileMainMenu(menu)}
                  className="w-full flex justify-between items-center py-3 text-left font-semibold"
                >
                  <span>{menu}</span>
                  <X
                    className={`w-4 h-4 transition-transform duration-300 ${
                      mobileActiveMainMenu === menu ? "rotate-45" : ""
                    }`}
                  />
                </button>
                {mobileActiveMainMenu === menu && (
                  <div className="pl-4 pb-2">
                    {dropdownData[menu].categories.map((category) => (
                      <div
                        key={category}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <button
                          onClick={() => toggleMobileSubMenu(category)}
                          className="w-full flex justify-between items-center py-3 text-left text-sm text-gray-700"
                        >
                          <span>{category}</span>
                          <X
                            className={`w-4 h-4 transition-transform duration-300 ${
                              mobileActiveSubMenu === category
                                ? "rotate-45"
                                : ""
                            }`}
                          />
                        </button>
                        {mobileActiveSubMenu === category && (
                          <div className="pl-4 py-2 space-y-3 bg-gray-50 rounded-md my-2">
                            {dropdownData[menu].subMenus[category]?.map(
                              (section) => (
                                <div key={section.title}>
                                  <h4 className="font-bold text-sky-700 text-xs uppercase tracking-wider mb-2">
                                    {section.title}
                                  </h4>
                                  <ul className="space-y-2">
                                    {section.items.map((item, itemIndex) => (
                                      <li key={itemIndex}>
                                        <a
                                          href="#"
                                          className="block text-xs text-gray-600 hover:text-sky-600"
                                        >
                                          {item}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="py-3 md:border-t md:border-gray-200">
              <div className="flex items-center space-x-2 text-sm cursor-pointer p-2 font-semibold">
                <User className="w-5 h-5" />
                <span>Sign In</span>
                <span className="text-gray-300">|</span>
                <span>Register</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMainMenu && (
        <div className="hidden lg:block absolute top-full left-0 w-full z-50">
          <div className="bg-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-center space-x-6 xl:space-x-8 py-3 px-4">
              {dropdownData[activeMainMenu]?.categories.map((category) => (
                <button
                  key={category}
                  className={`text-gray-600 font-semibold hover:text-sky-600 transition-colors duration-200 px-3 py-2 text-sm xl:text-base whitespace-nowrap`}
                  onMouseEnter={() => handleSubMenuEnter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {activeSubMenu && (
            <div className="w-full bg-white text-gray-800 shadow-lg">
              <div className="container mx-auto px-6 md:px-20 lg:px-40 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-12">
                  {dropdownData[activeMainMenu]?.subMenus[activeSubMenu]?.map(
                    (section) => {
                      if (section.title === "Perfect Picks for Beloved Ones") {
                        return (
                          <div key={section.title}>
                            <h3 className="font-bold text-lg mb-4 text-sky-700 border-b border-gray-200 pb-2">
                              {section.title}
                            </h3>
                            <div className="relative mt-4 overflow-hidden w-full">
                              <div
                                className="flex transition-transform duration-700 ease-in-out"
                                style={{
                                  transform: `translateX(-${
                                    currentCardIndex * 100
                                  }%)`,
                                }}
                              >
                                {giftCardData.map((card, cardIndex) => (
                                  <div
                                    key={cardIndex}
                                    className="w-full flex-shrink-0 px-1"
                                  >
                                    <div className="bg-sky-600 text-white p-6 rounded-lg relative hover:bg-sky-700 transition-colors cursor-pointer group">
                                      <div className="absolute top-3 left-3 text-sm font-medium opacity-90">
                                        reluv.id
                                      </div>
                                      <div className="absolute top-3 right-3">
                                        <div className="w-10 h-10 border-2 border-white rounded-full opacity-30"></div>
                                      </div>
                                      <div className="absolute bottom-3 right-3">
                                        <div className="w-6 h-6 border-2 border-white rounded-full opacity-20"></div>
                                      </div>
                                      <div className="mt-8 mb-6">
                                        <div className="text-xs opacity-80 mb-1 tracking-wider">
                                          GIFT VOUCHER
                                        </div>
                                        <div className="text-2xl font-bold">
                                          IDR {card.amount}
                                        </div>
                                      </div>
                                      <div className="border-t border-white/20 pt-4">
                                        <div className="text-sm font-medium mb-1">
                                          {card.label}
                                        </div>
                                        <div className="text-xl font-bold">
                                          {card.price}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-2">
                                {giftCardData.map((_, dotIndex) => (
                                  <button
                                    key={dotIndex}
                                    onClick={() =>
                                      setCurrentCardIndex(dotIndex)
                                    }
                                    className={`h-2 w-2 rounded-full transition-colors ${
                                      currentCardIndex === dotIndex
                                        ? "bg-sky-600"
                                        : "bg-gray-300"
                                    }`}
                                    aria-label={`Go to slide ${dotIndex + 1}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div key={section.title}>
                            <h3 className="font-bold text-lg mb-4 text-sky-700 border-b border-gray-200 pb-2">
                              {section.title}
                            </h3>
                            <ul className="space-y-3">
                              {section.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <a
                                    href="#"
                                    className="text-gray-600 hover:text-sky-600 transition-colors duration-200 text-sm leading-relaxed block py-1"
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                    }
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
