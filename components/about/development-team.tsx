import Image from "next/image";
import { Code, Database } from "lucide-react";

export default function DevelopmentTeam() {
  const teamMembers = [
    {
      name: "Quadri Alarape",
      role: "Lead Developer",
      icon: <Code className="w-6 h-6" />,
      image: "/images/team/quadri.jpg",
      bio: "Full-stack developer with 3+ years experience in fintech and agtech solutions.",
      skills: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"],
    },
    {
      name: "Iremide Giwa",
      role: "Testing",
      icon: <Database className="w-6 h-6" />,
      image: "/images/team/ire.jpg",
      bio: "xoxoxoxoxoxoxox",
      skills: [, "xoxo", "xoxoxo", "xoxoxoxox"],
    },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Our Development Team
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Meet the talented professionals who bring FAM 8 to life with
          cutting-edge technology and innovative solutions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="group bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image
                  src={member.image}
                  alt={`${member.name} - ${member.role} at FAM 8`}
                  width={96}
                  height={96}
                  className="rounded-full object-cover shadow-md"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-600 text-white p-2 rounded-full shadow-lg">
                  {member.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-green-600 font-semibold mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {member.bio}
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  Key Skills
                </h4>
                <div className="flex flex-wrap gap-1 justify-center">
                  {member.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Why Our Team Matters</h3>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto">
            Our diverse team combines deep technical expertise with agricultural
            knowledge, ensuring that FAM 8 delivers secure, scalable, and
            user-friendly solutions that meet the unique needs of Nigerian
            agricultural investors.
          </p>
        </div>
      </div>
    </section>
  );
}
