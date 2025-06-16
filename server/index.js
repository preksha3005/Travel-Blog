// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const app = express();
// const dotenv = require("dotenv");
// dotenv.config();
// const cookieParser = require("cookie-parser");
// const path = require("path");
// const nodemailer = require("nodemailer");
// const multer = require("multer");
// const User = require("./models/User");
// const Model = require("./models/Model");

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// import bcrypt from "bcrypt";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import User from "./models/User.js";
import Model from "./models/Model.js";

dotenv.config();
const app=express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser()); // middleware function in Express.js that enables the parsing of cookies in incoming requests.
// mongoose.connect("mongodb://localhost:27017/travel").then(() => {
//     console.log("MongoDB connected successfully!");
//   })

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Exit process with failure code if database connection fails
    process.exit(1);
  });

app.post("/sign", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.json({ message: "User already exists with that email." });
  } else {
    const hashp = await bcrypt.hash(password, 10);
    await User.create({ name: name, email: email, password: hashp });
    return res.json({ status: true, message: "Account created" });
  }
});

app.post("/loginapp", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "User does not exist" });
  } else {
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.json({ message: "Wrong password" });
    } else {
      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.KEY,
        {
          expiresIn: "1h",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only set secure: true in production (HTTPS)
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // 'None' for cross-site, 'Lax' for development
        maxAge: 3600000, // Match token expiration: 1 hour in milliseconds
      });

      return res.json({ status: true, message: "Login successful" });
    }
  }
});
app.post("/forgotpass", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User not found" });
  else {
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.KEY, {
      expiresIn: "5m",
    });
    var transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
      },
    });
    var mailOptions = {
      from: process.env.MAIL,
      to: email,
      subject: "Reset Password",
      text: `Click on the link to reset your password:  http://localhost:3000/resetpass/${token}`,
    };
    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.json({ message: "Error sending mail" });
      } else {
        return res.json({ status: true, message: "Email sent" });
      }
    });
  }
});

app.post("/resetpass/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decode = await jwt.verify(token, process.env.KEY);
    console.log("Token verified:", decode);
    const id = decode.id;
    const hash = await bcrypt.hash(password, 8);
    const user = await User.findByIdAndUpdate(id, { password: hash });
    return res.json({ status: true, message: "Updated" });
  } catch {
    return res.json({ message: "Invalid token" });
  }
});

const verifyuser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ message: "No token" });
  }
  const decode = await jwt.verify(token, process.env.KEY);
  req.user = { id: decode.id, name: decode.name };
  console.log("Verified user:", req.user);
  next();
};
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true, message: "Logged out" });
});
app.get("/initial", verifyuser, (req, res) => {
  console.log("req.user:", req.user);
  try {
    const userN = req.user.name[0];
    const initial = userN;
    res.json({ initial });
  } catch (err) {
    console.error("Error:", err);
    res.json({ message: "Error" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.post("/upload", verifyuser, upload.single("file"), (req, res) => {
  const userId = req.user.id;
  try {
    console.log(req.file.filename);
    console.log(req.body.name);
    console.log(req.body.content);
    console.log(req.body.mail);
    Model.create({
      img: req.file.filename,
      name: req.body.name,
      content: req.body.content,
      mail: req.body.mail,
      user: userId,
    });
    return res.json({ status: true, message: "Stored" });
  } catch {
    return res.json({ message: "Error" });
  }
});

app.get("/get", verifyuser, (req, res) => {
  const userId = req.user.id;
  Model.find({ user: userId })
    .populate("user", "name email")
    .then((img) => res.json(img))
    .catch((err) => res.json({ message: "ERROR" }));
});

app.get("/get/:filename", verifyuser, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, `public/images/${filename}`);
  res.sendFile(filePath);
});

app.get("/getblog", (req, res) => {
  Model.find()
    .then((blogs) => res.json(blogs))
    .catch((err) => res.json({ message: "ERROR" }));
});

app.get("/getblog/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, `public/images/${filename}`);
  res.sendFile(filePath);
});

app.put("/update/:id", verifyuser, async (req, res) => {
  const { id } = req.params;
  const { name, content, mail } = req.body;
  const userId = req.user.id;
  try {
    const updatedCard = await Model.findOneAndUpdate(
      { _id: id, user: userId },
      { name, content, mail },
      { new: true }
    );
    if (!updatedCard) {
      return res
        .status(404)
        .json({
          message: "Card not found or you don't have permission to edit it.",
        });
    }

    return res.json({
      status: true,
      message: "Card updated successfully",
      updatedCard,
    });
  } catch (err) {
    console.error("Error: ", err);
  }
});

app.delete("/del/:id", verifyuser, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  await Model.findByIdAndDelete({ _id: id })
    .then((result) => {
      Model.find({ user: userId })
        .exec()
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  );
}

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
