import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  findSkillMatches,
  createTimeExchange,
} from "../services/skillExchangeService";
import { formatDistanceToNow } from "date-fns";
import { getSkills } from "../services/skillService";

function SkillDiscovery() {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [duration, setDuration] = useState(1);
  const [skills, setSkills] = useState([]);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await getSkills();
      setSkills(data);
    } catch (err) {
      setError("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const potentialMatches = await findSkillMatches(currentUser.uid);
      setMatches(potentialMatches);
    } catch (err) {
      setError("Failed to load skill matches");
      console.error("Error loading matches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestExchange = async (teacherId, skill) => {
    try {
      await createTimeExchange(teacherId, currentUser.uid, skill, duration);
      // Refresh matches after creating exchange
      loadMatches();
    } catch (err) {
      setError("Failed to request skill exchange");
      console.error("Error requesting exchange:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Discover Skills</h2>

      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Skills</option>
          {skills.map((skill) => (
            <option key={skill.name} value={skill.name}>
              {skill.name}
            </option>
          ))}
        </select>

        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={1}>1 hour</option>
          <option value={2}>2 hours</option>
          <option value={3}>3 hours</option>
        </select>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches
          .filter(
            (match) => !selectedSkill || match.matchingSkill === selectedSkill
          )
          .map((match) => (
            <div
              key={match.userId}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {match.name?.charAt(0) || "?"}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{match.name}</h3>
                  <p className="text-sm text-gray-500">
                    Teaching: {match.matchingSkill}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {match.bio || "No bio available"}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                    Rating: {match.rating || "No ratings yet"}
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleRequestExchange(match.userId, match.matchingSkill)
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Request Exchange
                </button>
              </div>
            </div>
          ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No skill matches found. Try adding more skills you want to learn!
        </div>
      )}
    </div>
  );
}

export default SkillDiscovery;
