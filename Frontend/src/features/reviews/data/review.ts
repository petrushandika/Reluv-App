import { Review } from "../types";

export const reviews: Review[] = [
  {
    id: 1,
    rating: 5,
    comment: "Their service very good and thats why I came back to buy from Reluv again.",
    images: [],
    editCount: 0,
    createdAt: new Date("2025-03-01").toISOString(),
    updatedAt: new Date("2025-03-01").toISOString(),
    author: {
      id: 1,
      firstName: "Andri",
      lastName: "Rianto",
      profile: {
        avatar: "https://i.pravatar.cc/40?u=1",
      },
    },
  },
  {
    id: 2,
    rating: 5,
    comment: "Thanks Reluv, sudah beberapa kali belanja di Reluv, koleksinya lengkap, harganya bagus, pelayanan customer care onlinenya juga ramah dan memuaskan.",
    images: [],
    editCount: 0,
    createdAt: new Date("2025-02-15").toISOString(),
    updatedAt: new Date("2025-02-15").toISOString(),
    author: {
      id: 2,
      firstName: "Yudist",
      lastName: "Ardhana",
      profile: {
        avatar: "https://i.pravatar.cc/40?u=2",
      },
    },
  },
  {
    id: 3,
    rating: 5,
    comment: "First time making a purchase here and everything was great, from hospitality all the way to the packaging and delivery of the purchased item. Recommended.",
    images: [],
    editCount: 0,
    createdAt: new Date("2025-02-10").toISOString(),
    updatedAt: new Date("2025-02-10").toISOString(),
    author: {
      id: 3,
      firstName: "Rick",
      lastName: "Khoendarto",
      profile: {
        avatar: "https://i.pravatar.cc/40?u=3",
      },
    },
  },
  {
    id: 4,
    rating: 5,
    comment: "Great selection of items, and I'm always very impressed by the customer service. Replies are very fast and seamless. Highly recommended!",
    images: [],
    editCount: 0,
    createdAt: new Date("2025-01-20").toISOString(),
    updatedAt: new Date("2025-01-20").toISOString(),
    author: {
      id: 4,
      firstName: "Carolyn",
      lastName: "Marsing",
      profile: {
        avatar: "https://i.pravatar.cc/40?u=4",
      },
    },
  },
  {
    id: 5,
    rating: 5,
    comment: "A fantastic online shopping experience. The website is easy to navigate and my order arrived faster than I expected. Will definitely shop here again.",
    images: [],
    editCount: 0,
    createdAt: new Date("2025-01-05").toISOString(),
    updatedAt: new Date("2025-01-05").toISOString(),
    author: {
      id: 5,
      firstName: "Jane",
      lastName: "Doe",
      profile: {
        avatar: "https://i.pravatar.cc/40?u=5",
      },
    },
  },
];

