"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Testimonial {
  id: string;
  comment: string;
  rating: number;
  investorName: string;
  location: string;
  createdAt: Date;
  createdByUser: {
    name: string | null;
    image: string | null;
  } | null;
}

interface TestimonialsGridProps {
  testimonials: Testimonial[];
}

export default function TestimonialsGrid({ testimonials }: TestimonialsGridProps) {
  if (testimonials.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg">
          No testimonials yet. Be the first to share your story!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="hover:shadow-xl transition-shadow duration-300 border-green-100">
            <CardContent className="p-6">
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-[#1E7B47] opacity-50" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 line-clamp-6">
                {testimonial.comment}
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {testimonial.createdByUser?.image ? (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.createdByUser.image}
                      alt={testimonial.investorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-[#1E7B47] flex items-center justify-center text-white font-semibold">
                    {testimonial.investorName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.investorName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.location} • {formatDistanceToNow(new Date(testimonial.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
