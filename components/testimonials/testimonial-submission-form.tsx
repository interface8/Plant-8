"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function TestimonialSubmissionForm() {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Please write your testimonial");
      return;
    }

    if (content.trim().length < 20) {
      toast.error("Testimonial must be at least 20 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: content.trim(), 
          rating,
          location: location.trim() || undefined 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit testimonial");
      }

      toast.success("Testimonial submitted! It will be reviewed by our team.");
      setContent("");
      setLocation("");
      setRating(5);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-green-200">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate Your Experience
            </label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Location (Optional)
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Lagos, Abuja, Port Harcourt..."
              maxLength={100}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Testimonial
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience with FAM 8... What did you like? How was your investment journey? Would you recommend us to others?"
              rows={6}
              className="resize-none"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {content.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E7B47] hover:bg-[#145C33]"
          >
            {loading ? "Submitting..." : "Submit Testimonial"}
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Your testimonial will be reviewed before being published.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
