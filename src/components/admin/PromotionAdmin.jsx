"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, MapPin, Plus, Trash, Edit, Save, X, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PromotionAdmin = () => {
  const [promotions, setPromotions] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [tempItem, setTempItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const BASE_URL = "https://bureausync-backend.onrender.com";

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  };

  // Image upload handler
  const handleImageUpload = async (file) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return null;
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${BASE_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: token,
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch all promotions
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${BASE_URL}/api/promotions`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (!isMounted) return;

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Fetch failed: ${response.status}`);
        }

        const promotionsData = await response.json();
        console.log("Received promotions data:", promotionsData);

        if (isMounted) {
          setPromotions(promotionsData || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.message.includes("401") || err.message.includes("403")) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setErrorMessage("Failed to load promotions. Please try again.");
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
    if (err.message.includes("401") || err.message.includes("403")) {
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

  // Add new promotion
  const handleAddPromotion = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

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
        is_featured: false,
        image: imageUrl,
      };

      const response = await fetch(`${BASE_URL}/api/promotions`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPromotion),
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add promotion");
      }

      const addedPromotion = await response.json();
      setPromotions([addedPromotion, ...promotions]);
      setSelectedImage(null);
      setImagePreview("");
      showSuccess("Promotion added successfully!");
    } catch (err) {
      handleApiError(err, "Failed to add promotion. Please try again.");
    }
  };

  // Edit promotion
  const handleEditPromotion = (promotion) => {
    setEditMode(promotion.id);
    setTempItem({ ...promotion });
    setImagePreview(promotion.image ? `${BASE_URL}${promotion.image}` : "");
    setSelectedImage(null);
  };

  // Save edited promotion
  const handleSavePromotion = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      let imageUrl = tempItem.image;
      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage);
        if (!imageUrl) return;
      }

      const response = await fetch(`${BASE_URL}/api/promotions/${tempItem.id}`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...tempItem,
          image: imageUrl,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update promotion");
      }

      const updatedPromotion = await response.json();
      setPromotions(
        promotions.map((promo) =>
          promo.id === updatedPromotion.id ? updatedPromotion : promo
        )
      );
      showSuccess("Promotion updated successfully!");
      setEditMode(null);
      setTempItem(null);
      setSelectedImage(null);
      setImagePreview("");
    } catch (err) {
      handleApiError(err, "Failed to save promotion.");
    }
  };

  // Delete promotion
  const handleDeletePromotion = async (id) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/promotions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete promotion");
      }

      setPromotions(promotions.filter((promo) => promo.id !== id));
      showSuccess("Promotion deleted successfully!");
    } catch (err) {
      handleApiError(err, "Failed to delete promotion.");
    }
  };

  // Toggle visibility
  const handleToggleVisibility = async (id) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const promotion = promotions.find((promo) => promo.id === id);
      const response = await fetch(`${BASE_URL}/api/promotions/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_visible: !promotion.is_visible }),
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to toggle promotion visibility");
      }

      const updatedPromotion = await response.json();
      setPromotions(
        promotions.map((promo) =>
          promo.id === updatedPromotion.id ? updatedPromotion : promo
        )
      );
      showSuccess("Promotion visibility updated!");
    } catch (err) {
      handleApiError(err, "Failed to toggle promotion visibility.");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditMode(null);
    setTempItem(null);
    setSelectedImage(null);
    setImagePreview("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
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
                  <h2 className="text-xl font-bold text-gray-900">Promotions</h2>
                  <button
                    onClick={handleAddPromotion}
                    className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Promotion
                  </button>
                </div>

                {promotions.length > 0 ? (
                  promotions.map((promotion) =>
                    editMode === promotion.id ? (
                      <div key={promotion.id} className="space-y-4 bg-blue-50 p-4 rounded-lg mb-4">
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">Is Featured</label>
                          <input
                            type="checkbox"
                            checked={tempItem.is_featured}
                            onChange={(e) => setTempItem({ ...tempItem, is_featured: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                      <div
                        key={promotion.id}
                        className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-md mb-4"
                      >
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          <div className="w-full md:w-1/3 relative">
                            <div className="aspect-video bg-blue-200 rounded-lg overflow-hidden">
                              <img
                                src={promotion.image ? `${BASE_URL}${promotion.image}` : `/placeholder.svg?height=300&width=500`}
                                alt={promotion.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -top-3 -right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                              {promotion.is_visible ? "Visible" : "Hidden"}
                            </div>
                            {promotion.is_featured && (
                              <div className="absolute -top-3 -left-3 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                Featured
                              </div>
                            )}
                          </div>
                          <div className="w-full md:w-2/3">
                            <h3 className="text-2xl font-bold text-blue-800 mb-2">{promotion.title}</h3>
                            <p className="text-blue-700 mb-3 flex items-center">
                              <Calendar className="w-5 h-5 mr-2" />
                              {promotion.date}
                            </p>
                            <p className="text-gray-700 text-lg">{promotion.description}</p>
                            {promotion.location && (
                              <p className="mt-3 text-blue-700 flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                {promotion.location}
                              </p>
                            )}
                            <div className="mt-4 flex space-x-2">
                              <button
                                onClick={() => handleToggleVisibility(promotion.id)}
                                className={`p-2 ${
                                  promotion.is_visible ? "text-yellow-600 hover:bg-yellow-50" : "text-green-600 hover:bg-green-50"
                                } rounded`}
                              >
                                {promotion.is_visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                              <button
                                onClick={() => handleEditPromotion(promotion)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeletePromotion(promotion.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-gray-600">No promotions available.</p>
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