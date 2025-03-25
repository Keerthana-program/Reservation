import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token Data:", decoded); // Debugging log

        if (!decoded.userId) {
            return res.status(403).json({ message: "Invalid Token: userId missing" });
        }

        // Assign userId for all authenticated users
        req.userId = decoded.userId;
        console.log("Extracted User ID:", req.userId);
        // Assign ownerId if available
        if (decoded.ownerId) {
            req.ownerId = decoded.ownerId;
        } else if (decoded.role === "owner" && !req.ownerId) {
            req.ownerId = decoded.userId;
        }
        console.log("User ID from token:", req.userId);

        console.log("User Role:", decoded.role);
        next();
    } catch (error) {
        console.error("Token verification failed:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token. Please provide a valid token." });
        }

        return res.status(500).json({ message: "Server error during authentication" });
    }
};
