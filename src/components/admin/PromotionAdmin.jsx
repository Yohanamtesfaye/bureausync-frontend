import { useState, useEffect, useRef } from "react";
import { Calendar, MapPin, Plus, Trash, Edit, Save, X, Award, Bell, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PromotionAdmin = () => {
  const [promotions, setPromotions] = useState({
    featured: null,
  });
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

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

  const BASE_URL = "https://bureausync-backend.onrender.com";
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  };

  // Fetch data from backend
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const token = getToken();
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/login");
          return;
        }

        // Validate token format
        if (!token.startsWith("Bearer ")) {
          console.log("Invalid token format");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const headers = { 
          Authorization: token,
          "Content-Type": "application/json" 
        };

        console.log("Fetching with headers:", headers); // Debug log

        const featuredRes = await fetch(`${BASE_URL}/api/promotions/featured`, { headers });

        if (!isMounted) return;

        if (featuredRes.status === 401 || featuredRes.status === 403) {
          console.log("Authentication failed, redirecting to login");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!featuredRes.ok) {
          const errorData = await featuredRes.json().catch(() => ({}));
          throw new Error(errorData.message || `Fetch failed: Featured=${featuredRes.status}`);
        }

        const featured = await featuredRes.json();
        console.log("Received featured data:", featured); // Debug log

        if (isMounted) {
          setPromotions({
            featured: featured || null,
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.message.includes("401") || err.message.includes("403")) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setErrorMessage("Failed to load data. Please try again.");
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
  const handleToggleVisibility = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/promotions/${promotions.featured.id}`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ is_visible: !promotions.featured.is_visible }),
      });

      if (response.status === 401) throw new Error("Unauthorized");
      if (!response.ok) throw new Error("Failed to toggle promotion visibility");

      const updatedPromotion = await response.json();
      setPromotions({ ...promotions, featured: updatedPromotion });
      showSuccess("Promotion visibility updated!");
    } catch (err) {
      handleApiError(err, "Failed to toggle promotion visibility.");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditMode(null);
    setTempItem(null);
  };

  // Add new featured promotion
  const handleAddPromotion = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      // Upload image if selected
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage);
        if (!imageUrl) return;
      }

      const newPromotion = {
        title: "New Promotion",
        date: new Date().toLocaleDateString(),
        description: "Description of the promotion",
        location: "Location",
        is_visible: true,
        is_featured: true,
        image: imageUrl
      };

      console.log('Sending promotion data:', newPromotion);

      const response = await fetch(`${BASE_URL}/api/promotions`, {
        method: "POST",
        headers: { 
          Authorization: token,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(newPromotion),
      });

      if (response.status === 401) {
        console.log('Authentication failed - token expired or invalid');
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Permission denied:', errorData);
        throw new Error(errorData.message || "You don't have admin privileges to add promotions");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add promotion");
      }

      // Fetch the latest featured promotion
      const featuredResponse = await fetch(`${BASE_URL}/api/promotions/featured`, {
        headers: { 
          Authorization: token,
          "Content-Type": "application/json" 
        }
      });

      console.log('Featured response status:', featuredResponse.status);
      
      if (!featuredResponse.ok) {
        throw new Error("Failed to fetch updated featured promotion");
      }

      const featuredPromotion = await featuredResponse.json();
      console.log('Parsed featured promotion:', featuredPromotion);

      // Create a new state object
      const updatedPromotions = {
        featured: {
          ...featuredPromotion,
          is_featured: Boolean(featuredPromotion.is_featured),
          is_visible: Boolean(featuredPromotion.is_visible)
        }
      };
      
      console.log('Setting new promotions state:', updatedPromotions);
      
      // Update state and force a re-render
      setPromotions(updatedPromotions);
      
      // Reset form state
      setSelectedImage(null);
      setImagePreview("");
      setEditMode(null);
      setTempItem(null);

      showSuccess("Promotion added successfully!");
    } catch (err) {
      console.error("Error adding promotion:", err);
      setErrorMessage(err.message || "Failed to add promotion. Please try again.");
    }
  };

  // Add useEffect to monitor promotions state changes
  useEffect(() => {
    console.log('Promotions state updated:', promotions);
    console.log('Featured promotion:', promotions.featured);
  }, [promotions]);

  // Add useEffect to fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${BASE_URL}/api/promotions/featured`, {
          headers: { 
            Authorization: token,
            "Content-Type": "application/json" 
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch featured promotion");
        }

        const featuredPromotion = await response.json();
        console.log('Initial featured promotion:', featuredPromotion);

        setPromotions({
          featured: {
            ...featuredPromotion,
            is_featured: Boolean(featuredPromotion.is_featured),
            is_visible: Boolean(featuredPromotion.is_visible)
          }
        });
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setErrorMessage("Failed to load promotions. Please try again.");
      }
    };

    fetchData();
  }, [navigate]);

  // Edit featured promotion
  const handleEditPromotion = () => {
    setEditMode("featured");
    setTempItem({ ...promotions.featured });
  };

  // Save edited promotion
  const handleSavePromotion = async () => {
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
      if (!response.ok) throw new Error("Failed to update promotion");

      const updatedPromotion = await response.json();
      setPromotions({ ...promotions, featured: updatedPromotion });
      showSuccess("Promotion updated successfully!");
      setEditMode(null);
      setTempItem(null);
      setSelectedImage(null);
      setImagePreview("");
    } catch (err) {
      handleApiError(err, "Failed to save promotion.");
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-blue-600" />
                    Featured Promotion
                  </h2>
                  <button
                    onClick={handleAddPromotion}
                    className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Promotion
                  </button>
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
                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          onClick={handleSavePromotion}
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
                          <div className="mt-4 flex space-x-2">
                            <button
                              onClick={handleToggleVisibility}
                              className={`p-2 ${
                                promotions.featured.is_visible ? "text-yellow-600 hover:bg-yellow-50" : "text-green-600 hover:bg-green-50"
                              } rounded`}
                            >
                              {promotions.featured.is_visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={handleEditPromotion}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="text-gray-600">No featured promotion available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PromotionAdmin;