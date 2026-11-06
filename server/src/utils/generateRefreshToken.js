import crypto from "crypto";

const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

export default generateRefreshToken;