import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-100"> {/* Light blue background */}
      {/* Navbar */}
      <Navbar />

      {/* Centered Card Section */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center mb-4">
            Welcome to Reserve Your Spot
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Please login or register to continue.
          </p>

          <div className="space-y-4">
            <a
              href="/login"
              className="block text-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Login
            </a>
            <a
              href="/register"
              className="block text-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Register
            </a>
            <a
              href="/admin"
              className="block text-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
