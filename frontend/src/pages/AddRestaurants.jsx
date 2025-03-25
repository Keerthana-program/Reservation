import { useState } from "react";
import NavBarOwner from "../components/NavBarOwner";
import { useAuth } from "../context/AuthContext";

const AddRestaurants = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [location, setLocation] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [hours, setHours] = useState("");
  const [contact, setContact] = useState("");
  const [features, setFeatures] = useState("");
  const [menuItems, setMenuItems] = useState([{ name: "", price: "" }]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const { owner } = useAuth();
  const token = localStorage.getItem("token");

  // Handle adding a new menu item
  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: "", price: "" }]);
  };

  // Handle removing a menu item
  const removeMenuItem = (index) => {
    const updatedMenu = [...menuItems];
    updatedMenu.splice(index, 1);
    setMenuItems(updatedMenu);
  };

  // Handle updating menu items
  const handleMenuChange = (index, field, value) => {
    const updatedMenu = [...menuItems];
    updatedMenu[index][field] = value;
    setMenuItems(updatedMenu);
  };

  if (!token) {
    console.error("No token found in localStorage");
    return;
  }
  // Handle image selection
  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + uploadedImages.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }
    setSelectedImages((prevImages) => [...prevImages, ...files]); // ✅ Keep previous selections
  };


  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files)); // Converts FileList to an array
  };
  

  // Function to upload all selected images
  // Function to upload all selected images
  const uploadImages = async () => {
    const uploadedUrls = [];

    // Loop through each selected image file and upload it
    for (const file of selectedImages) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("http://localhost:5000/api/restaurants/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        uploadedUrls.push(data.imageUrl); // Save the returned URL
        console.log("Image uploaded successfully:", data.imageUrl);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
    setUploadedImages(uploadedUrls);
  };
  
  
    
  

  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = {
      name: restaurantName,
      location,
      contact,
      cuisine,
      features: features.split(",").map(f => f.trim()),
      hours,
      menu: menuItems.map(item => ({ name: item.name, price: item.price })),
      images: uploadedImages,
    };
  
    console.log("🚀 Sending restaurant data:", JSON.stringify(formData, null, 2));
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found in localStorage");
        return;
      }
  
      const response = await fetch("http://localhost:5000/api/restaurants/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // ✅ Corrected syntax
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }
  
      const data = await response.json();
      alert("Restaurant added successfully! 🎉");
      console.log("✅ Restaurant added successfully:", data);
    } catch (error) {
      console.error("❌ Error adding restaurant:", error);
    }
  };
  
  return (
    <div>
      <NavBarOwner />
      <div className="min-h-screen bg-blue-100 p-8 flex justify-center">

        <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">Add Restaurant</h2>

          {/* Restaurant Details Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restaurant Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Restaurant Name</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            {/* Cuisine Type */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Cuisine Type</label>
              <input
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            {/* Hours of Operation */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Hours of Operation</label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            {/* Contact Details */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Contact Details</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Features (comma-separated)</label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md h-24"
              ></textarea>
            </div>

            {/* Menu Items */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Menu Items</label>
              {menuItems.map((item, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="Dish Name"
                    value={item.name}
                    onChange={(e) => handleMenuChange(index, "name", e.target.value)}
                    className="w-2/3 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleMenuChange(index, "price", e.target.value)}
                    className="w-1/3 p-2 border border-gray-300 rounded-md"
                  />
                  <button type="button" onClick={() => removeMenuItem(index)} className="text-red-500">
                    ❌
                  </button>
                </div>
              ))}
              <button type="button" onClick={addMenuItem} className="bg-green-500 text-white px-4 py-2 rounded">
                + Add Item
              </button>
            </div>

                       {/* Image Upload Section */}
                       <div>
              <label className="block text-gray-700 font-semibold mb-2">Upload Images (Max: 3)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={uploadImages}
                className="bg-purple-500 text-white px-4 py-2 mt-2 rounded"
              >
                Upload Images
              </button>

              {/* Display uploaded images */}
              <div className="mt-4 flex flex-wrap gap-2">
                {uploadedImages.map((image, index) => (
                  <img key={index} src={image} alt="Uploaded" className="w-24 h-24 object-cover rounded-md" />
                ))}
              </div>
            </div>



            {/* Save Button */}
            <button type="submit" className="bg-blue-500 text-white px-6 py-3 w-full rounded text-lg font-semibold">
              Save Restaurant
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurants;
