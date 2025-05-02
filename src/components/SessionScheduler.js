import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { scheduleSession } from "../services/skillExchangeService";
import { format } from "date-fns";
import { getUserSessions, getSessionDetails } from "../services/sessionService";

function SessionScheduler() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionDates, setSessionDates] = useState({});
  const [sessionTimes, setSessionTimes] = useState({});

  // Use useCallback to memoize the function
  const loadSessions = useCallback(async () => {
    if (!currentUser?.uid) {
      console.log("No current user, skipping session loading");
      return;
    }

    try {
      setLoading(true);
      console.log("Loading sessions for user:", currentUser.uid);
      const data = await getUserSessions(currentUser.uid);
      console.log("Loaded sessions:", data);
      setSessions(data || []);
    } catch (err) {
      console.error("Error loading sessions:", err);
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleDateChange = (sessionId, date) => {
    setSessionDates((prev) => ({
      ...prev,
      [sessionId]: date,
    }));
  };

  const handleTimeChange = (sessionId, time) => {
    setSessionTimes((prev) => ({
      ...prev,
      [sessionId]: time,
    }));
  };

  const handleScheduleSession = async (sessionId) => {
    try {
      const date = sessionDates[sessionId];
      const time = sessionTimes[sessionId];

      if (!date || !time) {
        setError("Please select both date and time");
        return;
      }

      const scheduledDateTime = new Date(`${date}T${time}`);

      if (isNaN(scheduledDateTime.getTime())) {
        setError("Invalid date or time format");
        return;
      }

      console.log("Scheduling session:", sessionId, "for", scheduledDateTime);
      await scheduleSession(sessionId, scheduledDateTime);

      // Refresh sessions after scheduling
      await loadSessions();
    } catch (err) {
      console.error("Error scheduling session:", err);
      setError("Failed to schedule session: " + err.message);
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
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => {
            setError(null);
            loadSessions();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Separate pending and scheduled sessions
  const pendingSessions = sessions.filter((session) => !session.scheduledFor);
  const scheduledSessions = sessions.filter((session) => session.scheduledFor);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Learning Sessions</h2>

      {/* Pending Sessions */}
      {pendingSessions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Pending Sessions</h3>
          <div className="space-y-4">
            {pendingSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
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
                    <p className="text-sm text-gray-500">
                      Status: {session.status}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 w-full md:w-auto">
                    <input
                      type="date"
                      value={sessionDates[session.id] || ""}
                      onChange={(e) =>
                        handleDateChange(session.id, e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 w-full"
                    />
                    <input
                      type="time"
                      value={sessionTimes[session.id] || ""}
                      onChange={(e) =>
                        handleTimeChange(session.id, e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 w-full"
                    />
                    <button
                      onClick={() => handleScheduleSession(session.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Sessions */}
      {scheduledSessions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Upcoming Sessions</h3>
          <div className="space-y-4">
            {scheduledSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
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
                    <p className="text-sm text-gray-500">
                      Status: {session.status}
                    </p>
                    {session.scheduledFor && (
                      <p className="text-sm font-medium text-green-600 mt-2">
                        Scheduled for:{" "}
                        {format(new Date(session.scheduledFor), "PPP 'at' p")}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p className="mb-4">
            No sessions found. Start by finding someone to exchange skills with!
          </p>
          <button
            onClick={() => (window.location.href = "/discover")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Discover Skills
          </button>
        </div>
      )}
    </div>
  );
}

export default SessionScheduler;
