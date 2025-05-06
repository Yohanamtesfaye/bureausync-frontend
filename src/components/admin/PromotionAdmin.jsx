import { useState, useEffect, useRef } from "react";
import { Calendar, MapPin, Plus, Trash, Edit, Save, X, Award, Bell, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PromotionAdmin = () => {
  const [promotions, setPromotions] = useState({
    featured: null,
    events: [],
    achievements: [],
  });
  const [activeTab, setActiveTab] = useState("featured");
  const [editMode, setEditMode] = useState(null);
  const [tempItem, setTempItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  // Image upload handler
  const handleImageUpload = async (file) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${BASE_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("Failed to upload image. Please try again.");
      return null;
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update the save handlers to include image upload
  const handleSaveFeatured = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      // Upload image if selected
      let imageUrl = tempItem.image;
      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage);
        if (!imageUrl) return;
      }

      const response = await fetch(`${BASE_URL}/api/promotions/${promotions.featured.id}`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          ...tempItem,
          image: imageUrl
        }),
      });

      if (response.status === 401) throw new Error("Unauthorized");
      if (!response.ok) throw new Error("Failed to update featured promotion");

      const updatedFeatured = await response.json();
      setPromotions({ ...promotions, featured: updatedFeatured });
      showSuccess("Featured promotion updated successfully!");
      setEditMode(null);
      setTempItem(null);
      setSelectedImage(null);
      setImagePreview("");
    } catch (err) {
      handleApiError(err, "Failed to save featured promotion.");
    }
  };


  const BASE_URL = "http://localhost:3001";
  const getToken = () => localStorage.getItem("token");

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

        const [featuredRes, eventsRes, achievementsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/promotions/featured`, { headers }),
          fetch(`${BASE_URL}/api/events`, { headers }),
          fetch(`${BASE_URL}/api/achievements`, { headers }),
        ]);

        if (featuredRes.status === 401 || eventsRes.status === 401 || achievementsRes.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!featuredRes.ok || !eventsRes.ok || !achievementsRes.ok) {
          throw new Error(
            `Fetch failed: Featured=${featuredRes.status}, Events=${eventsRes.status}, Achievements=${achievementsRes.status}`
          );
        }

        const featured = await featuredRes.json();
        const events = await eventsRes.json();
        const achievements = await achievementsRes.json();

        setPromotions({
          featured: featured || null,
          events: events || [],
          achievements: achievements || [],
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setErrorMessage("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Show success message
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle API errors
  const handleApiError = (err, defaultMessage) => {
    console.error(err);
    if (err.message.includes("401")) {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      setErrorMessage(defaultMessage);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Edit featured promotion
  const handleEditFeatured = () => {
    setEditMode("featured");
    setTempItem({ ...promotions.featured });
  };
  // Toggle visibility
  const handleToggleVisibility = async (type, id, isVisible) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }
      const endpoint = `${BASE_URL}/api/${type}/${id}`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ is_visible: !isVisible }),
      });

      if (response.status === 401) throw new Error("Unauthorized");
      if (!response.ok) throw new Error(`Failed to toggle ${type} visibility`);

      const updatedItem = await response.json();
      if (type === "promotions") {
        setPromotions({ ...promotions, featured: updatedItem });
      } else {
        const key = type === "events" ? "events" : "achievements";
        setPromotions({
          ...promotions,
          [key]: promotions[key].map((item) => (item.id === id ? updatedItem : item)),
        });
      }
      showSuccess(`${type.slice(0, -1)} visibility updated!`);
    } catch (err) {
      handleApiError(err, `Failed to toggle ${type} visibility.`);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditMode(null);
    setTempItem(null);
  };

  // Add new event
  const handleAddEvent = async () => {
    const newEvent = {
      title: "New Event",
      day: new Date().getDate().toString(),
      month: new Date().toLocaleString("default", { month: "short" }),
      time: "9:00 AM - 11:00 AM",
      location: "Location",
      is_visible: true,
    };

    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await fetch(`${BASE_URL}/api/events`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (response.status === 401) throw new Error("Unauthorized");
      if (!response.ok) throw new Error("Failed to add event");

      const addedEvent = await response.json();
      setPromotions({ ...promotions, events: [...promotions.events, addedEvent] });
      showSuccess("Event added successfully!");
    } catch (err) {
      handleApiError(err, "Failed to add event.");
    }
  };

  // Edit event
  const handleEditEvent = (index) => {
    setEditMode(`event-${index}`);
    setTempItem({ ...promotions.events[index] });
  };

  // Save event
  const handleSaveEvent = async (index) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await fetch(`${BASE_URL}/api/events/${promotions.events[index].id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(tempItem),
      });

      if (response.status === 401) throw new Error("Unauthorized");
      if (!response.ok) throw new Error("Failed to update event");

      const updatedEvent = await response.json();
      const newEvents = [...promotions.events];
      newEvents[index] = updatedEvent;
      setPromotions({ ...promotions, events: newEvents });
      showSuccess("Event updated successfully!");
      setEditMode(null);
      setTempItem(null);
    } catch (err) {
      handleApiError(err, "Failed to save event.");
    }
  };

  // Delete event
  const handleDeleteEvent = async (index) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await fetch(`${BASE_URL}/api/events/${promotions.events[index].id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) throw new Error("Unauthorized");
      if (!response.ok) throw new Error("Failed to delete event");

      const newEvents = promotions.events.filter((_, i) => i !== index);
      setPromotions({ ...promotions, events: newEvents });
      showSuccess("Event deleted successfully!");
    } catch (err) {
      handleApiError(err, "Failed to delete event.");
    }
  };

  // Add new achievement
  const handleAddAchievement = async () => {
    const newAchievement = {
      title: "New Achievement",
      description: "Description of the achievement",
      is_visible: true,
    };

    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await fetch(`${BASE_URL}/api/achievements`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(newAchievement),
      });

      if (response.status === 401) throw new Error("Unauthorized");
      if (!response.ok) throw new Error("Failed to add achievement");

      const addedAchievement = await response.json();
      setPromotions({
        ...promotions,
        achievements: [...promotions.achievements, addedAchievement],
      });
      showSuccess("Achievement added successfully!");
    } catch (err) {
      handleApiError(err, "Failed to add achievement.");
    }
  };

  // Edit achievement
  const handleEditAchievement = (index) => {
    setEditMode(`achievement-${index}`);
    setTempItem({ ...promotions.achievements[index] });
  };

  // Save achievement
  const handleSaveAchievement = async (index) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await fetch(`${BASE_URL}/api/achievements/${promotions.achievements[index].id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(tempItem),
      });

      if (response.status === 401) throw new Error("Unauthorized");
      if (!response.ok) throw new Error("Failed to update achievement");

      const updatedAchievement = await response.json();
      const newAchievements = [...promotions.achievements];
      newAchievements[index] = updatedAchievement;
      setPromotions({ ...promotions, achievements: newAchievements });
      showSuccess("Achievement updated successfully!");
      setEditMode(null);
      setTempItem(null);
    } catch (err) {
      handleApiError(err, "Failed to save achievement.");
    }
  };

  // Delete achievement
  const handleDeleteAchievement = async (index) => {
    if (!window.confirm("Are you sure you want to delete this achievement?")) return;

    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await fetch(`${BASE_URL}/api/achievements/${promotions.achievements[index].id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) throw new Error("Unauthorized");
      if (!response.ok) throw new Error("Failed to delete achievement");

      const newAchievements = promotions.achievements.filter((_, i) => i !== index);
      setPromotions({ ...promotions, achievements: newAchievements });
      showSuccess("Achievement deleted successfully!");
    } catch (err) {
      handleApiError(err, "Failed to delete achievement.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - fixed height */}
      <header className="bg-white shadow-sm sticky top-0 z-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">BureauSync Admin</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content - scrollable area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"></div>
          {/* Messages */}
          {successMessage && (
            <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {successMessage}
              </div>
              <button onClick={() => setSuccessMessage("")} className="text-green-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
          )}
          {errorMessage && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {errorMessage}
            </div>
            
          )}

          {isLoading ? (
            <div className="text-center text-gray-600">
              <svg
                className="animate-spin h-8 w-8 mx-auto mb-2 text-blue-600"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </div>
           
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("featured")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "featured"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Featured Promotion
                </button>
                <button
                  onClick={() => setActiveTab("events")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "events"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Events
                </button>
                <button
                  onClick={() => setActiveTab("achievements")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "achievements"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Achievements
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Featured Promotion Tab */}
              {activeTab === "featured" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-blue-600" />
                      Featured Promotion
                    </h2>
                    {editMode !== "featured" && promotions.featured ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleVisibility("promotions", promotions.featured.id, promotions.featured.is_visible)}
                          className={`flex items-center px-3 py-1.5 ${
                            promotions.featured.is_visible
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          } rounded-md`}
                        >
                          {promotions.featured.is_visible ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-1" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-1" />
                              Show
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleEditFeatured}
                          className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      </div>
                    ) : (
                      promotions.featured && (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveFeatured}
                            className="flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  {promotions.featured ? (
                    editMode === "featured" ? (
                      <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={tempItem.title}
                            onChange={(e) => setTempItem({ ...tempItem, title: e.target.value })}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="text"
                            value={tempItem.date}
                            onChange={(e) => setTempItem({ ...tempItem, date: e.target.value })}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={tempItem.description}
                            onChange={(e) => setTempItem({ ...tempItem, description: e.target.value })}
                            rows={4}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <input
                            type="text"
                            value={tempItem.location}
                            onChange={(e) => setTempItem({ ...tempItem, location: e.target.value })}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {selectedImage ? "Change Image" : "Select Image"}
            </button>
            
            {(imagePreview || tempItem.image) && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                <img
                  src={imagePreview || `${BASE_URL}${tempItem.image}`}
                  alt="Preview"
                  className="h-40 object-contain rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
                          <input
                            type="checkbox"
                            checked={tempItem.is_featured}
                            onChange={(e) => setTempItem({ ...tempItem, is_featured: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Visible</label>
                          <input
                            type="checkbox"
                            checked={tempItem.is_visible}
                            onChange={(e) => setTempItem({ ...tempItem, is_visible: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-md">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          <div className="w-full md:w-1/3 relative">
                            <div className="aspect-video bg-blue-200 rounded-lg overflow-hidden">
                              <img
                                src={promotions.featured.image || `/placeholder.svg?height=300&width=500`}
                                alt={promotions.featured.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -top-3 -right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                              {promotions.featured.is_visible ? "Visible" : "Hidden"}
                            </div>
                          </div>
                          <div className="w-full md:w-2/3">
                            <h3 className="text-2xl font-bold text-blue-800 mb-2">{promotions.featured.title}</h3>
                            <p className="text-blue-700 mb-3 flex items-center">
                              <Calendar className="w-5 h-5 mr-2" />
                              {promotions.featured.date}
                            </p>
                            <p className="text-gray-700 text-lg">{promotions.featured.description}</p>
                            {promotions.featured.location && (
                              <p className="mt-3 text-blue-700 flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                {promotions.featured.location}
                              </p>
                            )}
                            <p className="mt-3 text-blue-700">
                              Status: {promotions.featured.is_visible ? "Visible" : "Hidden"} |{" "}
                              {promotions.featured.is_featured ? "Featured" : "Not Featured"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="text-gray-600">No featured promotion available.</p>
                  )}
                </div>
              )}

              {/* Events Tab */}
              {activeTab === "events" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Events
                    </h2>
                    <button
                      onClick={handleAddEvent}
                      className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Event
                    </button>
                  </div>

                  <div className="space-y-4">
                    {promotions.events.length === 0 ? (
                      <p className="text-gray-600">No events available.</p>
                    ) : (
                      promotions.events.map((event, index) => (
                        <div
                          key={event.id}
                          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                        >
                          {editMode === `event-${index}` ? (
                            <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                  type="text"
                                  value={tempItem.title}
                                  onChange={(e) => setTempItem({ ...tempItem, title: e.target.value })}
                                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                                  <input
                                    type="text"
                                    value={tempItem.day}
                                    onChange={(e) => setTempItem({ ...tempItem, day: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                                  <input
                                    type="text"
                                    value={tempItem.month}
                                    onChange={(e) => setTempItem({ ...tempItem, month: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <input
                                  type="text"
                                  value={tempItem.time}
                                  onChange={(e) => setTempItem({ ...tempItem, time: e.target.value })}
                                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                  type="text"
                                  value={tempItem.location}
                                  onChange={(e) => setTempItem({ ...tempItem, location: e.target.value })}
                                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Visible</label>
                                <input
                                  type="checkbox"
                                  checked={tempItem.is_visible}
                                  onChange={(e) => setTempItem({ ...tempItem, is_visible: e.target.checked })}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </div>
                              <div className="flex justify-end space-x-2 pt-2">
                                <button
                                  onClick={() => handleSaveEvent(index)}
                                  className="flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                >
                                  <Save className="w-4 h-4 mr-1" />
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="bg-blue-100 text-blue-800 rounded-lg p-2 flex flex-col items-center justify-center min-w-[60px]">
                                  <span className="text-xl font-bold">{event.day}</span>
                                  <span className="text-sm">{event.month}</span>
                                </div>
                                <div>
                                  <h4 className="font-bold text-blue-800">{event.title}</h4>
                                  <p className="text-sm text-gray-600">{event.time}</p>
                                  <p className="text-sm text-gray-700 mt-1">{event.location}</p>
                                  <p className="text-sm text-gray-700 mt-1">
                                    Status: {event.is_visible ? "Visible" : "Hidden"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleToggleVisibility("events", event.id, event.is_visible)}
                                  className={`p-1 ${
                                    event.is_visible ? "text-yellow-600 hover:bg-yellow-50" : "text-green-600 hover:bg-green-50"
                                  } rounded`}
                                >
                                  {event.is_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => handleEditEvent(index)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(index)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === "achievements" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-blue-600" />
                      Achievements
                    </h2>
                    <button
                      onClick={handleAddAchievement}
                      className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Achievement
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {promotions.achievements.length === 0 ? (
                      <p className="text-gray-600">No achievements available.</p>
                    ) : (
                      promotions.achievements.map((achievement, index) => (
                        <div
                          key={achievement.id}
                          className="bg-gradient-to-b from-blue-50 to-white p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all"
                        >
                          {editMode === `achievement-${index}` ? (
                            <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                  type="text"
                                  value={tempItem.title}
                                  onChange={(e) => setTempItem({ ...tempItem, title: e.target.value })}
                                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                  value={tempItem.description}
                                  onChange={(e) => setTempItem({ ...tempItem, description: e.target.value })}
                                  rows={3}
                                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Visible</label>
                                <input
                                  type="checkbox"
                                  checked={tempItem.is_visible}
                                  onChange={(e) => setTempItem({ ...tempItem, is_visible: e.target.checked })}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </div>
                              <div className="flex justify-end space-x-2 pt-2">
                                <button
                                  onClick={() => handleSaveAchievement(index)}
                                  className="flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                >
                                  <Save className="w-4 h-4 mr-1" />
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center relative">
                              <div className="absolute top-0 right-0 flex space-x-1">
                                <button
                                  onClick={() => handleToggleVisibility("achievements", achievement.id, achievement.is_visible)}
                                  className={`p-1 ${
                                    achievement.is_visible ? "text-yellow-600 hover:bg-yellow-50" : "text-green-600 hover:bg-green-50"
                                  } rounded`}
                                >
                                  {achievement.is_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => handleEditAchievement(index)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAchievement(index)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="inline-block bg-blue-600 text-white rounded-full p-2 mb-3">
                                <Award className="w-5 h-5" />
                              </div>
                              <h4 className="font-bold text-blue-800 mb-2">{achievement.title}</h4>
                              <p className="text-sm text-gray-700">{achievement.description}</p>
                              <p className="text-sm text-gray-700 mt-1">
                                Status: {achievement.is_visible ? "Visible" : "Hidden"}
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PromotionAdmin;