import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [secretCode, setSecretCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (secretCode === "111") {
      navigate("/admin-dashboard");
    } else {
      setError("Invalid Secret Code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <label className="block mb-2">Enter Secret Code:</label>
        <input
          type="password"
          value={secretCode}
          onChange={(e) => setSecretCode(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
        <p>Secret code(111)</p>
      </form>
    </div>
  );
};

export default AdminPage;