import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getUpcomingSessions,
  scheduleSession,
} from "../services/skillExchangeService";
import { format } from "date-fns";
import { getUserSessions } from "../services/sessionService";

function SessionScheduler() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getUserSessions(currentUser.uid);
      setSessions(data);
    } catch (err) {
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleScheduleSession = async (sessionId) => {
    try {
      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
      await scheduleSession(sessionId, scheduledDateTime);
      loadSessions(); // Refresh sessions after scheduling
    } catch (err) {
      setError("Failed to schedule session");
      console.error("Error scheduling session:", err);
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
      <h2 className="text-2xl font-bold mb-6">Learning Sessions</h2>

      {/* Upcoming Sessions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Upcoming Sessions</h3>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold">{session.skill}</h4>
                  <p className="text-sm text-gray-500">
                    {session.teacherId === currentUser.uid
                      ? "Teaching"
                      : "Learning"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Duration: {session.duration} hour(s)
                  </p>
                  {session.scheduledFor && (
                    <p className="text-sm text-gray-500">
                      Scheduled for:{" "}
                      {format(new Date(session.scheduledFor), "PPP p")}
                    </p>
                  )}
                </div>
                {!session.scheduledFor && (
                  <div className="flex space-x-4">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-1"
                    />
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-1"
                    />
                    <button
                      onClick={() => handleScheduleSession(session.id)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                    >
                      Schedule
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {sessions.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No upcoming sessions. Start by finding someone to exchange skills
          with!
        </div>
      )}
    </div>
  );
}

export default SessionScheduler;
