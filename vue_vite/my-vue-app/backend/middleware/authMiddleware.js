const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("📢 (authMiddleware) 요청 받은 Authorization 헤더:", req.headers.authorization);
    console.log("📢 (authMiddleware) 분리된 토큰:", token);

    if (!token) {
        console.log("❌ (authMiddleware) 토큰 없음!");
        return res.status(401).json({ message: "인증이 필요합니다." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ (authMiddleware) 검증된 토큰 정보:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ (authMiddleware) 잘못된 토큰:", error.message);
        return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    }
};
