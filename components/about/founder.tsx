import Image from "next/image";
import { MapPin, Calendar, Award } from "lucide-react";

export default function Founder() {
  return (
    <section className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-lg p-8 lg:p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Meet Our Founder
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Visionary leadership driving agricultural innovation in Nigeria
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <div className="relative w-64 h-64 mx-auto lg:mx-0 mb-6">
            <Image
              src="/images/founder.jpg"
              alt="FAM 8 Founder - Agricultural Innovation Leader"
              width={256}
              height={256}
              className="rounded-full object-cover shadow-lg"
              priority
            />
            <div className="absolute -bottom-4 -right-4 bg-green-600 text-white p-3 rounded-full shadow-lg">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Uthman Giwa
            </h3>
            <p className="text-xl text-green-600 font-semibold mb-4">
              Founder & CEO
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>Lagos, Nigeria</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-5 h-5 text-green-600" />
              <span>15+ years in Agricultural Technology</span>
            </div>
          </div>

          <div className="prose prose-lg text-gray-700">
            <p className="mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
              pariatur corrupti beatae doloremque, maxime sapiente accusantium
              labore atque unde minima architecto repellat sed voluptate
              perspiciatis numquam dignissimos laboriosam eaque illum.
            </p>
            <p className="mb-4">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos rem
              animi deleniti. Eveniet sunt obcaecati exercitationem, omnis dolor
              repellendus animi at nisi
            </p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Labore
              quae numquam nobis, dignissimos possimus sequi itaque iste minus
              asperiores, quasi cum! Unde eligendi sit earum nostrum mollitia
              nisi temporibus fugit?
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Key Achievements
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Founded 3 successful agtech startups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>
                  Awarded &quot;Agricultural Innovator of the Year&quot; 2023
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>
                  Facilitated over ₦5 billion in agricultural investments
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
