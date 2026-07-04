const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklist.model");

const isProduction = process.env.NODE_ENV === "production";

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const normalizedUsername = username?.trim();
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedUsername || !normalizedEmail || !password) {
    return res.status(400).json({
      success: false,
      message: "username, email and password are required",
    });
  }

  const isExistingUser = await User.findOne({
    $or: [
      { username: new RegExp(`^${escapeRegex(normalizedUsername)}$`, "i") },
      { email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i") },
    ],
  });

  if (isExistingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password: hash,
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    ...cookieOptions,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user:{
      id: user._id,
      username:user.username,
      email:user.email

    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return res.status(400).json({
      success: false,
      message: "email and password are required",
    });
  }

  const user = await User.findOne({
    email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i"),
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Wrong password" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    ...cookieOptions,
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  });
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    const decoded = jwt.decode(token);

    if(!decoded) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }
    const blacklistedToken = new BlacklistToken({ token });
    await blacklistedToken.save();

    res.clearCookie("token", {
      ...cookieOptions,
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user:{
        id: user._id,
        username:user.username,
        email:user.email
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "unauthorized" });
  }
};
module.exports = { register, login, logout , getProfile};