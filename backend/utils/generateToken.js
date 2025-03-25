import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.userId,
            role: user.type, // Ensures role is stored
            ownerId: user.ownerId || null, // Stores ownerId if applicable
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export default generateToken;
