"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Giveaways() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "92 3000000000",
    address: "",
    email: "",
    socialId: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [winners, setWinners] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [winnersRes, lockRes] = await Promise.all([
          fetch("/api/giveawaywinners"),
          fetch("/api/giveawaylock"),
        ]);
        const winnersData = await winnersRes.json();
        const lockData = await lockRes.json();
        setWinners(winnersData);
        setIsLocked(lockData.isLocked);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const userInput = value.replace(/^92 /, "");
      setFormData({ ...formData, [name]: userInput ? `92 ${userInput}` : "92 3000000000" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) {
      setError("Giveaway is currently locked. Please check back later.");
      return;
    }
    if (!formData.name || !formData.phone.replace("92 ", "").trim() || !formData.address || !formData.email || !formData.socialId.trim()) {
      setError("All fields are required.");
      return;
    }

    const checkRes = await fetch("/api/giveaway/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: formData.phone, email: formData.email, socialId: formData.socialId }),
    });
    const checkData = await checkRes.json();

    if (checkData.exists) {
      setError("You have already participated in this giveaway.");
      return;
    }

    const submitRes = await fetch("/api/giveaway", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, phone: formData.phone.replace("92 ", "") }),
    });
    if (submitRes.ok) {
      setSuccess("Entry submitted successfully!");
      setFormData({ name: "", phone: "92 3000000000", address: "", email: "", socialId: "" });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setError("Failed to submit entry.");
    }
  };

  if (isLocked) {
    return (
      <section className="w-full min-h-screen py-12 bg-black text-white flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-6 uppercase tracking-wide text-gray-200">
            Giveaway Locked
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            The giveaway is Coming soon. Please check back later!
          </p>
          <Link
            href="/"
            className="inline-block py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm"
          >
            Return to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen py-12 bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-center mb-8 uppercase tracking-wide text-gray-200">
          Giveaways
        </h1>

        <div className="relative mb-6">
          <select
            onChange={(e) => {
              const section = e.target.value;
              if (section) {
                const element = document.getElementById(section);
                if (element) {
                  const offset = 80;
                  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                  window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
                }
              }
            }}
            className="w-full md:w-56 p-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-300 font-medium appearance-none bg-[url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22><path stroke=%22%23D1D5DB%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M6 8l4 4 4-4%22/></svg>')] bg-no-repeat bg-right-2 bg-center text-sm"
          >
            <option value="" className="text-gray-500">Jump to Section</option>
            <option value="giveaway-participate">Participate</option>
            <option value="giveaway-winners">Current Winners</option>
            <option value="previous-giveaways">Previous Winners</option>
            <option value="giveaway-rules">Rules</option>
          </select>
        </div>

        <div id="giveaway-participate" className="mb-8">
          <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-md border border-gray-800 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-6 text-gray-200 text-center">Participate</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-center text-sm font-medium">{error}</p>}
              {success && <p className="text-green-500 text-center text-sm font-medium">{success}</p>}
              <input
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-white placeholder-gray-400 text-sm transition-all duration-200"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="92 3000000000"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-white placeholder-gray-400 text-sm transition-all duration-200"
                required
                style={{ color: formData.phone === "92 3000000000" ? "#A3A3A3" : "inherit" }}
              />
              <input
                type="text"
                name="address"
                placeholder="Your Complete Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-white placeholder-gray-400 text-sm transition-all duration-200"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-white placeholder-gray-400 text-sm transition-all duration-200"
                required
              />
              <input
                type="text"
                name="socialId"
                placeholder="Instagram: @username or TikTok: @username"
                value={formData.socialId}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-white placeholder-gray-400 text-sm transition-all duration-200"
                required
              />
              <button
                type="submit"
                className="w-full py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm"
              >
                Submit Entry
              </button>
            </form>
          </div>
        </div>

        <div id="giveaway-winners" className="mb-8">
          <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-md border border-gray-800 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-6 text-gray-200 text-center">Current Winners</h2>
            <div className="space-y-3">
              {winners.length > 0 ? (
                winners.map((winner, index) => (
                  <div key={index} className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex justify-between items-center">
                    <span className="text-gray-200 font-medium text-sm">{winner.socialId}</span>
                    <span className="text-gray-500 text-xs">{new Date(winner.date).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center text-sm">No winners announced yet.</p>
              )}
            </div>
          </div>
        </div>

        <div id="previous-giveaways" className="mb-8">
          <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-md border border-gray-800 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-6 text-gray-200 text-center">Previous Winners</h2>
            <div className="space-y-3">
              {winners.length > 0 ? (
                winners.map((winner, index) => (
                  <div key={index} className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex justify-between items-center">
                    <span className="text-gray-200 font-medium text-sm">{winner.socialId}</span>
                    <span className="text-gray-500 text-xs">{new Date(winner.date).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center text-sm">No previous winners to display.</p>
              )}
            </div>
            <button className="mt-4 w-full py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm">
              View More
            </button>
          </div>
        </div>

        <div id="giveaway-rules" className="">
          <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-md border border-gray-800 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-6 text-gray-200 text-center">Rules & Guidelines</h2>
            <ul className="list-disc pl-5 space-y-3 text-gray-400">
              <li className="pl-2 text-sm">Participants must be 18 years or older.</li>
              <li className="pl-2 text-sm">One entry per person per day is allowed.</li>
              <li className="pl-2 text-sm">Winners will be announced on our official social media channels.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}