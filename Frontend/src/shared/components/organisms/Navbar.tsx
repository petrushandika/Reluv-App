"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  ScrollText,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";

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
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const itemCount = useCartStore((state) => state.itemCount);
  const wishlistItems = useWishlistStore((state) => state.items);

  const isAuthenticated = !!token;
  const wishlistItemCount = wishlistItems.length;

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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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

  // Helper function to convert category name to slug
  const categoryToSlug = (category: string): string => {
    return category.toLowerCase().replace(/\s+/g, "-");
  };

  // Helper function to get base route for main menu
  const getMainMenuRoute = (menu: string): string => {
    const menuRoutes: { [key: string]: string } = {
      Women: "/women",
      Men: "/men",
      Kids: "/kids",
      Brands: "/brands",
    };
    return menuRoutes[menu] || "/";
  };

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
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setMobileActiveMainMenu(null);
      setMobileActiveSubMenu(null);
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const toggleMobileMainMenu = (menu: string) => {
    setMobileActiveMainMenu((prev) => (prev === menu ? null : menu));
    setMobileActiveSubMenu(null);
  };
  const toggleMobileSubMenu = (subMenu: string) => {
    setMobileActiveSubMenu((prev) => (prev === subMenu ? null : subMenu));
  };
  const handleMobileMainMenuClick = (e: React.MouseEvent, menu: string) => {
    e.stopPropagation();
    const route = getMainMenuRoute(menu);
    window.location.href = route;
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  const formatUserName = () => {
    if (!user) return "";
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    if (fullName.length > 8) {
      return `${user.firstName} ${
        user.lastName ? user.lastName.charAt(0) + "." : ""
      }`;
    }
    return fullName;
  };

  return (
    <header
      onMouseLeave={handleNavbarLeave}
      className="fixed top-0 left-0 right-0 w-full z-50 bg-white shadow transition-all duration-300"
    >
      <div className="w-full text-gray-800 relative">
        <div className="container mx-auto flex items-center justify-between px-6 md:px-20 xl:px-40 py-4">
          <Link href="/">
            <div className="text-xl lg:text-2xl font-bold text-sky-700 hidden lg:block">
              reluv
            </div>
            <img
              src="https://res.cloudinary.com/dqcyabvc2/image/upload/v1752299960/logo_gqfygx.png"
              alt="Reluv Logo"
              className="block lg:hidden h-8 w-auto"
            />
          </Link>
          <nav className="hidden lg:flex items-center space-x-8">
            {Object.keys(dropdownData).map((menu) => (
              <Link
                key={menu}
                href={getMainMenuRoute(menu)}
                onMouseEnter={() => handleMainMenuEnter(menu)}
                className={`py-4 font-semibold hover:text-sky-600 transition-colors duration-200 ${
                  activeMainMenu === menu ? "text-sky-600" : ""
                }`}
              >
                {menu}
              </Link>
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

            <Link href="/sell" passHref>
              <div className="bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-sky-700 transition-colors cursor-pointer">
                Sell
              </div>
            </Link>

            <Link href="/wishlist" aria-label="Wishlist" className="relative">
              <Heart className="w-6 h-6 text-sky-600 hover:text-sky-700 cursor-pointer transition-colors" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/90 text-white text-xs font-bold">
                  {wishlistItemCount}
                </span>
              )}
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative">
              <ShoppingBag className="w-6 h-6 text-sky-600 hover:text-sky-700 cursor-pointer transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/90 text-white text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link href="/notifications" aria-label="Notifications">
              <Bell className="w-6 h-6 text-sky-600 hover:text-sky-700 cursor-pointer transition-colors" />
            </Link>

            {isAuthenticated ? (
              <div
                className="relative"
                onMouseEnter={() => setIsProfileDropdownOpen(true)}
                onMouseLeave={() => setIsProfileDropdownOpen(false)}
              >
                <button className="flex items-center space-x-2 text-sm font-semibold hover:text-sky-600 transition-colors">
                  <img
                    src={
                      user?.profile?.avatar ||
                      "https://res.cloudinary.com/dqcyabvc2/image/upload/v1753019800/user_nxnpv1.webp"
                    }
                    alt="User Avatar"
                    className="w-7 h-7 rounded-full object-cover border-2 border-sky-100"
                  />
                  <span>Hi, {formatUserName()}!</span>
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full pt-2 w-48">
                    <div className="bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link
                        href="/profile/me"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-sky-600"
                      >
                        <User className="w-4 h-4 mr-2" /> My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-sky-600"
                      >
                        <ScrollText className="w-4 h-4 mr-2" /> Order History
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-sm">
                <User className="w-5 h-5 text-sky-600" />
                <Link
                  href="/auth/login"
                  aria-label="Sign In"
                  className="font-semibold hover:text-sky-600 transition-colors"
                >
                  Sign In
                </Link>
                <span className="text-gray-400">|</span>
                <Link
                  href="/auth/register"
                  aria-label="Register"
                  className="font-semibold hover:text-sky-600 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="flex lg:hidden items-center space-x-4">
            <Search className="w-6 h-6 text-sky-600 hover:text-sky-700 cursor-pointer" />
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="relative"
            >
              <Bell className="w-6 h-6 text-sky-600 hover:text-sky-700 cursor-pointer" />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="relative">
              <Heart className="w-6 h-6 text-sky-600 hover:text-sky-700 cursor-pointer" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/90 text-white text-xs font-bold">
                  {wishlistItemCount}
                </span>
              )}
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative">
              <ShoppingBag className="w-6 h-6 text-sky-600 hover:text-sky-700 cursor-pointer" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/90 text-white text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

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
        <div className="absolute top-full left-0 w-full z-10 lg:hidden bg-white text-gray-800 border-t border-gray-200 max-h-[calc(100vh-4.5rem)] overflow-y-auto">
          <div className="py-4 px-6 space-y-1 border-b border-gray-200">
            {Object.keys(dropdownData).map((menu) => (
              <div
                key={menu}
                className="border-b border-gray-200 last:border-b-0"
              >
                <div
                  onClick={() => toggleMobileMainMenu(menu)}
                  className="w-full flex justify-between items-center py-3 text-left font-semibold cursor-pointer"
                >
                  <span
                    onClick={(e) => handleMobileMainMenuClick(e, menu)}
                    className="hover:text-sky-600"
                  >
                    {menu}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      mobileActiveMainMenu === menu ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {mobileActiveMainMenu === menu && (
                  <div className="pl-4 pb-2">
                    {dropdownData[menu].categories.map((category) => {
                      const categorySlug = categoryToSlug(category);
                      const categoryRoute = `${getMainMenuRoute(
                        menu
                      )}/${categorySlug}`;
                      return (
                        <div
                          key={category}
                          className="border-b border-gray-200 last:border-b-0"
                        >
                          <Link
                            href={categoryRoute}
                            className="w-full flex justify-between items-center py-3 text-left text-sm text-gray-700 cursor-pointer hover:text-sky-600"
                            onClick={() => toggleMobileSubMenu(category)}
                          >
                            <span>{category}</span>
                            <ChevronDown
                              className={`w-5 h-5 transition-transform duration-300 ${
                                mobileActiveSubMenu === category
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </Link>
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
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {isAuthenticated ? (
              <div className="">
                <Link
                  href="/profile/me"
                  className="flex items-center py-3 text-sm text-gray-700 font-semibold hover:text-sky-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <img
                    src={
                      user?.profile?.avatar ||
                      "https://res.cloudinary.com/dqcyabvc2/image/upload/v1753019800/user_nxnpv1.webp"
                    }
                    alt="User Avatar"
                    className="w-6 h-6 rounded-full object-cover mr-3"
                  />
                  My Profile
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center py-3 text-sm text-gray-700 font-semibold hover:text-sky-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <ScrollText className="w-5 h-5 mr-3 text-gray-500" /> Order
                  History
                </Link>
                <div className="">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center py-3 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-sm py-3 font-semibold">
                <User className="w-5 h-5" />
                <Link href="/auth/login" className="hover:text-sky-600">
                  Sign In
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/auth/register" className="hover:text-sky-600">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {activeMainMenu && (
        <div
          className="hidden lg:block absolute top-full left-0 w-full"
          onMouseLeave={handleNavbarLeave}
        >
          <div className="bg-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-center space-x-6 xl:space-x-8 py-3 px-4">
              {dropdownData[activeMainMenu]?.categories.map((category) => {
                const categorySlug = categoryToSlug(category);
                const categoryRoute = `${getMainMenuRoute(
                  activeMainMenu
                )}/${categorySlug}`;
                return (
                  <Link
                    key={category}
                    href={categoryRoute}
                    className={`text-gray-600 font-semibold hover:text-sky-600 transition-colors duration-200 px-3 py-2 text-sm xl:text-base whitespace-nowrap`}
                    onMouseEnter={() => handleSubMenuEnter(category)}
                  >
                    {category}
                  </Link>
                );
              })}
            </div>
          </div>
          {activeSubMenu && (
            <div className="w-full bg-white text-gray-800 shadow">
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
                                      <Link href="/">
                                        <div className="absolute top-3 left-3 text-sm font-medium opacity-90">
                                          reluv
                                        </div>
                                      </Link>
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
    </header>
  );
};

export default Navbar;
