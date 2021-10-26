const userRouter = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { generateToken } = require("../helpers/Token");
var jwt = require("jsonwebtoken");
const verifyUser = require("../middlewares/VerifyUser");
require("dotenv").config();
const nodemailer = require("../config/nodemailer");

userRouter.post("/login", async (req, res, next) => {
  const { body } = req;
  try {
    if (body.email && body.password) {
      const user = await User.findOne({ email: body.email });
      if (!user) {
        return res.status(400).json({ message: "Email Does not Exist" });
      }
      if (user.status != "Active") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }
      if (user.password) {
        match = await bcrypt.compare(body.password, user.password);
        if (match) {
          const token = await generateToken(user._id);
          res.status(200).json({
            token: token,
            userId: user._id,
          });
        } else {
          return res.status(400).json({ message: "password invalid" });
        }
      }
    } else {
      return res
        .status(400)
        .json({ message: "Password and Email are Required" });
    }
  } catch (error) {
    console.log(error);
    return next(new Error("server error"));
  }
});

userRouter.post("/register", async (req, res) => {
  const { body } = req;
  try {
    existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already exists" });
    } else {
      const token = jwt.sign({ email: body.email }, process.env.token);
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(body.password, salt);
      body.password = hashedPassword;
      const user = new User({
        username: body.username,
        email: body.email,
        password: body.password,
        confirmationCode: token,
      });
      const savedUser = await user.save();
      nodemailer.sendConfirmationEmail(
        savedUser.username,
        savedUser.email,
        savedUser.confirmationCode
      );
      return res.status(200).send({
        message: "User was registered successfully! Please check your email",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

module.exports = userRouter;
