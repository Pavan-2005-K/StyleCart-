
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

// Get logged-in user profile
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    user: req.user
  });
});

module.exports = router;
