import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { Config } from "../config/config.js";
const protectRoute = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token)
            return res
                .status(401)
                .json({ message: "No authentication token, access denied" });
        const decoded = jwt.verify(token, Config.JWT_SECRET);
        // find user
        const user = await User.findById(decoded.userId).select("-password");
        if (!user)
            return res.status(401).json({ message: "Token is not valid" });
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Token is not valid" });
    }
};
export default protectRoute;
//# sourceMappingURL=auth.middleware.js.map