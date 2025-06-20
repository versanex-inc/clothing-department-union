"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function GiveawayAnnouncement() {
  const [startDate, setStartDate] = useState("2025-06-18T00:00");
  const [endDate, setEndDate] = useState("2025-06-20T23:59");
  const [participantsStartDate, setParticipantsStartDate] =
    useState("2025-06-18T00:00");
  const [participantsEndDate, setParticipantsEndDate] =
    useState("2025-06-20T23:59");
  const [winners, setWinners] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [spinStatus, setSpinStatus] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [showDetails, setShowDetails] = useState({});
  const [filteredParticipants, setFilteredParticipants] = useState([]);

  useEffect(() => {
    fetch("/api/getgiveawayparticipants")
      .then((res) => res.json())
      .then((data) => {
        setParticipants(data);
        setFilteredParticipants(data); // Show all participants by default
        applyFilter(); // Apply initial filter with default dates
      });
    fetch("/api/giveawaywinners")
      .then((res) => res.json())
      .then((data) => setWinners(data));
    fetch("/api/giveawaylock")
      .then((res) => res.json())
      .then((data) => setIsLocked(data.isLocked));
  }, []);

  const spinWheel = () => {
    if (isLocked) return;
    setSpinStatus("Spinning...");
    const wheel = document.querySelector(".spin-wheel");
    if (!wheel) return;

    wheel.style.animation = "spin 4s ease-out";
    wheel.classList.add("glow");
    setTimeout(async () => {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const filteredParticipants = participants.filter((p) => {
        const pDate = new Date(p.date);
        const isAfterStart = !start || pDate >= start;
        const isBeforeEnd = !end || pDate <= end;
        return isAfterStart && isBeforeEnd;
      });
      if (filteredParticipants.length > 0) {
        const winner =
          filteredParticipants[
            Math.floor(Math.random() * filteredParticipants.length)
          ];
        await fetch("/api/giveawaywinners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            socialId: winner.socialId,
            name: winner.name,
            date: new Date().toISOString(),
          }),
        });
        setWinners((prevWinners) => [...prevWinners, winner]);
        setSpinStatus(winner.socialId); // Show only username
      } else {
        setSpinStatus("No participants");
      }
      wheel.style.transition = "transform 2s ease-out"; // Gradual stop
      wheel.style.animation = "none";
      wheel.classList.remove("glow");
      setTimeout(() => {
        wheel.style.transform = "rotate(0deg)"; // Reset to base position after stop
      }, 2000);
    }, 4000);
  };

  const toggleLock = async () => {
    const newLockedState = !isLocked;
    setIsLocked(newLockedState);
    await fetch("/api/giveawaylock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLocked: newLockedState }),
    });
  };

  const applyFilter = () => {
    const start = participantsStartDate
      ? new Date(participantsStartDate)
      : null;
    const end = participantsEndDate ? new Date(participantsEndDate) : null;
    if (start || end) {
      const filtered = participants.filter((p) => {
        const pDate = new Date(p.date);
        const isAfterStart = !start || pDate >= start;
        const isBeforeEnd = !end || pDate <= end;
        return isAfterStart && isBeforeEnd;
      });
      setFilteredParticipants(filtered);
    } else {
      setFilteredParticipants(participants); // Reset to all if no dates
    }
  };

  const toggleDetails = (id) => {
    setShowDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="w-full min-h-screen py-16 bg-black text-white">
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(4320deg); }
          }
          @keyframes glow {
            0% { box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00ffcc, 0 0 40px #00cccc; }
            50% { box-shadow: 0 0 20px #fff, 0 0 40px #fff, 0 0 60px #00ffcc, 0 0 80px #00cccc; }
            100% { box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00ffcc, 0 0 40px #00cccc; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .spin-wheel {
            transition: transform 0.1s;
            position: relative;
            overflow: hidden;
          }
          .spin-wheel.glow {
            animation: glow 2s ease-in-out infinite;
          }
          .spin-wheel:active {
            transform: scale(0.95);
          }
          .pulse {
            animation: pulse 2s infinite;
          }
          .pop {
            animation: pop 0.8s ease-out;
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }
          .text-shadow {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(0, 255, 204, 0.5);
          }
          .drop-shadow-lg {
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          }
        `}
      </style>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-center mb-12 uppercase tracking-widest text-gray-100 pop">
          Live Premium Giveaway Spin
        </h1>

        <div className="relative mb-8">
          <select
            onChange={(e) => {
              const section = e.target.value;
              if (section) {
                const element = document.getElementById(section);
                if (element) {
                  const offset = 100;
                  const elementPosition =
                    element.getBoundingClientRect().top + window.scrollY;
                  window.scrollTo({
                    top: elementPosition - offset,
                    behavior: "smooth",
                  });
                }
              }
            }}
            className="w-full md:w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-300 font-medium appearance-none bg-[url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22><path stroke=%22%23D1D5DB%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M6 8l4 4 4-4%22/></svg>')] bg-no-repeat bg-right-2 bg-center text-sm"
          >
            <option value="" className="text-gray-500">
              Jump to Section
            </option>
            <option value="giveaway-spin">Spin Section</option>
            <option value="winner-history">Winner History</option>
            <option value="participants-data">Participants Data</option>
          </select>
        </div>

        <div id="giveaway-spin" className="mb-12 text-center">
          <div className="mb-6">
            <label className="text-gray-400 mr-3 font-semibold">
              Lock Giveaways:
            </label>
            <input
              type="checkbox"
              checked={isLocked}
              onChange={toggleLock}
              className="mr-2 h-5 w-5 accent-gray-600 focus:ring-2 focus:ring-gray-500"
            />
            <span className="text-gray-500">
              {isLocked ? "Locked" : "Unlocked"}
            </span>
          </div>

          <div
            className="spin-wheel w-72 h-72 sm:w-80 sm:h-80 border-8 border-gray-800 rounded-full mx-auto relative overflow-hidden pulse"
            onClick={spinWheel}
            style={{
              background:
                "conic-gradient(from 0deg, #0d1b2a 0%, #1b263b 25%, #0d1b2a 50%, #415a77 75%, #0d1b2a 100%)",
            }}
          >
            <div className="absolute inset-2 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-bold text-white text-shadow drop-shadow-lg">
                {spinStatus ||
                  (winners.length > 0
                    ? winners[winners.length - 1].socialId
                    : "Click to Spin!")}
              </span>
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-600 rounded-full mt-2"></div>
          </div>
          <div className="mt-6 flex flex-col items-center justify-center space-y-4">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div>
                <label className="block text-sm sm:text-base text-gray-400 mb-2">
                  Spin Start Date
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 sm:p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-white text-sm w-full sm:w-44"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base text-gray-400 mb-2">
                  Spin End Date
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 sm:p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-white text-sm w-full sm:w-44"
                />
              </div>
            </div>
            <button
              onClick={spinWheel}
              className="mt-4 w-full sm:w-auto px-10 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg"
            >
              Spin
            </button>
          </div>
          {spinStatus && (
            <p className="mt-4 text-lg sm:text-xl font-semibold text-teal-400 animate-pulse">
              {spinStatus}
            </p>
          )}
        </div>

        <div id="winner-history" className="mb-12">
          <div className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-800">
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold mb-6 text-gray-200 text-center">
              Winner History
            </h2>
            <div className="space-y-4">
              {winners.length > 0 ? (
                winners.map((winner, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex justify-between items-center animate-fade-in"
                  >
                    <span className="text-gray-200 font-medium text-sm">
                      {winner.socialId}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(winner.date).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center text-sm">
                  No winners recorded yet.
                </p>
              )}
              {winners.length >= 3 && (
                <button className="mt-4 w-full py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                  See More
                </button>
              )}
            </div>
          </div>
        </div>

        <div id="participants-data" className="">
          <div className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-800">
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold mb-6 text-gray-200 text-center">
              Participants Data
            </h2>

            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-6 justify-center mb-4">
              <div>
                <label className="block text-sm sm:text-base text-gray-400 mb-2">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={participantsStartDate}
                  onChange={(e) => setParticipantsStartDate(e.target.value)}
                  className="p-2 sm:p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-white text-sm w-full sm:w-48"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base text-gray-400 mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={participantsEndDate}
                  onChange={(e) => setParticipantsEndDate(e.target.value)}
                  className="p-2 sm:p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-white text-sm w-full sm:w-48"
                />
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <button
                onClick={applyFilter}
                className="w-32 px-6 py-1.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm flex justify-center items-center"
              >
                Filter
              </button>
            </div>
            <div className="space-y-4 max-h-60 overflow-y-auto text-center">
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((participant) => (
                  <div
                    key={participant._id}
                    className="p-3 bg-gray-800 rounded-lg border border-gray-700 animate-fade-in"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200 font-medium text-sm">
                        {participant.socialId}
                      </span>
                      <span className="text-gray-200 font-medium text-sm">
                        {participant.name}
                      </span>
                      <span className="text-gray-200 font-medium text-sm">
                        {new Date(participant.date).toLocaleString()}
                      </span>
                      <button
                        onClick={() => toggleDetails(participant._id)}
                        className="ml-4 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-all duration-300"
                      >
                        Full Details
                      </button>
                    </div>
                    {showDetails[participant._id] && (
                      <div className="mt-2 text-gray-400 text-sm">
                        <p>Phone: {participant.phone}</p>
                        <p>Address: {participant.address}</p>
                        <p>Email: {participant.email}</p>
                        <p>
                          Date: {new Date(participant.date).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center text-sm">
                  No participants in the selected range.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
