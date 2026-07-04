const express = require("express");
const {register, login, logout, getProfile} = require("../controllers/auth.controller")
const { authUser } = require("../middlewares/auth.middleware")

const Router = express.Router();

/**
 *@route POST /api/auth/register
 *@desc Register a new user
 *@access Public
 */
Router.post("/register", register )

/**
 *@route POST /api/auth/login
 *@desc Login a user
 *@access Public
 */
Router.post("/login", login)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
Router.get("/logout", logout)

/**
 * @route GET /api/auth/profile
 * @description get user details from token
 * @access private
 */
Router.get("/profile", authUser, getProfile);

module.exports = Router;
