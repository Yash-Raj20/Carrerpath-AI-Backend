import User from "../../models/UserModel.js/User.js";

// 🔍 Get current user's profile
export const getUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
};

// ✏️ Update profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 📊 Get dashboard info
export const getDashboard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      interviewHistory = [],
      lastResumeUploaded = false,
      lastCourseGoal = "",
    } = user;

    res.json({ interviewHistory, lastResumeUploaded, lastCourseGoal });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};