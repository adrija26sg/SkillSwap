import React, { useState } from "react";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

function AvailabilityCalendar({ availability }) {
  const [selectedDay, setSelectedDay] = useState(null);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timeSlots = [
    "Morning (6am-12pm)",
    "Afternoon (12pm-5pm)",
    "Evening (5pm-10pm)",
    "Night (10pm-6am)",
  ];

  const handleTimeSlotToggle = (day, timeSlot) => {
    // This would be connected to a state management solution in a real app
    console.log(`Toggled ${timeSlot} for ${day}`);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-blue-800/80 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/20 p-6 mb-6 transition-all duration-300 hover:shadow-blue-500/10">
      <div className="flex items-center mb-4">
        <CalendarIcon className="h-5 w-5 text-blue-400 mr-2" />
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Availability
          </span>
        </h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-400">
          Set your availability for skill exchange sessions. Select the time
          slots when you're available.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-500/20">
          <thead className="bg-gray-700/50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Day
              </th>
              {timeSlots.map((slot, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800/50 divide-y divide-blue-500/20">
            {days.map((day, dayIndex) => (
              <tr
                key={dayIndex}
                className={selectedDay === day ? "bg-blue-900/30" : ""}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {day}
                </td>
                {timeSlots.map((slot, slotIndex) => {
                  const isAvailable =
                    availability &&
                    availability[day] &&
                    availability[day].includes(slot);

                  return (
                    <td
                      key={slotIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-400"
                    >
                      <button
                        onClick={() => handleTimeSlotToggle(day, slot)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isAvailable
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                            : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50"
                        }`}
                      >
                        {isAvailable ? "✓" : ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-400">
          <ClockIcon className="h-4 w-4 mr-1 text-blue-400" />
          <span>All times are in your local timezone</span>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
          Save Availability
        </button>
      </div>
    </div>
  );
}

export default AvailabilityCalendar;
