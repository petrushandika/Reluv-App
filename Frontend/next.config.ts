import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/women",
        destination: "/main/women",
      },
      {
        source: "/men",
        destination: "/main/men",
      },
      {
        source: "/kids",
        destination: "/main/kids",
      },
      {
        source: "/brands",
        destination: "/main/brands",
      },
      {
        source: "/sell",
        destination: "/main/sell",
      },
      {
        source: "/cart",
        destination: "/main/cart",
      },
      {
        source: "/wishlist",
        destination: "/main/wishlist",
      },
      {
        source: "/checkout",
        destination: "/main/checkout",
      },
      {
        source: "/product/:id",
        destination: "/main/product/:id",
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/main/women",
        destination: "/women",
        permanent: true,
      },
      {
        source: "/main/men",
        destination: "/men",
        permanent: true,
      },
      {
        source: "/main/kids",
        destination: "/kids",
        permanent: true,
      },
      {
        source: "/main/brands",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/main/sell",
        destination: "/sell",
        permanent: true,
      },
      {
        source: "/main/cart",
        destination: "/cart",
        permanent: true,
      },
      {
        source: "/main/wishlist",
        destination: "/wishlist",
        permanent: true,
      },
      {
        source: "/main/checkout",
        destination: "/checkout",
        permanent: true,
      },
      {
        source: "/main/product/:id",
        destination: "/product/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
