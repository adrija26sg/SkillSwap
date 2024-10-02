import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getSkillProgress,
  getTimeBalance,
} from "../services/skillExchangeService";
import { getUserProgress } from "../services/progressService";

function ProgressDashboard() {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState({});
  const [timeBalance, setTimeBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const [skillProgress, balance] = await Promise.all([
        getSkillProgress(currentUser.uid),
        getTimeBalance(currentUser.uid),
      ]);
      setProgress(skillProgress);
      setTimeBalance(balance);
    } catch (err) {
      setError("Failed to load progress");
      console.error("Error loading progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

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
      <h2 className="text-2xl font-bold mb-6">Learning Progress</h2>

      {/* Time Balance */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Time Balance</h3>
        <div className="flex items-center">
          <div className="text-3xl font-bold text-blue-500">{timeBalance}</div>
          <div className="ml-2 text-gray-500">hours</div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Earn more hours by teaching others!
        </p>
      </div>

      {/* Skills Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Skills Progress</h3>
        <div className="space-y-6">
          {Object.entries(progress).map(([skill, data]) => (
            <div
              key={skill}
              className="border-b border-gray-200 pb-4 last:border-0"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-medium">{skill}</h4>
                <span className="text-sm text-gray-500">
                  {data.level || "Beginner"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${data.progress || 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{data.hoursLearned || 0} hours learned</span>
                <span>{data.sessionsCompleted || 0} sessions completed</span>
              </div>
            </div>
          ))}
        </div>

        {Object.keys(progress).length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No skills in progress yet. Start learning by finding a mentor!
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentUser.achievements?.map((achievement, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{achievement.icon}</div>
              <h4 className="font-medium">{achievement.title}</h4>
              <p className="text-sm text-gray-500">{achievement.description}</p>
            </div>
          ))}
        </div>

        {!currentUser.achievements?.length && (
          <div className="text-center text-gray-500 py-8">
            No achievements yet. Keep learning to earn badges!
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressDashboard;
