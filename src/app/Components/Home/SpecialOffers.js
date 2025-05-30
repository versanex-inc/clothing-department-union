import React from "react";

const SpecialOffers = () => {
  const socialLinks = [
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@clothingdepartmentunion", // Replace with your actual TikTok link
      icon: (
        <svg
          className="w-6 h-6 text-gray-200 hover:text-white transition-colors duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.89 2.89 0 0 1 1.1.23V9.35a6.34 6.34 0 0 0-1.1-.1 6.34 6.34 0 0 0-5.12 9.62 6.34 6.34 0 0 0 10.67-4.58V8.29a8.29 8.29 0 0 0 4.56 1.41V6.24a4.83 4.83 0 0 1-1-1.55z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@clothingdepartmentunion", // Replace with your actual YouTube link
      icon: (
        <svg
          className="w-6 h-6 text-gray-200 hover:text-white transition-colors duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M23.5 6.2a3.1 3.1 0 0 0-2.2-2.2C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.3.5a3.1 3.1 0 0 0-2.2 2.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3.1 3.1 0 0 0 2.2 2.2c1.9.5 9.3.5 9.3.5s7.4 0 9.3-.5a3.1 3.1 0 0 0 2.2-2.2c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.5V8.5l6 3.5-6 3.5z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/clothingdepartmentunion", // Replace with your actual Facebook link
      icon: (
        <svg
          className="w-6 h-6 text-gray-200 hover:text-white transition-colors duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4h-3V12.1h3V9.5c0-3 1.8-4.7 4.5-4.7 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-1.9.7-1.9 1.9v2.3h3.3l-.5 3.5h-2.8v8.4c5.7-.9 10.1-5.9 10.1-11.9z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/clothingdepartmentunion", // Replace with your actual Instagram link
      icon: (
        <svg
          className="w-6 h-6 text-gray-200 hover:text-white transition-colors duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.3 2.3.5.6.2 1 .5 1.5 1s.8 1 1 1.5c.2.4.4 1.1.5 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.9-.5 2.3-.2.6-.5 1-1 1.5s-1 .8-1.5 1c-.4.2-1.1.4-2.3.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.3-2.3-.5-.6-.2-1-.5-1.5-1s-.8-1-1-1.5c-.2-.4-.4-1.1-.5-2.3-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.3-1.9.5-2.3.2-.6.5-1 1-1.5s1-.8 1.5-1c.4-.2 1.1-.4 2.3-.5 1.2-.1 1.6-.1 4.8-.1zm0-2.2C8.7 0 8.2 0 7 .1c-1.3.1-2.2.3-2.9.6-.8.3-1.5.8-2.2 1.5S.5 3.8.2 4.5C-.1 5.2-.3 6.1-.4 7.2c-.1 1.3-.1 1.8-.1 5.1s0 3.8.1 5.1c.1 1.3.3 2.2.6 2.9.3.8.8 1.5 1.5 2.2s1.5 1 2.2 1.5c.7.3 1.6.5 2.9.6 1.3.1 1.8.1 5.1.1s3.8 0 5.1-.1c1.3-.1 2.2-.3 2.9-.6.8-.3 1.5-.8 2.2-1.5s1-1.5 1.5-2.2c.3-.7.5-1.6.6-2.9.1-1.3.1-1.8.1-5.1s0-3.8-.1-5.1c-.1-1.3-.3-2.2-.6-2.9-.3-.8-.8-1.5-1.5-2.2s-1.5-1-2.2-1.5c-.7-.3-1.6-.5-2.9-.6-1.3-.1-1.8-.1-5.1-.1zM12 5.8c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2-2.8-6.2-6.2-6.2zm0 10.2c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm6.5-10.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/923457778536", // Your WhatsApp link
      icon: (
        <svg
          className="w-6 h-6 text-gray-200 hover:text-white transition-colors duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full py-8 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 uppercase tracking-wide text-gray-100">
          Follow Us for Exclusive Offers
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-5">
          Stay connected for a chance to enjoy special discounts and updates.
        </p>
        <div className="flex justify-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-full hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;