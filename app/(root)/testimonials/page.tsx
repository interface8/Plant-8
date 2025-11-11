import { Suspense } from "react";
import prisma from "@/db/prisma";
import TestimonialsGrid from "@/components/testimonials/testimonials-grid";
import TestimonialSubmissionForm from "@/components/testimonials/testimonial-submission-form";
import { LoadingSpinner } from "@/components/ui/loader";

export const revalidate = 60;

export default async function TestimonialsPage() {
  // Fetch all approved testimonials
  const testimonials = await prisma.testimony.findMany({
    where: {
      isApproved: true,
    },
    include: {
      createdByUser: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1E7B47] via-[#145C33] to-[#1E7B47] text-white py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Success Stories
            </h1>
            <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto">
              Read what our investors have to say about their journey with FAM 8.
              Real stories from real people making real returns.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <Suspense fallback={<LoadingSpinner />}>
        <TestimonialsGrid testimonials={testimonials} />
      </Suspense>

      {/* Submission Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Share Your Success Story
            </h2>
            <p className="text-gray-600">
              Have you invested with FAM 8? We'd love to hear about your experience!
            </p>
          </div>
          <TestimonialSubmissionForm />
        </div>
      </section>
    </div>
  );
}
