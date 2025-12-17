"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Search, Filter, Star, MessageSquare, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { toast } from "sonner";
import { format } from "date-fns";

interface Review {
  id: number;
  rating: number;
  comment: string;
  productName: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  isVerified: boolean;
  helpfulCount: number;
  reply?: string;
  images?: string[];
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const fetchReviews = async () => {
    try {
      setRefreshing(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockReviews: Review[] = [
        {
          id: 1,
          rating: 5,
          comment: "Amazing product! The quality exceeded my expectations. Highly recommended!",
          productName: "Nike Air Max 90",
          authorName: "John Doe",
          createdAt: new Date().toISOString(),
          isVerified: true,
          helpfulCount: 12,
          images: [],
        },
        {
          id: 2,
          rating: 4,
          comment: "Good quality, fast shipping. Will buy again!",
          productName: "Adidas Ultraboost",
          authorName: "Jane Smith",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          isVerified: true,
          helpfulCount: 8,
          reply: "Thank you for your feedback! We're glad you enjoyed our product.",
        },
        {
          id: 3,
          rating: 3,
          comment: "Product is okay, but shipping took longer than expected.",
          productName: "Puma Hoodie",
          authorName: "Bob Wilson",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          isVerified: false,
          helpfulCount: 3,
        },
        {
          id: 4,
          rating: 5,
          comment: "Perfect! Exactly as described. Love it!",
          productName: "Vintage Denim Jacket",
          authorName: "Alice Brown",
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          isVerified: true,
          helpfulCount: 15,
        },
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    let filtered = [...reviews];

    if (searchQuery) {
      filtered = filtered.filter((review) =>
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (ratingFilter !== "all") {
      filtered = filtered.filter((review) => review.rating === parseInt(ratingFilter));
    }

    if (statusFilter === "replied") {
      filtered = filtered.filter((review) => review.reply);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter((review) => !review.reply);
    }

    setFilteredReviews(filtered);
  }, [reviews, searchQuery, ratingFilter, statusFilter]);

  const handleReply = async (reviewId: number) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, reply: replyText } : r
      ));
      toast.success("Reply posted successfully");
      setReplyingTo(null);
      setReplyText("");
    } catch (error) {
      toast.error("Failed to post reply");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: reviews.length,
    average: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0,
    pending: reviews.filter((r) => !r.reply).length,
    replied: reviews.filter((r) => r.reply).length,
  };

  const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) => {
    const colorClasses = {
      blue: "bg-gradient-to-br from-sky-500 to-blue-600",
      yellow: "bg-gradient-to-br from-yellow-500 to-orange-600",
      green: "bg-gradient-to-br from-green-500 to-emerald-600",
      purple: "bg-gradient-to-br from-purple-500 to-pink-600",
    }[color] || "bg-gray-500";

    return (
      <Card className="glossy-card hover:shadow-lg transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl ${colorClasses} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white glossy-text-title">
            Reviews
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer reviews and feedback
          </p>
        </div>
        <button
          onClick={fetchReviews}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Reviews" value={stats.total} icon={MessageSquare} color="blue" />
        <StatCard label="Average Rating" value={stats.average.toFixed(1)} icon={Star} color="yellow" />
        <StatCard label="Pending Reply" value={stats.pending} icon={MessageSquare} color="purple" />
        <StatCard label="Replied" value={stats.replied} icon={ThumbsUp} color="green" />
      </div>

      {/* Main Content */}
      <Card className="glossy-card">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all font-medium ${
                showFilters 
                  ? 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-900/20 dark:border-sky-800 dark:text-sky-300'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                  Rating
                </label>
                <Select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                  Status
                </label>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Reviews</option>
                  <option value="pending">Pending Reply</option>
                  <option value="replied">Replied</option>
                </Select>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No reviews found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.authorAvatar} />
                      <AvatarFallback>{review.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{review.authorName}</h4>
                            {review.isVerified && (
                              <Badge variant="success" className="text-xs">Verified</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            {renderStars(review.rating)}
                            <span>•</span>
                            <span>{format(new Date(review.createdAt), "MMM dd, yyyy")}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{review.productName}</Badge>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <button className="flex items-center gap-1 hover:text-sky-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{review.helpfulCount} helpful</span>
                        </button>
                      </div>

                      {review.reply && (
                        <div className="mt-4 pl-4 border-l-2 border-sky-500 bg-sky-50 dark:bg-sky-900/20 p-4 rounded-r-lg">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Store Reply:</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{review.reply}</p>
                        </div>
                      )}

                      {!review.reply && replyingTo !== review.id && (
                        <button
                          onClick={() => setReplyingTo(review.id)}
                          className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                        >
                          Reply to this review
                        </button>
                      )}

                      {replyingTo === review.id && (
                        <div className="mt-4 space-y-3">
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply..."
                            rows={3}
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReply(review.id)}
                              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium"
                            >
                              Post Reply
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
