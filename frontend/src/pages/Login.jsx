import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavLogin from "../components/NavLogin";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: formData.email.toLowerCase(), 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");

        // ✅ Store user info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("userId", data.userId || "");
        localStorage.setItem("ownerId", data.ownerId || "");
        localStorage.setItem("userName", data.name || ""); 
        localStorage.setItem("ownerName", data.name || ""); 
        localStorage.setItem("name", data.name || "");

        // ✅ Redirect based on user type
        if (data.userType === "owner") {
          navigate("/owner-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <NavLogin />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
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

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
