import React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

function SkillsSection({ skills }) {
  const getVerificationIcon = (status) => {
    switch (status) {
      case "verified":
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-400" />;
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      case "intermediate":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
      case "advanced":
        return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
      case "expert":
        return "bg-red-500/20 text-red-300 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-blue-800/80 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/20 p-6 mb-6 transition-all duration-300 hover:shadow-blue-500/10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Skills
        </span>
      </h2>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="border-b border-blue-500/20 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-white">
                    {skill.name}
                  </h3>
                  <span
                    className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(
                      skill.level
                    )}`}
                  >
                    {skill.level}
                  </span>
                </div>
                <p className="text-gray-400 mt-1">{skill.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getVerificationIcon(skill.verificationStatus)}
                <span className="text-sm text-gray-400">
                  {skill.verificationStatus === "verified"
                    ? "Verified"
                    : skill.verificationStatus === "pending"
                    ? "Pending Verification"
                    : "Verification Failed"}
                </span>
              </div>
            </div>

            {skill.certifications && skill.certifications.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-300">
                  Certifications
                </h4>
                <ul className="mt-1 space-y-1">
                  {skill.certifications.map((cert, certIndex) => (
                    <li
                      key={certIndex}
                      className="flex items-center text-sm text-gray-400"
                    >
                      <CheckCircleIcon className="h-4 w-4 text-green-400 mr-1" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {skill.experience && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-300">
                  Experience
                </h4>
                <p className="text-sm text-gray-400">{skill.experience}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
          Add Skill
        </button>
      </div>
    </div>
  );
}

export default SkillsSection;
