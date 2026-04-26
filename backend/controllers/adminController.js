const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password) admin.password = await bcrypt.hash(password, 10);
    await admin.save();

    res.json({
      success: true,
      message: "Profile updated",
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
