import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import SkillsSection from "./SkillsSection";
import PortfolioSection from "./PortfolioSection";
import AvailabilityCalendar from "./AvailabilityCalendar";

function EnhancedProfile() {
  // Mock user data - in a real app, this would come from an API or context
  const [user] = useState({
    name: "John Doe",
    location: "New York, NY",
    rating: 4.8,
    reviews: 12,
    verified: true,
    avatar: null,
  });

  const [completionPercentage] = useState(75);

  const [skills] = useState([
    {
      name: "Web Development",
      level: "Expert",
      description:
        "Full-stack web development with React, Node.js, and MongoDB",
      verificationStatus: "verified",
      certifications: [
        "AWS Certified Developer",
        "React Advanced Certification",
      ],
      experience: "5+ years of professional experience",
    },
    {
      name: "Spanish Language",
      level: "Advanced",
      description:
        "Native-like fluency in Spanish with focus on business communication",
      verificationStatus: "pending",
      certifications: ["DELE C1"],
      experience: "Studied abroad in Spain for 1 year",
    },
    {
      name: "Photography",
      level: "Intermediate",
      description: "Portrait and landscape photography",
      verificationStatus: "rejected",
      certifications: [],
      experience: "Self-taught with 2 years of practice",
    },
  ]);

  const [portfolio] = useState([
    {
      title: "E-commerce Website",
      description:
        "A full-stack e-commerce platform built with React and Node.js",
      type: "image",
      url: "https://example.com/portfolio/ecommerce",
      tags: ["React", "Node.js", "MongoDB"],
      date: "Jan 2023",
    },
    {
      title: "Spanish Language Certificate",
      description: "DELE C1 certification in Spanish language proficiency",
      type: "document",
      url: "https://example.com/portfolio/spanish-cert",
      tags: ["Spanish", "Language", "Certification"],
      date: "Mar 2022",
    },
    {
      title: "Photography Portfolio",
      description: "Collection of landscape and portrait photographs",
      type: "link",
      url: "https://example.com/portfolio/photography",
      tags: ["Photography", "Landscape", "Portrait"],
      date: "Jun 2023",
    },
  ]);

  const [availability] = useState({
    Monday: ["Morning (6am-12pm)", "Evening (5pm-10pm)"],
    Wednesday: ["Afternoon (12pm-5pm)", "Evening (5pm-10pm)"],
    Friday: ["Morning (6am-12pm)", "Afternoon (12pm-5pm)"],
    Saturday: [
      "Morning (6am-12pm)",
      "Afternoon (12pm-5pm)",
      "Evening (5pm-10pm)",
    ],
  });

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your skills, portfolio, and availability
          </p>
        </div>

        <ProfileHeader
          user={user}
          completionPercentage={completionPercentage}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SkillsSection skills={skills} />
            <PortfolioSection portfolio={portfolio} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <AvailabilityCalendar availability={availability} />

            <div className="bg-gradient-to-br from-gray-800/80 to-blue-800/80 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/20 p-6 transition-all duration-300 hover:shadow-blue-500/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Learning Preferences
                </span>
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">
                    Preferred Learning Methods
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Online
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      In-Person
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-300">
                    Session Duration
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    1-2 hours per session
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-300">
                    Languages
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      English (Native)
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Spanish (Advanced)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                  Edit Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedProfile;
