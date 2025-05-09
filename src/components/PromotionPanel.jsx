"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, ChevronRight } from "lucide-react";

const PromotionPanel = ({ isLargeScreen = false }) => {
  const [promotions, setPromotions] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

  const BASE_URL = "https://bureausync-backend.onrender.com";

  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all promotions
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const promotionsRes = await fetch(`${BASE_URL}/api/public/promotions`);
        if (!isMounted) return;

        if (!promotionsRes.ok) {
          throw new Error(`Failed to fetch data: ${promotionsRes.status}`);
        }

        const promotionsData = await promotionsRes.json();
        console.log("All promotions:", promotionsData);

        if (isMounted) {
          setPromotions(promotionsData || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Fetch error:", err);
          setError("Failed to load promotions. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Determine grid columns based on screen size
  const getGridCols = (itemCount) => {
    if (isLargeScreen) return "grid-cols-3";
    if (windowWidth >= 1536) return "grid-cols-2";
    if (windowWidth >= 1280) return "grid-cols-2";
    if (windowWidth >= 1024) return "grid-cols-2";
    if (windowWidth >= 768) return "grid-cols-2";
    return itemCount > 1 ? "grid-cols-2" : "grid-cols-1";
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={`bg-gray-50 py-${isLargeScreen ? "16" : "6 md:py-12"} h-full flex items-center justify-center`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <svg
            className={`animate-spin ${isLargeScreen ? "h-16 w-16 mb-4" : "h-8 w-8 mb-2"} mx-auto text-blue-600`}
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className={isLargeScreen ? "text-2xl" : ""}>Loading promotions...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && promotions.length === 0) {
    return (
      <div className={`bg-gray-50 py-${isLargeScreen ? "16" : "6 md:py-12"} h-full flex items-center justify-center`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`mb-8 bg-red-50 text-red-700 p-${isLargeScreen ? "6 text-xl" : "4"} rounded-md flex items-center`}
          >
            <svg
              className={`${isLargeScreen ? "h-8 w-8 mr-4" : "h-5 w-5 mr-2"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className={`bg-gray-50 py-${isLargeScreen ? "8" : "4 md:py-6 lg:py-8"} h-full overflow-y-auto`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* All Promotions */}
        {promotions.length > 0 ? (
          <div className={`mb-${isLargeScreen ? "12" : "6 md:mb-8"}`}>
            <h2
              className={`${isLargeScreen ? "text-4xl mb-6" : "text-xl md:text-2xl lg:text-2xl mb-3 md:mb-4"} font-bold text-blue-800`}
            >
              Promotions
            </h2>
            <div className={`grid ${getGridCols(promotions.length)} gap-4 md:gap-6`}>
              {promotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className={`bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-${isLargeScreen ? "8" : "3 md:p-4 lg:p-6"} border border-blue-200 shadow-md`}
                >
                  <div className={isLargeScreen ? "flex items-center gap-8" : "items-center"}>
                    <div className={`${isLargeScreen ? "w-1/2" : ""} relative`}>
                      <div
                        className={`aspect-video ${isLargeScreen ? "h-96" : "h-44"} w-full bg-blue-200 rounded-lg overflow-hidden`}
                      >
                        <img
                          src={
                            promotion.image
                              ? `${BASE_URL}${promotion.image}`
                              : `/placeholder.svg?height=300&width=500`
                          }
                          alt={promotion.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `/placeholder.svg?height=300&width=500`;
                          }}
                        />
                      </div>
                      {promotion.is_featured && (
                        <div
                          className={`absolute -top-${isLargeScreen ? "4 -right-4" : "2 -right-2 md:-top-3 md:-right-3"} bg-blue-600 text-white px-${isLargeScreen ? "4 py-2 text-lg" : "2 md:px-3 py-1 text-xs md:text-sm"} rounded-full font-bold shadow-lg`}
                        >
                          Featured!
                        </div>
                      )}
                    </div>
                    <div className={`${isLargeScreen ? "w-1/2" : "w-full"}`}>
                      <h3
                        className={`${isLargeScreen ? "text-3xl" : "lg:text-lg"} font-bold text-blue-800 mb-${isLargeScreen ? "4" : "1 md:mb-2"}`}
                      >
                        {promotion.title}
                      </h3>
                      <p
                        className={`text-blue-700 ${isLargeScreen ? "text-xl mb-4" : "text-sm mb-2 md:mb-3"} flex items-center`}
                      >
                        <Calendar
                          className={`${isLargeScreen ? "w-8 h-8 mr-3" : "w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2"}`}
                        />
                        {promotion.date}
                      </p>
                      <p className={`text-gray-700 ${isLargeScreen ? "text-xl" : "text-sm md:text-base"}`}>
                        {promotion.description}
                      </p>
                      {promotion.location && (
                        <p className={`mt-${isLargeScreen ? "4" : "2 md:mt-3"} text-blue-700 flex items-center`}>
                          <MapPin
                            className={`${isLargeScreen ? "w-8 h-8 mr-3" : "w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2"}`}
                          />
                          {promotion.location}
                        </p>
                      )}
                      {promotion.cta && (
                        <a
                          href={promotion.cta}
                          className={`mt-${isLargeScreen ? "6" : "3 md:mt-4"} inline-flex items-center px-${isLargeScreen ? "6" : "3 md:px-4"} py-${isLargeScreen ? "3" : "1 md:py-2"} bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isLargeScreen ? "text-xl" : "text-sm md:text-base"}`}
                        >
                          Learn More
                          <ChevronRight
                            className={`ml-${isLargeScreen ? "3" : "1 md:ml-2"} ${isLargeScreen ? "w-6 h-6" : "w-3 h-3 md:w-4 md:h-4"}`}
                          />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No promotions available.</p>
        )}
      </div>
    </div>
  );
};

export default PromotionPanel;