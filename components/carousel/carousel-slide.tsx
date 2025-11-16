import { CarouselSlideProps } from "@/types/carousel";
import Image from "next/image";
import Link from "next/link";

export default function CarouselSlide({ item, isActive }: CarouselSlideProps) {
  return (
    <div className="w-full flex-shrink-0">
      <div className="relative h-[300px] sm:h-[400px] md:h-[450px]">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover"
          priority={isActive}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            {item.title}
          </h2>
          <p className="text-sm md:text-base line-clamp-2">
            {item.description}
          </p>
          {item.link && (
            <Link
              href={item.link}
              className="mt-3 inline-block bg-[#1E7B47] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-[#145C33] transition-all duration-200 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Learn More
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
