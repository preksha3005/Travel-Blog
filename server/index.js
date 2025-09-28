import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { storage } from "./cloudinary.js";
import User from "./models/User.js";
import Model from "./models/Model.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "https://travel-blog-frontend-28g5.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "travel-blog", // folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

app.post("/upload", verifyuser, upload.single("file"), async (req, res) => {
  const userId = req.user.id;
  try {
    // Cloudinary returns URL in req.file.path
    const imgUrl = req.file.path;

    await Model.create({
      img: imgUrl, // store the cloudinary URL
      name: req.body.name,
      content: req.body.content,
      mail: req.body.mail,
      user: userId,
    });

    return res.json({ status: true, message: "Stored", imgUrl });
  } catch (err) {
    console.error(err);
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


app.get("/getblog", async (req, res) => {
  try {
    const blogs = await Model.find();
    res.json(blogs); // each blog.img now contains the cloudinary URL
  } catch (err) {
    res.json({ message: "ERROR" });
  }
});

app.get("/getblog/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, `public/images/${filename}`);
  console.log(`[Image Serve Debug] Attempting to serve file from: ${filePath}`); // <<< ADD THIS LOG
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(
        `[Image Serve Error] Error sending file ${filename}:`,
        err.message
      );
      res.status(404).send("File not found or server access issue.");
    }
  });
  // res.sendFile(filePath);
});

app.use(express.static(path.join(__dirname, "public")));

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
      return res.status(404).json({
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

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")));
//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
//   );
// }

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
