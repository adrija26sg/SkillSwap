import React, { useState } from "react";

function SkillExchange() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data for demonstration
  const skills = [
    {
      id: 1,
      name: "Web Development",
      category: "Technology",
      user: "John Doe",
      rating: 4.8,
      availability: "Weekends",
      description: "Expert in React, Node.js, and full-stack development.",
    },
    {
      id: 2,
      name: "Spanish Language",
      category: "Languages",
      user: "Maria Garcia",
      rating: 4.9,
      availability: "Evenings",
      description: "Native speaker offering conversational Spanish practice.",
    },
    {
      id: 3,
      name: "Photography",
      category: "Arts",
      user: "Alex Chen",
      rating: 4.7,
      availability: "Flexible",
      description:
        "Professional photographer teaching composition and editing.",
    },
  ];

  const categories = [
    "all",
    "Technology",
    "Languages",
    "Arts",
    "Music",
    "Sports",
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Find Skills to Exchange</h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {skill.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">Teacher:</span>
                    <span className="ml-2">{skill.user}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">Rating:</span>
                    <span className="ml-2">{skill.rating}/5.0</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">Availability:</span>
                    <span className="ml-2">{skill.availability}</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                  Request Exchange
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkillExchange;
