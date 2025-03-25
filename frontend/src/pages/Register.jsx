import { useState } from "react";
import NavbarRegister from "../components/NavbarRegister"; // Import NavbarRegister

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    type: "user", // Default to user
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email being submitted:", formData.email);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data);
      alert("Registration successful!");

    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Add NavbarRegister at the top */}
      <NavbarRegister />

      <div className="flex items-center justify-center mt-10">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Please Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="user">User</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
