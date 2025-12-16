export interface Review {
  id: number;
  rating: number;
  comment?: string;
  images: string[];
  reply?: string;
  editCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    firstName?: string;
    lastName?: string;
    profile?: {
      avatar?: string;
    };
  };
  replyAuthor?: {
    id: number;
    firstName?: string;
    lastName?: string;
    profile?: {
      avatar?: string;
    };
  };
}

export interface CreateReviewData {
  rating: number;
  comment?: string;
  images?: string[];
  orderId?: number;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
  images?: string[];
}

export interface ReplyReviewData {
  reply: string;
}
