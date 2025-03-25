import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Unauthorized: No token found");
            setLoading(false);
            return;
        }

        try {
          const response = await fetch("http://localhost:5000/api/admin/users", { // ✅ Correct API path
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, 
                "Content-Type": "application/json",
            },
        });
        
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    fetchUsers();
}, []);



  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">User Details</h1>
      
      <button 
        className="bg-gray-500 text-white px-4 py-2 mb-4 rounded hover:bg-gray-700"
        onClick={() => navigate(-1)}
      >
        ⬅ Back to Admin Dashboard
      </button>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && users.length === 0 && <p>No users found.</p>}

      {!loading && !error && users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-white ${user.type === "owner" ? "bg-blue-500" : "bg-green-500"}`}>
                        {user.type.toUpperCase()}
                    </span>
                </td>
            </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUser;
