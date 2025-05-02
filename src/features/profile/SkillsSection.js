import React, { useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

function SkillsSection({ skills, onAddSkill, onRemoveSkill }) {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "Intermediate",
    description: "",
    verificationStatus: "pending",
    certifications: [],
    experience: "",
  });
  const [newCertification, setNewCertification] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSkill((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setNewSkill((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (index) => {
    setNewSkill((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddSkill(newSkill);
    setNewSkill({
      name: "",
      level: "Intermediate",
      description: "",
      verificationStatus: "pending",
      certifications: [],
      experience: "",
    });
    setIsAddingSkill(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-blue-900/50 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/20 p-6 mb-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 mr-3 text-blue-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
              clipRule="evenodd"
            />
          </svg>
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            My Skills
          </span>
        </h2>
        {!isAddingSkill && skills && skills.length > 0 && (
          <div className="bg-blue-900/30 px-3 py-1 rounded-full">
            <span className="text-blue-300 text-sm">
              {skills.length} skills
            </span>
          </div>
        )}
      </div>

      {isAddingSkill ? (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-gray-800/70 p-6 rounded-xl border border-blue-500/30 shadow-lg"
        >
          <h3 className="text-xl font-medium text-white mb-4 flex items-center">
            <PlusIcon className="h-5 w-5 mr-2 text-blue-400" />
            Add New Skill
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Skill Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newSkill.name}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                required
                placeholder="e.g., JavaScript, UI Design, Marketing"
              />
            </div>

            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Skill Level
              </label>
              <select
                id="level"
                name="level"
                value={newSkill.level}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newSkill.description}
                onChange={handleChange}
                rows="3"
                className="block w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                placeholder="Describe your skill and what you can teach others..."
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Experience
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={newSkill.experience}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                placeholder="e.g., 2 years of professional experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Certifications
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  className="block w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-l-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="Add certification or credential"
                />
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-500 transition-colors duration-300"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {newSkill.certifications.length > 0 && (
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Added Certifications
              </h4>
              <ul className="space-y-2">
                {newSkill.certifications.map((cert, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm text-gray-300 bg-gray-700/50 px-4 py-2 rounded-lg"
                  >
                    <span className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                      {cert}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCertification(index)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-300"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex space-x-4">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Skill
            </button>
            <button
              type="button"
              onClick={() => setIsAddingSkill(false)}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills && skills.length > 0 ? (
            skills.map((skill, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-md rounded-xl p-5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-white group-hover:text-blue-300 transition-colors duration-300">
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
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-gray-700/50 rounded-full px-2 py-1">
                      {getVerificationIcon(skill.verificationStatus)}
                      <span className="text-xs text-gray-300">
                        {skill.verificationStatus === "verified"
                          ? "Verified"
                          : skill.verificationStatus === "pending"
                          ? "Pending"
                          : "Failed"}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveSkill(skill.name)}
                      className="text-gray-400 hover:text-red-400 p-1 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                      title="Remove skill"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {skill.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {skill.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  {skill.experience && (
                    <div className="bg-gray-700/30 rounded-lg px-3 py-1.5 text-xs text-gray-300 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-blue-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {skill.experience}
                    </div>
                  )}

                  {skill.certifications && skill.certifications.length > 0 && (
                    <div className="bg-gray-700/30 rounded-lg px-3 py-1.5 text-xs text-gray-300 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                      {skill.certifications.length}{" "}
                      {skill.certifications.length === 1
                        ? "certification"
                        : "certifications"}
                    </div>
                  )}
                </div>

                {skill.certifications && skill.certifications.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700/50 hidden group-hover:block">
                    <h4 className="text-xs font-medium text-gray-300 mb-1">
                      Certifications
                    </h4>
                    <ul className="space-y-1">
                      {skill.certifications.map((cert, certIndex) => (
                        <li
                          key={certIndex}
                          className="flex items-center text-xs text-gray-400"
                        >
                          <CheckCircleIcon className="h-3 w-3 text-green-400 mr-1 flex-shrink-0" />
                          <span className="truncate">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-blue-500/20 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Skills Added Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Add your first skill to start teaching and connecting with
                others.
              </p>
            </div>
          )}
        </div>
      )}

      {!isAddingSkill && (
        <div className="mt-6">
          <button
            onClick={() => setIsAddingSkill(true)}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Skill
          </button>
        </div>
      )}
    </div>
  );
}

export default SkillsSection;
